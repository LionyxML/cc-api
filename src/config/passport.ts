import { ExtractJwt, Strategy } from "passport-jwt";
import User from "../models/User";
import config from ".";

const key = config.secretKey;
const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: key,
};

export default (passport: { use: (arg0: Strategy) => void }) => {
  passport.use(
    new Strategy(opts, (jwt_payload, done) => {
      User.findOne({ where: { id: jwt_payload.id } })
        .then((user) => {
          if (user) return done(null, user);
          return done(null, false);
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );
};
