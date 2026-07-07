const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { query } = require('./database');

const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const result = await query(
                'SELECT id, username, email, full_name, time_credits, is_active FROM users WHERE id = $1',
                [jwt_payload.userId]
            );

             if (result.rows.length === 0) {
                return done(null, false);
            }
            
            const user = result.rows[0];
            if (!user.is_active) {
                return done(null, false);
            }
            
            return done(null, user);
        } catch (error) {
            return done(error, false);
        }
    })
);

module.exports = passport;