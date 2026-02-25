# @nan0web/auth-core — REQUESTS

## 1. [DONE] Bug: `#matchAccess` fails with trailing `/` in target

**Пріоритет**: 🔴 Critical
**Версія**: 1.1.1
**Статус**: Вирішено в 1.1.1.
**Від**: `@nan0web/auth-node` (рефакторинг до делегації)

### Контекст

`auth-node` зберігає targets у `.access` файлах з trailing `/`:

```
admin rwd admin/
* r public/
* rw uploads/
```

Core `#matchAccess` порівнює:

```js
const pathMatch = path === target || path.startsWith(target + '/')
```

Коли `target = '/admin/'`, `target + '/'` = `'/admin//'` — ніколи не матчить.

### Очікувана поведінка

Target `admin/` має матчити `/admin/files`, `/admin/`, `/admin`.
Target `admin` (без `/`) — теж має матчити `/admin/files`.

### Виправлення

Нормалізувати target — стрипнути trailing `/` перед порівнянням:

```js
#matchAccess(rules, path, level) {
    return rules.some((rule) => {
        if (!rule?.target) return false
        const accessMatch = rule.access.includes(level)
        let target = rule.target.startsWith('/') ? rule.target : `/${rule.target}`
        // Strip trailing slash for consistent matching
        if (target.length > 1 && target.endsWith('/')) target = target.slice(0, -1)
        const pathMatch = path === target || path.startsWith(target + '/')
        return accessMatch && pathMatch
    })
}
```

### Тести

Додати в `AccessControl.test.js`:

```javascript
it('trailing slash in target — admin/ matches /admin/users', () => {
  const ac = new AccessControl()
  ac.load('admin rwd admin/\n* r public/', 'admin sovr')
  assert.equal(ac.check('sovr', '/admin/users', 'r'), true)
  assert.equal(ac.check('sovr', '/admin', 'r'), true)
  assert.equal(ac.check('guest', '/public/index.html', 'r'), true)
})
```

---

## 2. [DONE] User-specific rules (subject = username) in check()

**Пріоритет**: 🟡 Medium
**Версія**: 1.1.1
**Статус**: Вирішено ще у версії 1.1.0, 3 рівні працювали правильно.
**Від**: `@nan0web/auth-node` (рефакторинг до делегації)

### Контекст

`auth-node` підтримує user-specific правила в `.access`:

```
testuser rwd test/
admin rwd admin/
* r public/
```

У core `check()` матчить тільки:

1. Group rules (`subject ∈ userGroups`)
2. Global rules (`subject = *`)

Якщо `testuser` не є групою, рядок `testuser rwd test/` ігнорується.

### Очікувана поведінка

`check()` має резолвити 3 рівні:

1. **User-specific** → subject === username (пряме співпадіння)
2. **Group** → subject ∈ userGroups
3. **Global** → subject === '\*'

### Виправлення

Додати user-specific крок у `check()`:

```js
check(username, path, level = 'r') {
    if (!path.startsWith('/')) path = `/${path}`

    // 1. User-specific rules (subject matches username directly)
    const userRules = this.#rules.filter((r) => r.subject === username)
    if (this.#matchAccess(userRules, path, level)) return true

    // 2. Group rules
    const userGroups = this.#getUserGroups(username)
    const groupRules = this.#rules.filter((r) => userGroups.includes(r.subject))
    if (this.#matchAccess(groupRules, path, level)) return true

    // 3. Global rules (*)
    const globalRules = this.#rules.filter((r) => r.subject === AccessControl.ANY)
    return this.#matchAccess(globalRules, path, level)
}
```

Аналогічно оновити `info()`:

```js
info(username) {
    const groups = this.#getUserGroups(username)
    const userRules = this.#rules.filter((r) => r.subject === username)
    const groupRules = this.#rules.filter((r) => groups.includes(r.subject))
    const globalRules = this.#rules.filter((r) => r.subject === AccessControl.ANY)
    return {
        rules: [...userRules, ...groupRules, ...globalRules],
        groups,
    }
}
```

### Чеклист

- [ ] Фікс `#matchAccess` — trailing `/`
- [ ] Додати user-specific resolution у `check()` та `info()`
- [ ] Всі існуючі тести проходять
- [ ] Нові тести для trailing `/` та user-specific rules
- [ ] `npm run test:all` — pass
- [ ] `npm version 1.1.1`
- [ ] `npm publish --access public`
