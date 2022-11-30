import { body } from "express-validator";


export const loginValidation = [
    body("email","wrong! email").isEmail(),
    body("password","wrong! password length min 5").isLength({ min: 5 }),
]

export const registerValidation = [
    body("email","wrong! email").isEmail(),
    body("password","wrong! password length min 5").isLength({ min: 5 }),
    body("fullName","wrong! name length min 3").isLength({ min: 3 }),
    body("avatarUrl","wrong! link").optional().isURL(),
]

export const postCreateValidation = [
    body("title","write title! \n length min 3").isLength({ min: 3 }).isString(),
    body("text","write text! \n length min 3").isLength({ min: 3 }).isString(),
    body("tags","wrong tag!").optional().isString(),
    body("imageUrl","wrong link!").optional().isString(),
]


