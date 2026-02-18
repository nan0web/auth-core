import User from './User.js'
import TokenExpiryService from './TokenExpiryService.js'
import Membership from './Membership.js'
import Role from './Role.js'
import AccessControl from './AccessControl.js'
import Password from './Password.js'
import Session from './Session.js'

class Auth {
	static AccessControl = AccessControl
	static Membership = Membership
	static Password = Password
	static Role = Role
	static Session = Session
	static User = User
	static TokenExpiryService = TokenExpiryService
}

export { Auth, AccessControl, Membership, Password, Role, Session, User, TokenExpiryService }

export default Auth
