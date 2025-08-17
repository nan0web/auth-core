# @nan0web/auth-core

Core authentication library providing base classes and utilities for building authentication systems.

## Features

- **User Management**: Complete user model with roles, tokens, and security features
- **Token Expiry Service**: Utility for managing token lifetimes and validation
- **Provider Base**: Extensible authentication provider interface
- **Type Safety**: Full JSDoc typing for IDE support and code clarity
- **Security Focus**: Tokens excluded from serialized user objects by default

## Installation

```bash
npm install @nan0web/auth-core
```

## Usage

### User Management

```js
import { User } from '@nan0web/auth-core'

const user = new User({
  name: 'John Doe',
  email: 'john@example.com',
  roles: ['user', 'admin']
})

console.log(user.is('admin')) // true
console.log(user.toString())  // "John Doe <john@example.com>"
```

### Token Expiry Service

```js
import { TokenExpiryService } from '@nan0web/auth-core'

const tokenService = new TokenExpiryService(3600000) // 1 hour lifetime
const isValid = tokenService.isValid(tokenCreationDate)
```

## Provider Architecture

The library provides a base `Provider` class that can be extended for various authentication methods:

- Google OAuth
- Facebook Login  
- LinkedIn Authentication
- BankID
- Hardware Security Keys
- Custom providers

Each provider implements token exchange and user validation logic specific to their platform.

## Testing

```bash
npm test
```

All components are fully tested with comprehensive test suites.

## License

ISC
