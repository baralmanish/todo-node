import { Router } from "express";
import { body } from "express-validator";

import { register, login } from "../controllers/userController";

const router = Router();

const loginValidator = [
  body("username", "Username is required.").not().isEmpty(),
  body("password", "Password is required.").not().isEmpty()
];

const registerValidator = [
  body("firstName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("First name is required.")
    .matches(/^[a-z]+$/i)
    .withMessage("First name is not valid."),
  body("lastName")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Last name is required.")
    .matches(/^[a-z]+$/i)
    .withMessage("Last name is not valid."),
  body("username")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Username is required.")
    .isLength({ min: 5 })
    .withMessage("Username must be at least 5 characters.")
    .matches(/^[a-z][a-z0-9_.]+$/i)
    .withMessage("Username is not valid."),
  body("password")
    .isLength({ min: 6 })
    .withMessage("The minimum password length is 6 characters.")
    .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,16}$/i)
    .withMessage("Password should be combination of at least one letter, one number and one special character")
];

router.post("/login", loginValidator, login);
router.post("/register", registerValidator, register);

export default router;
