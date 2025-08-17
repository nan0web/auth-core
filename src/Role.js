import { Enum } from "@nan0web/types"

class Role {
	static ROLES = {
		admin: "a",
		author: "r",
		moderator: "m",
		user: "u",
	}
	/** @type {string} */
	value
	/**
	 *
	 * @param {object} input
	 * @param {string} input.value
	 */
	constructor(input) {
		const {
			value = ""
		} = input
		this.value = Enum(...[
			...Object.keys(this.ROLES), ...Object.values(this.ROLES)
		])(value)
		this.validateRoles()
	}
	get ROLES() {
		return /** @type {typeof Role} */ (this.constructor).ROLES
	}
	/**
	 * Validating the extended ROLES to be unique and with no commas in their values
	 * for storage as string
	 * @throws {TypeError}
	 */
	validateRoles() {
		const values = Object.values(this.ROLES)
		if (values.some(v => v.includes(","))) {
			throw new TypeError("Role must not include commas")
		}
		const set = new Set(values)
		if (set.size !== values.length) {
			throw new TypeError("All predefined roles must be unique")
		}
	}
	toString() {
		return this.value
	}
	/**
	 * @param {string | object} input
	 * @returns {Role}
	 */
	static from(input) {
		if (input instanceof Role) return input
		if ("string" === typeof input) input = { value: input }
		return new Role(input)
	}
}

export default Role
