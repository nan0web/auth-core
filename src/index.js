import User from "./User.js"
import TokenExpiryService from "./TokenExpiryService.js"

class Auth {
	static User = User
	static TokenExpiryService = TokenExpiryService
}

export {
	Auth,
	User,
	TokenExpiryService,
}

export default Auth
