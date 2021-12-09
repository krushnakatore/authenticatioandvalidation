const express = require("express");

const Product = require("../models/product.model");

const authenticate = require("../middlewares/authenticate");

// const { body, validationResult } = require("express-validator");

const router = express.Router();

router.post("/",authenticate, async (req, res) => {
  try {
    const user = req.user;

    const product = await Product.create({
      title: req.body.title,
      body: req.body.body,
      user: user.user._id,
    });

    return res.status(201).json({ product });
  } catch (e) {
    return res.status(500).json({ status: "failed", message: e.message });
  }
});

router.get("/", async (req, res) => {
  const products = await Product.find().lean().exec();

  return res.send(products);
});

module.exports = router;
//=========================================================


// const { body, validationResult } = require("express-validator");



// const router = express.Router();

// router.post(
//   "/",
//   body("first_name")
//     .isLength({ min: 4, max: 20 })
//     .exists()
//     .withMessage(
//       "Name of product has to be at least 4 characters and maximum 20 characters"
//     ),

//     body("last_name")
//     .isLength({ min: 4, max: 20 })
//     .exists()
//     .withMessage(
//       "Name of product has to be at least 4 characters and maximum 20 characters"
//     ),
    
//     body("pincode")
//     .isInt({gt: 99999, lt: 1000000})
//     .withMessage(
//       "Name of pincode has to be length 6"
//     ),

//     body("age")
//     .exists()
//     .isInt({gt: 1, lt: 101})
//     .withMessage(
//       "Name of age has to be at least 1 number and maximum 100 numbers"
//     ),

//   body("gender").custom((value) => {
//     // console.log(value)
//     var arr = ["Male","Female","Others"]
//      var count = 0;
//     for(var i = 0; i < arr.length; i++){
//       if(value === arr[i]){
//         count++
//       }
//     }
//     // console.log(count)

//     if(count > 0){
//       return true;
//     }else{
//       throw new Error("Invalid Gender input");
//     }
   
//   }),

//   body("email_id").custom(async (value) => {
//     // value = a@a.com
//     const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value);
//     console.log(isEmail,value)
//     if (!isEmail) {
//       throw new Error("Please enter a proper email address");
//     }
//     const productByEmail = await User.findOne({ email_id: value })
//       .lean()
//       .exec();
//     if (productByEmail) {
//       throw new Error("Please try with a different email address");
//     }
//     return true;
//   }),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       let newErrors = errors.array().map(({ msg, param, location }) => {
//         return {
//           [param]: msg,
//         };
//       });
//       return res.status(400).json({ errors: newErrors });
//     }
//     try {
//       const user = await User.create(req.body);

//       return res.status(201).json({ user });
//     } catch (e) {
//       return res.status(500).json({ status: "failed", message: e.message });
//     }
//   }
// );

// module.exports = router;