import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"

const userSchema = {
    firstName: {
      in: ["body"],
      isString: {
        errorMessage: "firstName is a mandatory field and needs to be a string",
      },
    },
    lastName: {
        in: ["body"],
        isString: {
            errorMessage: "lastName is a mandatory field and needs to be a string "
        }
    },
    email: {
        in: ["body"],
        isString: {
            errorMessage: "email is a mandatory field and needs to be a  string "
        }
    },
    password: {
        in: ["body"],
        isString: {
            errorMessage: "Password is a mandatory field and needs to be a string "
        }
    }
 
  }
  

  
  export const checkUserSchema = checkSchema(userSchema) 
  
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
  export default checkUserSchema;