# @nan0web/auth-core — next.md

> **Поточна версія**: 1.1.2 (npm і локально)
> **Наступна версія**: 1.2.0
> **Дата**: 2026-03-04

---

## ✅ DONE: v1.1.1 & v1.1.2

- [x] Фікс `#matchAccess` — trailing `/` (Critical)
- [x] Додати user-specific в `check()` та `info()` (Medium)
- [x] Діагностувати і виправити зависання при імпорті (Critical)
- [x] **New Module: `Crypto.js`** — Ed25519 signing / verification for Mesh identity.
- [x] Всі існуючі тести проходять (`npm run test:all`)

---

## � IN PROGRESS: v1.2.0 — Token & Compact Mesh

### AUTH-1: Token клас ✅

- [x] `Token.create(payload, privateKey, options?)` — підписаний JWT-сумісний токен
- [x] `Token.verify(token, publicKey)` — `{ valid, payload, error? }`
- [x] `Token.decode(token)` — payload без верифікації
- [x] `Token.refresh(token, privateKey, options?)` — оновлений iat/exp
- [x] Header: `{ alg: 'EdDSA', typ: 'JWT' }`
- [x] Автоматичний `iat`, опціональний `exp` через `expiresIn`
- [x] Unit tests (9/9 pass), docs test оновлено

### AUTH-2: Compact Signatures ✅

- [x] `Crypto.sign(key, data, { compact: true })` — raw 64-byte hex output
- [x] `Crypto.verify(key, data, sig, { compact: true })` — hex verification
- [x] Backward compatibility — existing base64 API unchanged
- [x] **АРХІТЕКТУРНЕ РІШЕННЯ**: Spec-тест `compact(hex) = 128 chars` затверджено.

### AUTH-3: Isomorphic Crypto ✅ (Node.js path)

- [x] `Crypto.isNode` — static boolean для визначення середовища
- [x] Node.js path працює повністю
- [ ] Browser path (Web Crypto API fallback) — потребує імплементації у 1.3.0+

---

## 📊 Статус release:spec

- **19/19 pass** ✅ (Рішення про hex-формат інтегровано в контракт)
- **test:all**: 16/16 pass ✅ (unit + docs + build + knip + audit)

---

## 🟡 НАСТУПНЕ: Roadmap

### 1.3.0 — Multi-tenant & Teams

- [ ] `Tenant` — ізоляція даних між проєктами.
- [ ] `AccessControl.loadForTenant()` — per-tenant rules.
- [ ] `TeamMembership` — групування користувачів за проектами.
- [ ] Browser Crypto (Web Crypto API) — повна ізоморфність.

### Next — Release Infrastructure

- [ ] **AGRP Release Protocol**: Створити `releases/` структуру, `task.spec.js`, `release:spec`, `release:verify`, `release:close` скрипти
- [ ] Завершити існуючі `releases/` контракти (якщо є)

> **Health check 2026-03-04**: test:all 16/16 pass, release:spec 19/19 ✅

---

_Оновлено: 2026-03-04_
