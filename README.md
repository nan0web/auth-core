# @nan0web/auth-core

|Package name|[Status](https://github.com/nan0web/monorepo/blob/main/system.md#написання-сценаріїв)|Documentation|Test coverage|Features|Npm version|
|---|---|---|---|---|---|
 |[@nan0web/auth-core](https://github.com/nan0web/auth-core/) |🟢 `99.4%` |🧪 [English 🏴󠁧󠁢󠁥󠁮󠁧󠁿](https://github.com/nan0web/auth-core/blob/main/README.md)<br />[Українською 🇺🇦](https://github.com/nan0web/auth-core/blob/main/docs/uk/README.md) |🟢 `98.5%` |✅ d.ts 📜 system.md 🕹️ playground |— |

Minimal authentication core providing:

- `User` – user model with role handling and token management
- `Role` – enumeration of user roles
- `Membership` – group based permission sets
- `TokenExpiryService` – simple token lifetime utilities
- `Auth` – facade exporting the above

## Installation

How to install with npm?
```bash
npm install @nan0web/auth-core
```

How to install with pnpm?
```bash
pnpm add @nan0web/auth-core
```

How to install with yarn?
```bash
yarn add @nan0web/auth-core
```

## Basic usage – User

Create a user, assign roles and check role existence.

How to create a User and check roles?
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
## Token handling

Manage tokens with `TokenExpiryService`.

How to create a token and validate its expiry?
```js
import { TokenExpiryService } from "@nan0web/auth-core"
const service = new TokenExpiryService(2000) // 2 seconds
const tokenTime = new Date()
console.info(service.isValid(tokenTime)) // ← true
// fast‑forward simulation
const past = new Date(Date.now() - 3000)
console.info(service.isValid(past)) // ← false
console.info(service.getExpiryDate(tokenTime).toISOString())
// the date in ISO format
```
## Membership – group permissions

Join a group, check permissions, mint daily coins and see admin bypass.

How to use Membership to manage group permissions?
```js
import { Membership, Role } from "@nan0web/auth-core"
const mem = new Membership()
// regular group with explicit permissions
mem.join("lawyers", "moderator", new Set(["r", "w"]), { dailyCoins: 10 })
console.info(mem.can("lawyers", "r")) // ← true
console.info(mem.can("lawyers", "d")) // ← false
mem.mintDailyCoins("lawyers")
const inner = mem.memberships.get("lawyers")
console.info(inner?.config.wallet === 10n) // ← true
// admin role bypasses all permission checks
mem.join("admins", "admin", new Set(), {})
console.info(mem.can("admins", "*")) // ← true
```
## Auth facade

Exported object provides easy access to core classes.

How to use the Auth facade?
```js
import { Auth } from "@nan0web/auth-core"
const user = new Auth.User({ name: "Bob" })
// Showing user name with createdAt date-time
console.info(user.toString())
// Bob
// YYYY-MM-DD HH:mm:SS
```
## API reference

### User

* **Properties**
  * `name` – string
  * `email` – string
  * `roles` – `Role[]`
  * `createdAt` – `Date`
  * `updatedAt` – `Date`

* **Methods**
  * `is(role)` – checks if the user has the specified role
  * `toObject()` – plain representation without private tokens

### Role

* **Static ROLES**
  * `admin` – `"a"`
  * `author` – `"r"`
  * `moderator` – `"m"`
  * `user` – `"u"`

* **Methods**
  * `toString()` – returns role value

### Membership

* **Properties**
  * `memberships` – `Map<string, { role: Role, perms: Set<string>, config: object }>`

* **Methods**
  * `join(key, roleValue, perms, config)` – add a group
  * `can(key, perm)` – permission check (admin role bypasses)
  * `mintDailyCoins(key)` – add daily coin amount from config (updates `wallet` in config)

### TokenExpiryService

* **Constructor**
  * `new TokenExpiryService(lifetimeMs)`

* **Methods**
  * `isValid(creationDate, lifetime?)`
  * `getExpiryDate(issuedAt?, lifetime?)`
  * `extendLifetime(creationDate, extensionMs?, maxLifetime?)`

### Auth

Facade exporting `User`, `Role`, `TokenExpiryService`, `Membership`.

All exported classes should be available

## JavaScript

Types are described via JSDoc and the generated `.d.ts` files.

Uses `d.ts` for autocomplete

## Contributing

How to contribute? - [check here](./CONTRIBUTING.md)

## License

How to license ISC? - [check here](./LICENSE)
