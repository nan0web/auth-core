import { describe, it, before, beforeEach } from "node:test"
import assert from "node:assert/strict"
import FS from "@nan0web/db-fs"
import { NoConsole } from "@nan0web/log"
import {
	DocsParser,
	DatasetParser,
} from "@nan0web/test"

import {
	Auth,
	User,
	Role,
	Membership,
	TokenExpiryService,
} from "./index.js"

const fs = new FS()
let pkg

before(async () => {
	const doc = await fs.loadDocument("package.json", {})
	pkg = doc || {}
})

let console = new NoConsole()

beforeEach(() => {
	console = new NoConsole()
})

/**
 * Core test suite that also serves as the source for README generation.
 *
 * Block comments inside each `it` are extracted to build the final README.md.
 */
function testRender() {
	/**
	 * @docs
	 * # @nan0web/auth-core
	 *
	 * <!-- %PACKAGE_STATUS% -->
	 *
	 * Minimal authentication core providing:
	 *
	 * - `User` – user model with role handling and token management
	 * - `Role` – enumeration of user roles
	 * - `Membership` – group based permission sets
	 * - `TokenExpiryService` – simple token lifetime utilities
	 * - `Auth` – façade exporting the above
	 *
	 * ## Installation
	 */
	it("How to install with npm?", () => {
		/**
		 * ```bash
		 * npm install @nan0web/auth-core
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/auth-core")
	})
	/**
	 * @docs
	 */
	it("How to install with pnpm?", () => {
		/**
		 * ```bash
		 * pnpm add @nan0web/auth-core
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/auth-core")
	})
	/**
	 * @docs
	 */
	it("How to install with yarn?", () => {
		/**
		 * ```bash
		 * yarn add @nan0web/auth-core
		 * ```
		 */
		assert.equal(pkg.name, "@nan0web/auth-core")
	})

	/**
	 * @docs
	 * ## Basic usage – User
	 *
	 * Create a user, assign roles and check role existence.
	 */
	it("How to create a User and check roles?", () => {
		//import { User, Role } from "@nan0web/auth-core"
		const user = new User({
			name: "Alice",
			email: "alice@example.com",
			roles: ["admin", "user"],
		})
		console.info(user.toString())
		assert.ok(user.is("admin"))
		assert.ok(!user.is("guest"))
		assert.equal(console.output()[0][1].includes("Alice"), true)
	})

	/**
	 * @docs
	 * ## Token handling
	 *
	 * Manage tokens with `TokenExpiryService`.
	 */
	it("How to create a token and validate its expiry?", () => {
		//import { TokenExpiryService } from "@nan0web/auth-core"
		const service = new TokenExpiryService(2000) // 2 seconds
		const tokenTime = new Date()
		assert.ok(service.isValid(tokenTime))
		// fast‑forward simulation
		const past = new Date(Date.now() - 3000)
		assert.equal(service.isValid(past), false)
		console.info(service.getExpiryDate(tokenTime).toISOString())
		assert.ok(console.output()[0][1].includes("Z"))
	})

	/**
	 * @docs
	 * ## Membership – group permissions
	 *
	 * Join a group, check permissions, mint daily coins and see admin bypass.
	 */
	it("How to use Membership to manage group permissions?", () => {
		//import { Membership, Role } from "@nan0web/auth-core"
		const mem = new Membership()
		// regular group with explicit permissions
		mem.join("lawyers", "moderator", new Set(["r", "w"]), { dailyCoins: 10 })
		assert.ok(mem.can("lawyers", "r"))
		assert.ok(!mem.can("lawyers", "d"))
		mem.mintDailyCoins("lawyers")
		const inner = mem.memberships.get("lawyers")
		assert.equal(inner?.config.wallet, 10n)

		// admin role bypasses all permission checks
		mem.join("admins", "admin", new Set(), {})
		assert.ok(mem.can("admins", "any"))
	})

	/**
	 * @docs
	 * ## Auth façade
	 *
	 * Exported object provides easy access to core classes.
	 */
	it("How to use the Auth facade?", () => {
		//import { Auth } from "@nan0web/auth-core"
		assert.ok(Auth.User)
		assert.ok(Auth.Role)
		assert.ok(Auth.TokenExpiryService)
		const user = new Auth.User({ name: "Bob" })
		console.info(user.toString())
		assert.equal(console.output()[0][1].includes("Bob"), true)
	})

	/**
	 * @docs
	 * ## API reference
	 *
	 * ### User
	 *
	 * * **Properties**
	 *   * `name` – string
	 *   * `email` – string
	 *   * `roles` – `Role[]`
	 *   * `createdAt` – `Date`
	 *   * `updatedAt` – `Date`
	 *
	 * * **Methods**
	 *   * `is(role)` – checks if the user has the specified role
	 *   * `toObject()` – plain representation without private tokens
	 *
	 * ### Role
	 *
	 * * **Static ROLES**
	 *   * `admin` – `"a"`
	 *   * `author` – `"r"`
	 *   * `moderator` – `"m"`
	 *   * `user` – `"u"`
	 *
	 * * **Methods**
	 *   * `toString()` – returns role value
	 *
	 * ### Membership
	 *
	 * * **Properties**
	 *   * `memberships` – `Map<string, { role: Role, perms: Set<string>, config: object }>`
	 *
	 * * **Methods**
	 *   * `join(key, roleValue, perms, config)` – add a group
	 *   * `can(key, perm)` – permission check (admin role bypasses)
	 *   * `mintDailyCoins(key)` – add daily coin amount from config (updates `wallet` in config)
	 *
	 * ### TokenExpiryService
	 *
	 * * **Constructor**
	 *   * `new TokenExpiryService(lifetimeMs)`
	 *
	 * * **Methods**
	 *   * `isValid(creationDate, lifetime?)`
	 *   * `getExpiryDate(issuedAt?, lifetime?)`
	 *   * `extendLifetime(creationDate, extensionMs?, maxLifetime?)`
	 *
	 * ### Auth
	 *
	 * Facade exporting `User`, `Role`, `TokenExpiryService`, `Membership`.
	 */
	it("All exported classes should be available", () => {
		assert.ok(User)
		assert.ok(Role)
		assert.ok(Membership)
		assert.ok(TokenExpiryService)
		assert.ok(Auth)
	})

	/**
	 * @docs
	 * ## JavaScript
	 *
	 * Types are described via JSDoc and the generated `.d.ts` files.
	 */
	it("Uses `d.ts` for autocomplete", () => {
		assert.equal(pkg.types, "types/index.d.ts")
	})

	/**
	 * @docs
	 * ## Contributing
	 */
	it("How to contribute? - [check here](./CONTRIBUTING.md)", async () => {
		assert.equal(pkg.scripts?.precommit, "npm test")
		assert.equal(pkg.scripts?.prepush, "npm test")
		assert.equal(pkg.scripts?.prepare, "husky")
		const text = await fs.loadDocument("CONTRIBUTING.md")
		const str = String(text)
		assert.ok(str.includes("# Contributing"))
	})

	/**
	 * @docs
	 * ## License
	 */
	it("How to license ISC? - [check here](./LICENSE)", async () => {
		/** @docs */
		const text = await fs.loadDocument("LICENSE")
		assert.ok(String(text).includes("ISC"))
	})
}

describe("README.md testing", testRender)

describe("Rendering README.md", async () => {
	let text = ""
	const format = new Intl.NumberFormat("en-US").format
	const parser = new DocsParser()
	text = String(parser.decode(testRender))
	await fs.saveDocument("README.md", text)
	const dataset = DatasetParser.parse(text, pkg.name)
	await fs.saveDocument(".datasets/README.dataset.jsonl", dataset)

	it(`document is rendered in README.md [${format(Buffer.byteLength(text))}b]`, async () => {
		const txt = await fs.loadDocument("README.md")
		assert.ok(txt.includes("## API reference"))
	})
})
