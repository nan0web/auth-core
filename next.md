# @nan0web/auth-core — next.md

> **Поточна версія**: 1.1.0 (npm і локально)
> **Наступна версія**: 1.1.1
> **Дата**: 2026-02-25

---

## 🔴 ЗАРАЗ: Виправити 3 баги → опублікувати 1.1.1

Детальний опис у `REQUESTS.md`.

### Баг 1: `#matchAccess` — trailing `/` (🔴 Critical)

Target `admin/` не матчить `/admin/files`.

- Файл: `src/AccessControl.js`, метод `#matchAccess`
- Причина: `target + '/'` → `'/admin//'` — ніколи не спрацьовує
- **Фікс**: стрипнути trailing `/` перед порівнянням:

```js
let target = rule.target.startsWith('/') ? rule.target : `/${rule.target}`
if (target.length > 1 && target.endsWith('/')) target = target.slice(0, -1)
const pathMatch = path === target || path.startsWith(target + '/')
```

- **Тест**: додати `it('trailing slash in target')` у `AccessControl.test.js`

### Баг 2: User-specific rules у `check()` (🟡 Medium)

`check()` не перевіряє `subject === username` напряму.

- Файл: `src/AccessControl.js`, метод `check` та `info`
- **Фікс**: додати крок 1 — user-specific:

```js
const userRules = this.#rules.filter((r) => r.subject === username)
if (this.#matchAccess(userRules, path, level)) return true
```

- Аналогічно оновити `info()` — додати userRules першими

### Баг 3: Зависання при `import Auth from '@nan0web/auth-core'` (🔴 Critical)

У контексті `@nan0web/auth-node` (pnpm monorepo) імпорт зависає нескінченно.

- Статичний аналіз **не знайшов** `setInterval`, `readline`, `stdin`, `while`
- Можливі причини: pnpm symlink circular dependency, або щось у ланцюгу `Role.js` → `@nan0web/types` → `Parser`
- **Діагностика після перезапуску терміналів**:

```bash
# Покроковий імпорт — виявити який модуль зависає:
node -e "import('./src/AccessControl.js').then(() => console.log('AC OK'))"
node -e "import('./src/Role.js').then(() => console.log('Role OK'))"
node -e "import('./src/User.js').then(() => console.log('User OK'))"
node -e "import('./src/Password.js').then(() => console.log('Password OK'))"
node -e "import('./src/Session.js').then(() => console.log('Session OK'))"
node -e "import('./src/index.js').then(() => console.log('ALL OK'))"
```

### Чеклист 1.1.1

- [ ] Фікс `#matchAccess` — trailing `/`
- [ ] Додати user-specific в `check()` та `info()`
- [ ] Діагностувати і виправити зависання при імпорті
- [ ] Всі існуючі тести проходять
- [ ] Нові тести для trailing `/` та user-specific rules
- [ ] `npm run test:all` — pass
- [ ] `npm version 1.1.1`
- [ ] `npm publish --access public`

---

## ✅ DONE: v1.1.0

Опубліковано на npm 2026-02-25.

### Що змінилось у 1.1.0 (відносно 1.0.0)

- **`AccessControl`** — новий клас (pure, sync, zero I/O)
- **`Password`** — scrypt hashing/verify
- **`Session`** — lightweight JSON-based session persistence
- TypeScript build fixes (em-dash → hyphen у JSDoc)
- `.npmignore`, `knip.json`, `test:all` конвеєр

---

## 🟡 ДАЛІ: Roadmap

### 1.2.0 — Token & JWT

- [ ] `Token` клас — JWT-сумісний токен (sign, verify, refresh)
- [ ] Інтеграція з `Session` — автоматичний refresh

### 1.3.0 — Multi-tenant

- [ ] `Tenant` — ізоляція даних між проєктами
- [ ] `AccessControl.loadForTenant()` — per-tenant rules
