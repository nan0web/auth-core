import User from "./User.js"
import TokenExpiryService from "./TokenExpiryService.js"
import Membership from "./Membership.js"
import Role from "./Role.js"

class Auth {
	static Membership = Membership
	static Role = Role
	static User = User
	static TokenExpiryService = TokenExpiryService
}

export {
	Auth,
	Membership,
	Role,
	User,
	TokenExpiryService,
}

export default Auth
