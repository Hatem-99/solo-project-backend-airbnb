import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const accommodationsSchema = {
    name: {
      in: ["body"],
      isString: {
        errorMessage: "name is a mandatory field and needs to be a string",
      },
    },
    host: {
        in: ["body"],
        isString: {
            errorMessage: "host is a mandatory field and needs to be a string "
        }
    },
    description: {
        in: ["body"],
        isString: {
            errorMessage: "description is a mandatory field and needs to be a  string "
        }
    },
    maxGusts: {
        in: ["body"],
        isString: {
            errorMessage: "maxGusts is a mandatory field and needs to be a string "
        }
    },
    city: {
      in: ["body"],
      isString: {
          errorMessage: "city is a mandatory field and needs to be a string "
      }
  }
 
  }
  

  
  export const checkAccommodationsSchema = checkSchema(accommodationsSchema) 
  
  export const checkValidationResult = (req, res, next) => {
   
    const errors = validationResult(req)
  
    if (!errors.isEmpty()) {
      
      next(
        createHttpError(400, "Validation errors in request body", {
          errorsList: errors.array(),
        })
      )
    } else {
   
      next()
    }
  }
  export default checkAccommodationsSchema;