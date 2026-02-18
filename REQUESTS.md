# @nan0web/auth-core — REQUESTS

## 1. AccessControl — Universal Access Resolver

**Пріоритет**: 🔴 High
**Версія**: 1.1.0

### Контекст

В `@nan0web/auth-node` вже є `AccessControl.js` (178 рядків), але він прив'язаний до `AuthDB` (async, серверний).
В `willni` CLI ми адаптували цю логіку для файлової системи (sync, `db-fs`).

Суть: **parsing + matching логіка — universal**. Вона не залежить від джерела даних.

### Що реалізувати

Створити `src/AccessControl.js` — **pure universal** клас, що приймає вже готові строки (не читає файли сам):

```javascript
export default class AccessControl {
  static ANY = '*'
  static READ = 'r'
  static WRITE = 'w'
  static DELETE = 'd'

  /**
   * Load rules from raw content strings.
   * @param {string} accessContent — вміст .access файлу
   * @param {string} groupContent  — вміст .group файлу
   */
  load(accessContent, groupContent) { ... }

  /**
   * Check access: user → groups → global.
   * @param {string} username
   * @param {string} path — URL path (e.g. "/admin")
   * @param {string} [level='r']
   * @returns {boolean}
   */
  check(username, path, level = 'r') { ... }

  /**
   * Get access summary for a user.
   * @param {string} username
   * @returns {{ rules: Array, groups: string[] }}
   */
  info(username) { ... }

  /**
   * Filter navigation items by access.
   * @param {Array<{path: string, guest?: boolean}>} navItems
   * @param {string|null} username — null = guest
   * @returns {Array}
   */
  filterNav(navItems, username) { ... }
}
```

### Формат файлів (специфікація)

#### `.access` — Правила доступу

```
# subject  rights  path
*          r       /public
members    rw      /dashboard
admin      rwd     /admin
```

- Subject: ім'я групи або `*` (всі)
- Rights: `r` (read) | `w` (write) | `d` (delete), можна комбінувати: `rwd`
- Path: URL-шлях, prefix matching (`/admin` → matches `/admin/users`)
- Рядки з `#` — коментарі

#### `.group` — Реєстр груп

```
# groupname  user1 user2 ...
admin        sovr
members      sovr artem dmytro
```

### Резолюція доступу (3 рівні)

```
1. Group rules  — username в .group → відповідна група в .access
2. Global rules — subject = * в .access
```

### Ключова різниця від auth-node

|              | auth-node AccessControl         | auth-core AccessControl  |
| ------------ | ------------------------------- | ------------------------ |
| I/O          | async, читає файли через AuthDB | **pure, приймає строки** |
| Залежності   | AuthDB, db-fs                   | **нуль**                 |
| Використання | Тільки сервер                   | **Сервер, CLI, браузер** |

### Reference implementation

Файл: `willni/cli/access.mjs` (~190 рядків)
Тести: `willni/cli/access.test.mjs` (~183 рядки, 34 тести)

### Тести

```javascript
// src/AccessControl.test.js

suite('AccessControl', () => {
  const ACCESS = [
    '*          r    /login',
    '*          r    /course',
    'members    r    /dashboard',
    'members    rw   /payment',
    'admin      rwd  /admin',
  ].join('\n')

  const GROUPS = ['admin    sovr', 'members  sovr artem maria'].join('\n')

  // Табличні тести — [user, level, path, expected]
  const cases = [
    // Public
    ['guest', 'r', '/course', true],
    ['guest', 'r', '/dashboard', false],
    ['guest', 'r', '/admin', false],

    // Member
    ['artem', 'r', '/dashboard', true],
    ['artem', 'r', '/course', true],
    ['artem', 'w', '/payment', true],
    ['artem', 'r', '/admin', false],

    // Admin
    ['sovr', 'r', '/admin', true],
    ['sovr', 'w', '/admin', true],
    ['sovr', 'd', '/admin', true],
    ['sovr', 'r', '/dashboard', true],

    // Unknown
    ['nobody', 'r', '/course', true],
    ['nobody', 'r', '/admin', false],
  ]

  it('tabular check()', () => {
    const ac = new AccessControl()
    ac.load(ACCESS, GROUPS)
    for (const [user, level, path, expected] of cases) {
      assert.equal(ac.check(user, path, level), expected, `${user} ${level} ${path}`)
    }
  })

  it('info() returns rules and groups', () => {
    const ac = new AccessControl()
    ac.load(ACCESS, GROUPS)
    const { rules, groups } = ac.info('sovr')
    assert.deepEqual(groups, ['admin', 'members'])
    assert.ok(rules.some((r) => r.target === '/admin'))
  })

  it('filterNav() hides items based on access', () => {
    const ac = new AccessControl()
    ac.load(ACCESS, GROUPS)
    const nav = [
      { path: '/dashboard' },
      { path: '/login', guest: true },
      { path: '/course' },
      { path: '/admin' },
    ]
    // Guest
    const guestNav = ac.filterNav(nav, null)
    assert.ok(guestNav.some((n) => n.path === '/course'))
    assert.ok(!guestNav.some((n) => n.path === '/admin'))
    // Member
    const memberNav = ac.filterNav(nav, 'artem')
    assert.ok(memberNav.some((n) => n.path === '/dashboard'))
    assert.ok(!memberNav.some((n) => n.path === '/login'))
  })

  it('empty input — denies all', () => {
    const ac = new AccessControl()
    ac.load('', '')
    assert.equal(ac.check('anyone', '/anything'), false)
  })

  it('path normalization — adds leading /', () => {
    const ac = new AccessControl()
    ac.load(ACCESS, GROUPS)
    assert.equal(ac.check('artem', 'dashboard', 'r'), true)
  })

  it('prefix matching — /admin matches /admin/users', () => {
    const ac = new AccessControl()
    ac.load(ACCESS, GROUPS)
    assert.equal(ac.check('sovr', '/admin/users', 'r'), true)
  })
})
```

### Після реалізації

1. Додати до `src/index.js`:

```javascript
import AccessControl from './AccessControl.js'
// ...
export { Auth, Membership, Role, User, TokenExpiryService, AccessControl }
```

2. Додати до `Auth` класу:

```javascript
static AccessControl = AccessControl
```

3. Оновити версію до `1.1.0`

---

## 2. Password — Secure Hashing (scrypt)

**Пріоритет**: 🟡 Medium
**Версія**: 1.1.0 (разом з AccessControl)

### Контекст

В `willni/cli/commands/admin.mjs` реалізовано `hashPass()` і `verifyPass()` через `node:crypto` (scrypt).
Ця логіка — **universal** і має бути в auth-core, поруч з User/Role.

### Що реалізувати

Створити `src/Password.js`:

```javascript
import { scryptSync, randomBytes, timingSafeEqual } from 'node:crypto'

const SCRYPT_KEYLEN = 32
const SCRYPT_COST = { N: 16384, r: 8, p: 1 }

export default class Password {
  /**
   * Hash a plaintext password using scrypt.
   * @param {string} plain — plaintext password
   * @param {string} [projectSalt=''] — optional project-level salt prefix
   * @returns {string} — "salt_hex:hash_hex"
   */
  static hash(plain, projectSalt = '') { ... }

  /**
   * Verify a password against a stored hash.
   * Supports both:
   *   - scrypt hash format (salt:hash)
   *   - plain string (for dev/migration, plain === stored)
   *
   * @param {string} input — user input
   * @param {string} stored — stored hash or plain
   * @param {string} [projectSalt=''] — same salt used during hash
   * @returns {boolean}
   */
  static verify(input, stored, projectSalt = '') { ... }
}
```

### Вимоги безпеки

- `scryptSync` з параметрами `N=16384, r=8, p=1`
- `randomBytes(16)` для salt
- `timingSafeEqual` для порівняння — захист від timing attacks
- Підтримка `projectSalt` для multi-tenant (необов'язковий prefix)
- Fallback на plain match для міграції

### Reference implementation

Файл: `willni/cli/commands/admin.mjs` — функції `hashPass()`, `verifyPass()`

### Тести

```javascript
// src/Password.test.js

suite('Password', () => {
  it('hash() returns salt:hash hex format', () => {
    const hash = Password.hash('test')
    assert.match(hash, /^[a-f0-9]{32}:[a-f0-9]{64}$/)
  })

  it('hash() produces unique salts', () => {
    assert.notEqual(Password.hash('test'), Password.hash('test'))
  })

  it('verify() matches correct password', () => {
    const hash = Password.hash('sovereign')
    assert.ok(Password.verify('sovereign', hash))
  })

  it('verify() rejects wrong password', () => {
    const hash = Password.hash('sovereign')
    assert.ok(!Password.verify('wrong', hash))
  })

  it('verify() supports plain string fallback', () => {
    assert.ok(Password.verify('pass', 'pass'))
    assert.ok(!Password.verify('wrong', 'pass'))
  })

  it('verify() with projectSalt', () => {
    const hash = Password.hash('test', 'MY_SALT')
    assert.ok(Password.verify('test', hash, 'MY_SALT'))
    assert.ok(!Password.verify('test', hash, 'WRONG_SALT'))
    assert.ok(!Password.verify('test', hash, ''))
  })

  it('timing-safe: both paths return boolean', () => {
    const hash = Password.hash('test')
    assert.equal(typeof Password.verify('test', hash), 'boolean')
    assert.equal(typeof Password.verify('wrong', hash), 'boolean')
  })
})
```

### Після реалізації

1. Додати до `src/index.js`:

```javascript
import Password from './Password.js'
export { Auth, Membership, Role, User, TokenExpiryService, AccessControl, Password }
```

2. Додати до `Auth` класу:

```javascript
static Password = Password
```

---

## 3. Session — Persistence for CLI/Node

**Пріоритет**: 🟡 Medium
**Версія**: 1.1.0

### Контекст

В `willni/cli/session.mjs` реалізовано збереження/відновлення сесії (email юзера → JSON файл).
Будь-який CLI на nan0web потребуватиме цього.

### Що реалізувати

Створити `src/Session.js`:

```javascript
export default class Session {
  /**
   * @param {string} filepath — absolute path to session.json
   */
  constructor(filepath) { ... }

  /**
   * Save current user email to disk.
   * @param {string} email
   */
  save(email) { ... }

  /**
   * Load saved email from disk.
   * @returns {string|null}
   */
  load() { ... }

  /**
   * Clear session.
   */
  clear() { ... }
}
```

### Reference implementation

Файл: `willni/cli/session.mjs` (67 рядків)

### Тести

```javascript
// src/Session.test.js

suite('Session', () => {
  it('save() + load() round-trips email', () => {
    const s = new Session(join(tmpDir, 'session.json'))
    s.save('test@yaro.page')
    assert.equal(s.load(), 'test@yaro.page')
  })

  it('load() returns null when no file', () => {
    const s = new Session(join(tmpDir, 'nope.json'))
    assert.equal(s.load(), null)
  })

  it('clear() removes session', () => {
    const s = new Session(join(tmpDir, 'session.json'))
    s.save('test@yaro.page')
    s.clear()
    assert.equal(s.load(), null)
  })

  it('save() creates parent dirs', () => {
    const s = new Session(join(tmpDir, 'deep/nested/session.json'))
    s.save('test@yaro.page')
    assert.equal(s.load(), 'test@yaro.page')
  })

  it('graceful failure on corrupt file', () => {
    writeFileSync(join(tmpDir, 'bad.json'), '{{{', 'utf-8')
    const s = new Session(join(tmpDir, 'bad.json'))
    assert.equal(s.load(), null)
  })
})
```

### Після реалізації

1. Додати до `src/index.js`
2. Додати до `Auth` класу

---

## Чеклист повного релізу 1.1.0

- [x] `src/AccessControl.js` + `src/AccessControl.test.js` ✅ 38 tests
- [x] `src/Password.js` + `src/Password.test.js` ✅ 11 tests
- [x] `src/Session.js` + `src/Session.test.js` ✅ 7 tests
- [x] Оновити `src/index.js` — додати нові експорти ✅
- [ ] Оновити `types/` — `tsc` build
- [x] `npm test` — all pass ✅ 89/89
- [x] `npm version 1.1.0` ✅
- [ ] Оновити README якщо є `test:docs`

## Споживачі

Після публікації `@nan0web/auth-core@1.1.0`:

1. **willni CLI** — замінить `cli/access.mjs`, `cli/session.mjs`, `hashPass/verifyPass` на імпорти:

   ```javascript
   import { AccessControl, Password, Session } from '@nan0web/auth-core'
   ```

2. **@nan0web/auth-node** — `AccessControl.js` стане обгорткою:

   ```javascript
   import { AccessControl } from '@nan0web/auth-core'
   // Додає тільки I/O: читання файлів через AuthDB
   ```

3. **Будь-який новий nan0web проєкт** — отримає все безкоштовно.
