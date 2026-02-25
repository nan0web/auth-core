# @nan0web/auth-core — next.md

> **Поточна версія**: 1.1.0 (локально)
> **Версія на npm**: 1.0.0
> **Дата**: 2026-02-25

---

## 🔴 ЗАРАЗ: Опублікувати @nan0web/auth-core@1.1.0

### Підготовка — ✅ DONE

- [x] `npm run test:all` — test → test:docs → build → knip → audit — all green
- [x] `.npmignore` — створено за стандартом system.md
- [x] `npm pack --dry-run` — 13.3 kB, 23 файли, чистий пакет
- [x] `docs/uk/README.md` — синхронізовано з README.md (додано AccessControl, Password, Session)
- [x] `knip.json` — налаштовано, `✂️ Excellent, no issues`
- [x] `package.json` — додано `test:all`, `knip`, `audit` за стандартом

### Публікація

```bash
npm publish --access public

# Перевірка:
npm view @nan0web/auth-core version
# Очікувано: 1.1.0
```

### Що змінилось у 1.1.0 (відносно 1.0.0)

#### Виправлення TypeScript build помилок

1. **`AccessControl.js`** — em-dash (`—`) в JSDoc `@param` замінено на дефіс (`-`).
2. **`Password.js`** — аналогічно, em-dash в `@param` та `@returns` замінено на дефіс.
3. **`App/Auth.js`** — `import { Command } from '@nan0web/co'` → `import Command from '@nan0web/co'`.

#### Гігієна пакету (нове)

4. **`.npmignore`** — створено за шаблоном system.md (coverage/, me.md, session.json додатково)
5. **`knip.json`** — налаштовано для production-перевірки
6. **`package.json`** — `test:all` конвеєр за стандартом архітектури

### Після публікації

1. ✅ `@nan0web/auth-node` зможе використовувати `@nan0web/auth-core@^1.1.0`
2. ✅ `willni` зможе оновити залежність
3. ✅ Розблокується `auth.app`

---

## 🟡 ДАЛІ: Roadmap auth-core

### 1.2.0 — Token & JWT

- [ ] `Token` клас — JWT-сумісний токен (sign, verify, refresh)
- [ ] Інтеграція з `Session` — автоматичний refresh

### 1.3.0 — Multi-tenant

- [ ] `Tenant` — ізоляція даних між проєктами
- [ ] `AccessControl.loadForTenant()` — per-tenant rules
