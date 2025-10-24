# @nan0web/auth-core

|Назва пакету|[Статус](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Документація|Тестове покриття|Фічі|Версія npm|
|---|---|---|---|---|---|
|[@nan0web/auth-core](https://github.com/nan0web/auth-core/)|🟢 `99.4%`|🧪 [English 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/auth-core/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/auth-core/blob/main/docs/uk/README.md)|🟢 `98.5%`|✅ d.ts 📜 system.md 🕹️ playground|—|

Мінімальне ядро аутентифікації, що надає:

- `User` – модель користувача з обробкою ролей та управлінням токенами
- `Role` – перелік ролей користувачів
- `Membership` – груповий набір дозволів
- `TokenExpiryService` – прості утиліти для часу життя токену
- `Auth` – фасад, що експортує вищезазначені класи

## Встановлення

Як встановити за допомогою npm?
```bash
npm install @nan0web/auth-core
```

Як встановити за допомогою pnpm?
```bash
pnpm add @nan0web/auth-core
```

Як встановити за допомогою yarn?
```bash
yarn add @nan0web/auth-core
```

## Основне використання – User

Створіть користувача, призначте ролі та перевірте їх наявність.

Як створити `User` та перевірити ролі?
```js
import { User, Role } from "@nan0web/auth-core"
const user = new User({
	name: "Alice",
	email: "alice@example.com",
	roles: ["admin", "user"],
})
console.info(user.toString({ detailed: true, hideDate: true }))
// Alice <alice@example.com> admin, user
console.info(user.is("admin")) // ← true
console.info(user.is("guest")) // ← false
```

## Робота з токенами

Керуйте токенами за допомогою `TokenExpiryService`.

Як створити токен та перевірити його дійсність?
```js
import { TokenExpiryService } from "@nan0web/auth-core"
const service = new TokenExpiryService(2000) // 2 секунди
const tokenTime = new Date()
console.info(service.isValid(tokenTime)) // ← true
// симуляція прискореного часу
const past = new Date(Date.now() - 3000)
console.info(service.isValid(past)) // ← false
console.info(service.getExpiryDate(tokenTime).toISOString())
// дата у ISO‑форматі
```

## Membership – групові дозволи

Приєднуйтесь до групи, перевіряйте дозволи, мінтуйте щоденні монети та бачте обхід адмін‑прав.

Як використати `Membership` для управління груповими дозволами?
```js
import { Membership, Role } from "@nan0web/auth-core"
const mem = new Membership()
// звичайна група з явними дозволами
mem.join("lawyers", "moderator", new Set(["r", "w"]), { dailyCoins: 10 })
console.info(mem.can("lawyers", "r")) // ← true
console.info(mem.can("lawyers", "d")) // ← false
mem.mintDailyCoins("lawyers")
const inner = mem.memberships.get("lawyers")
console.info(inner?.config.wallet === 10n) // ← true
// роль admin обходить усі перевірки дозволів
mem.join("admins", "admin", new Set(), {})
console.info(mem.can("admins", "*")) // ← true
```

## Фасад Auth

Об’єкт, що експортує простий доступ до основних класів.

Як використати фасад `Auth`?
```js
import { Auth } from "@nan0web/auth-core"
const user = new Auth.User({ name: "Bob" })
// Виведення імені користувача з датою створення
console.info(user.toString())
// Bob
// YYYY-MM-DD HH:mm:SS
```

## API довідка

### User

* **Властивості**
	* `name` – рядок
	* `email` – рядок
	* `roles` – `Role[]`
	* `createdAt` – `Date`
	* `updatedAt` – `Date`

* **Методи**
	* `is(role)` – перевіряє наявність вказаної ролі у користувача
	* `toObject()` – просте представлення без приватних токенів

### Role

* **Статичні РОЛІ**
	* `admin` – `"a"`
	* `author` – `"r"`
	* `moderator` – `"m"`
	* `user` – `"u"`

* **Методи**
	* `toString()` – повертає значення ролі

### Membership

* **Властивості**
	* `memberships` – `Map<string, { role: Role, perms: Set<string>, config: object }>`

* **Методи**
	* `join(key, roleValue, perms, config)` – додати групу
	* `can(key, perm)` – перевірка дозволу (роль admin обходить)
	* `mintDailyCoins(key)` – додати щоденну кількість монет з конфігурації (оновлює `wallet` у конфіг)

### TokenExpiryService

* **Конструктор**
	* `new TokenExpiryService(lifetimeMs)`

* **Методи**
	* `isValid(creationDate, lifetime?)`
	* `getExpiryDate(issuedAt?, lifetime?)`
	* `extendLifetime(creationDate, extensionMs?, maxLifetime?)`

### Auth

Фасад, що експортує `User`, `Role`, `TokenExpiryService`, `Membership`.

Всі експортовані класи мають бути доступні.

## JavaScript

Типи описані через JSDoc, а згенеровані `.d.ts` файли забезпечують автодоповнення.

Використовуються `.d.ts` лише для декларацій, щоб стисло передати типи.

## Внесок

Як внести свій вклад? — [деталі тут](./CONTRIBUTING.md)

## Ліцензія

Яка ліцензія ISC? — [деталі тут](./LICENSE)
