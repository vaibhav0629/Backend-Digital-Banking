const UserService = require('../users/users-service');
const JWT = require('jsonwebtoken');
const { passwordMatched } = require('../../../utils/password');

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

module.exports = {
  checkLogin,
  generateToken,
};
