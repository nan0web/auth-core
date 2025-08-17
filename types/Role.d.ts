export default Role;
declare class Role {
    static ROLES: {
        admin: string;
        author: string;
        moderator: string;
        user: string;
    };
    /**
     *
     * @param {string | object} input
     * @returns {Role}
     */
    static from(input: string | object): Role;
    /**
     *
     * @param {object} input
     * @param {string} input.value
     */
    constructor(input: {
        value: string;
    });
    /** @type {string} */
    value: string;
    get ROLES(): {
        admin: string;
        author: string;
        moderator: string;
        user: string;
    };
    /**
     * Validating the extended ROLES to be unique and with no commas in their values
     * for storage as string
     * @throws {TypeError}
     */
    validateRoles(): void;
    toString(): string;
}
