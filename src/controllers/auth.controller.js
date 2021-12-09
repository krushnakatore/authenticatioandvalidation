require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const express = require("express");
const router = express.Router();

const { body, validationResult } = require("express-validator");

const newToken = (user) => {
  return jwt.sign({ user: user }, process.env.JWT_ACCESS_KEY);
};

//============================register=========================//

router.post("/register" ,
body("name")
    .isLength({ min: 4, max: 20 })
    .exists()
    .withMessage(
      "Name of product has to be at least 4 characters and maximum 20 characters"
    ),
    body("password")
    .isLength({ min: 4, max: 20 })
    .exists()
    .withMessage(
      "Name of product has to be at least 4 characters and maximum 20 characters"
    ),

    body("email").custom(async (value) => {
            // value = a@a.com
            const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value);
            console.log(isEmail,value)
            if (!isEmail) {
              throw new Error("Please enter a proper email address");
            }
            const productByEmail = await User.findOne({ email: value })
              .lean()
              .exec();
            if (productByEmail) {
              throw new Error("Please try with a different email address");
            }
            return true;
          }),

async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let newErrors = errors.array().map(({ msg, param, location }) => {
      return {
        [param]: msg,
      };
    });
    return res.status(400).json({ errors: newErrors });
  }
  try {
    // check if the email address provided already exist
    let user = await User.findOne({ email: req.body.email }).lean().exec();
   
    console.log(User)
     console.log("body",body)
     



    // if it already exists then throw an error
    if (user)
      return res.status(400).json({
        status: "failed",
        message: " Please provide a different email address",
      });

    // else we will create the user we will hash the password as plain text password is harmful
    user = await User.create(req.body);

    // we will create the token
    const token = newToken(user);

    // return the user and the token
    res.status(201).json({ user, token });
  } catch (e) {
    return res.status(500).json({ status: "failed", message: e.message });
  }


});


  //========================login=================================//

router.post("/login" ,

body("password")
    .isLength({ min: 5, max: 8 })
    .exists()
    .withMessage(
      "Password  has to be at least 5 characters and maximum 8 characters"
    ),

    body("email").custom(async (value) => {
            // value = a@a.com
            const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value);
            console.log(isEmail,value)
            if (!isEmail) {
              throw new Error("Please enter a proper email address");
            }
            
            return true;
          }),

async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let newErrors = errors.array().map(({ msg, param, location }) => {
      return {
        [param]: msg,
      };
    });
    return res.status(400).json({ errors: newErrors });
  }
  try {
    // check if the email address provided already exist
    let user = await User.findOne({ email: req.body.email });

    console.log("user",user)
    // if it does not exist then throw an error
    if (!user)
      return res.status(400).json({
        status: "failed",
        message: " Please provide correct email address and password",
      });

    // else we match the password
    const match = await user.checkPassword(req.body.password);

    // if not match then throw an error
    if (!match)
      return res.status(400).json({
        status: "failed",
        message: " Please provide correct email address and password",
      });

    // if it matches then create the token
    const token = newToken(user);

    // return the user and the token
    res.status(201).json({ user, token });
  } catch (e) {
    return res.status(500).json({ status: "failed", message: e.message });
  }



});




module.exports = router;


//==========================================================

// body("name")
//     .isLength({ min: 4, max: 20 })
//     .exists()
//     .withMessage(
//       "Name of product has to be at least 4 characters and maximum 20 characters"
//     ),

//     body("email").custom(async (value) => {
//             // value = a@a.com
//             const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value);
//             console.log(isEmail,value)
//             if (!isEmail) {
//               throw new Error("Please enter a proper email address");
//             }
//             const productByEmail = await Product.findOne({ email: value })
//               .lean()
//               .exec();
//             if (productByEmail) {
//               throw new Error("Please try with a different email address");
//             }
//             return true;
//           }),
 


// router.post("/" ,
// body("name")
//     .isLength({ min: 4, max: 20 })
//     .exists()
//     .withMessage(
//       "Name of product has to be at least 4 characters and maximum 20 characters"
//     ),

//     body("email").custom(async (value) => {
//             // value = a@a.com
//             const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value);
//             console.log(isEmail,value)
//             if (!isEmail) {
//               throw new Error("Please enter a proper email address");
//             }
//             const productByEmail = await Product.findOne({ email: value })
//               .lean()
//               .exec();
//             if (productByEmail) {
//               throw new Error("Please try with a different email address");
//             }
//             return true;
//           }),

// async (req, res) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     let newErrors = errors.array().map(({ msg, param, location }) => {
//       return {
//         [param]: msg,
//       };
//     });
//     return res.status(400).json({ errors: newErrors });
//   }
//   try {
//     const user = await User.create(req.body);

//     return res.status(201).json({ user });
//   } catch (e) {
//     return res.status(500).json({ status: "failed", message: e.message });
//   }

// });