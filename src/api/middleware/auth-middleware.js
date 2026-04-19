const passport = require('passport');

const passportJWT = require('passport-jwt');

const { getUserByEmail } = require('../components/users/users-service');
const { getAccount } = require('../components/accounts/accounts-repository');

// expiration already check in password-jwt
passport.use(
  'user',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (payload, done) => {
      const user = await getUserByEmail(payload.email);
      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    }
  )
);

passport.use(
  'admin',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (payload, done) => {
      const user = await getUserByEmail(payload.email);
      if (user && payload.role === 'admin') {
        return done(null, user);
      }
      return done(null, false);
    }
  )
);

passport.use(
  'transaction',
  new passportJWT.Strategy(
    {
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: process.env.SECRET_KEY,
    },
    async (payload, done) => {
      try {
        const account = await getAccount(payload.email);
        if (account) {
          return done(null, account);
        }
      } catch (error) {
        return done(null, false);
      }
      return done(null, false);
    }
  )
);

module.exports = {
  UserAuth: passport.authenticate('user', { session: false }),
  AdminAuth: passport.authenticate('admin', { session: false }),
  TransactAuth: passport.authenticate('transaction', { session: false }),
};
