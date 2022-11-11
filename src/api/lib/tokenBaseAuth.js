import createHttpError from "http-errors";
import {verifyAccessToken} from "./tools.js";

export const JwtAuthenticationMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(
      createHttpError(
        401,
        "Please provide Bearer Token in the authorization header"
      )
    );
  } else {
    try {
      const accessToken = req.headers.authorization.replace("Bearer ", "");

      const payload = await verifyAccessToken(accessToken);

      req.user = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        _id: payload._id,
        role: payload.role,
        email: payload.email
      };
      next();
    } catch (error) {
      console.log(error);
      next(createHttpError(401, "Token not valid!"));
    }
  }
};
