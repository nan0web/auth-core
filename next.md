# @nan0web/auth-core — next.md

> **Поточна версія**: 1.1.2 (npm і локально)
> **Наступна версія**: 1.2.0
> **Дата**: 2026-03-01

---

## ✅ DONE: v1.1.1 & v1.1.2

- [x] Фікс `#matchAccess` — trailing `/` (Critical)
- [x] Додати user-specific в `check()` та `info()` (Medium)
- [x] Діагностувати і виправити зависання при імпорті (Critical)
- [x] **New Module: `Crypto.js`** — Ed25519 signing / verification for Mesh identity.
- [x] Всі існуючі тести проходять (`npm run test:all`)

---

## 🟡 НАСТУПНЕ: Roadmap

### 1.2.0 — Token & Compact Mesh

- [ ] **`Token` клас** — JWT-сумісний токен (sign, verify, refresh) з використанням `Crypto.js`.
- [ ] **Compact Signatures** — опція для raw (64-byte) сигнатур замість Base64 (для Bit-Sovereign).
- [ ] **Isomorphic Crypto** — підтримка `globalThis.crypto` для браузерів (fallback).

### 1.3.0 — Multi-tenant & Teams

- [ ] `Tenant` — ізоляція даних між проєктами.
- [ ] `AccessControl.loadForTenant()` — per-tenant rules.
- [ ] `TeamMembership` — групування користувачів за проектами.

### Next — Release Infrastructure

- [ ] **AGRP Release Protocol**: Створити `releases/` структуру, `task.spec.js`, `release:spec`, `release:verify`, `release:close` скрипти
- [ ] Завершити існуючі `releases/` контракти (якщо є)

> **Health check 2026-03-02**: 96/96 pass, 0 fail ✅

---

_Оновлено: 2026-03-02_
