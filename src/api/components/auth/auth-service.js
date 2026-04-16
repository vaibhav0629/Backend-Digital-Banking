const UserService = require('../users/users-service');
const JWT = require('jsonwebtoken');
const { passwordMatched } = require('../../../utils/password');
const accountService = require('../accounts/accounts-service');

function generateToken(email) {
  const secretKey = process.env.SECRET_KEY;
  const payload = {
    email,
    timestamp: Date.now(),
  };

  return JWT.sign(payload, secretKey, { expiresIn: '15m' });
}

async function checkLogin(email, password) {
  const user = await UserService.getUserByEmail(email);

  const userPass = user ? user.password : process.env.RANDOM_KEY;

  const loginPassed = await passwordMatched(password, userPass);

  if (user && loginPassed) {
    return {
      email,
      role: user.role,
      token: generateToken(email),
    };
  }
  return null;
}

async function doTransaction(accountID, pin) {
  const auth = accountService.authorizeTransaction(accountID, pin);
  if (auth) {
    return {
      token: generateToken(accountID),
    };
  }
  return null;
}

module.exports = {
  checkLogin,
  generateToken,
  doTransaction,
};
