import express from "express";
import { createAccessToken } from "../lib/tools.js";
import UsersModel from "./model.js";
import checkUserSchema from "./validator.js";
import createHttpError from "http-errors";
import { JwtAuthenticationMiddleware } from "../lib/tokenBaseAuth.js";
import accommodationsModel from "../accommodations/model.js";
import { hostOnlyMiddleware } from "../lib/hostOnly.js";

const usersRouter = express.Router();

usersRouter.post("/register", checkUserSchema, async (req, res, next) => {
  try {
    const user = new UsersModel(req.body);

    const accessToken = await createAccessToken(user.toObject());
    user.save()
    res.status(201).send({ accessToken });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UsersModel.checkCredentials(email, password);

    if (user) {
      const accessToken = await createAccessToken(user.toObject());
      res.send({ accessToken });
    } else {
      next(createHttpError(401, `Credentials are not ok!`));
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", JwtAuthenticationMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

usersRouter.get(
  "/me/accommodations",
  JwtAuthenticationMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const accommodations = await accommodationsModel.find({
        host: req.user._id,
      }).populate({
        path: "host",
        select: "firstName lastName"
       }
   );
      res.status(200).send(accommodations);
    } catch (error) {
      next(error);
    }
  }
);

export default usersRouter;
