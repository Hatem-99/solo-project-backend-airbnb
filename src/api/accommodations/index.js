import express from "express";
import AccommodationsModel from "./model.js";
import { JwtAuthenticationMiddleware } from "../lib/tokenBaseAuth.js";
import createHttpError from "http-errors";
import { hostOnlyMiddleware } from "../lib/hostOnly.js";
import checkAccommodationsSchema from "./validator.js";
const accommodationsRouter = express.Router();

accommodationsRouter.get(
  "/",
  JwtAuthenticationMiddleware,
  async (req, res, next) => {
    try {
      const accommodations = await AccommodationsModel.find({}).populate({
        path: "host",
        select: "firstName lastName",
      });
      res.status(200).send(accommodations);
    } catch (error) {
      next(error);
    }
  }
);

accommodationsRouter.get(
  "/:accommodationId",
  JwtAuthenticationMiddleware,
  async (req, res, next) => {
    try {
      const accommodation = await AccommodationsModel.findById(
        req.params.accommodationId
      ).populate({
        path: "host",
        select: "firstName lastName",
      });
      if (accommodation) {
        res.status(200).send(accommodation);
      } else {
        next(
          createHttpError(
            404,
            `Accommodation with id ${req.params.accommodationId} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

accommodationsRouter.post(
  "/",
  JwtAuthenticationMiddleware,
  hostOnlyMiddleware,
  checkAccommodationsSchema,
  async (req, res, next) => {
    try {
      const accommodation = new AccommodationsModel(req.body);
      if (accommodation) {
        accommodation.save();
        res.status(201).send({ _id: accommodation._id });
      } else {
        next(createHttpError(400, "you send an invalid data"));
      }
    } catch (error) {
      next(error);
    }
  }
);

accommodationsRouter.put(
  "/:accommodationId",
  JwtAuthenticationMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const updatedAccommodation = await AccommodationsModel.findByIdAndUpdate(
        req.params.accommodationId,
        { ...req.body },
        { new: true, runValidators: true }
      ).populate({
        path: "host",
        select: "firstName lastName",
      });

      if (
       updatedAccommodation && updatedAccommodation.host._id.toString() === req.user._id.toString()
      ) {
        res.send(updatedAccommodation);
      } else if (updatedAccommodation && updatedAccommodation.host !== req.user._id) {
        next(
          createHttpError(
            403,
            `accommodation with id ${req.params.accommodationId} dose not belongs to you`
          )
        );
      } else {
        next(
          createHttpError(
            404,
            `accommodation with id ${req.params.accommodationId} not found`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

accommodationsRouter.delete(
  "/:accommodationId",
  JwtAuthenticationMiddleware,
  hostOnlyMiddleware,
  async (req, res, next) => {
    try {
      const accommodation = await AccommodationsModel.findById(
        req.params.accommodationId
      );
        if(accommodation){
            if (req.user._id.toString() === accommodation.host._id.toString()) {
                const deletedAccommodation =
                  await AccommodationsModel.findByIdAndDelete(
                    req.params.accommodationId
                  );
                if (deletedAccommodation) {
                  res.status(201).send({ message: "accommodation has been deleted."} );
                } 
              }else {
                next(
                  createHttpError(
                    403,
                    `accommodation with id ${req.params.accommodationId} does not belongs to you`
                  )
                );
              } 
        }else {
            next(
              createHttpError(
                404,
                `accommodation with id ${req.params.accommodationId} not found`
              )
            );
          }
     
    } catch (error) {
      next(error);
    }
  }
);

export default accommodationsRouter;

