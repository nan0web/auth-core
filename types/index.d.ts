export default Auth;
export class Auth {
    static User: typeof User;
    static TokenExpiryService: typeof TokenExpiryService;
}
import User from "./User.js";
import TokenExpiryService from "./TokenExpiryService.js";
export { User, TokenExpiryService };
