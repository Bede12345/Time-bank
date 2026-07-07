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

            