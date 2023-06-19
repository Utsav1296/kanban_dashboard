import jwt from "jsonwebtoken"
import createError from "../utils/createError.js";

export const verifyToken = (req, res, next) => {
   const token = req.cookies.accessToken;
   if (!token) {
      return next(createError(401, "You are not authenticated..!"))
   }

   jwt.verify(token, process.env.JWT_KEY, async (err, payload) => {
      if (err) return next(createError(403, "Token is not valid..!"))
      req.userId = payload.id;
      req.isSeller = payload.isSeller;
      next();
   });
}
// next() used  to give control to next function , eg. the function deleteUser at user.controller.js in user.route.js will not get called if we would not use next() here;