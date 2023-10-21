import express from "express";
const router = express.Router();

// import {
//   validateIdInParam,
//   validateLoginData,
//   validateRefreshToken,
//   validateRegistrationData,
//   validateUpdateProfile,
//   validateUpdateOperatings,
//   validateAddFavourite,
// } from "../validators/auth";
// import { auth, authVendor } from "../middleware/auth";
// import { validation as checkValid } from "../middleware/checkValid";
import { register, login, getUserById } from "../controllers/auth";

// router.get("/accounts", auth, getAllAccount);
// router.get("/accounts/vendor", getAllVendor);
router.get("/accounts/:id", getUserById);

router.put("/register", register);
router.put("/login", login);
// router.post("/refresh", validateRefreshToken, checkValid, refresh);

// router.patch(
//   "/update/profile/:id",
//   auth,
//   validateIdInParam,
//   validateUpdateProfile,
//   checkValid,
//   updateProfile
// );
// router.delete(
//   "/delete/:id",
//   auth,
//   validateIdInParam,
//   checkValid,
//   deleteAccount
// );
// router.patch(
//   "/update/vendor/:id",
//   authVendor,
//   validateIdInParam,
//   validateUpdateOperatings,
//   checkValid,
//   updateVendorOperatings
// );

// router.post(
//   "/favourite",
//   auth,
//   validateAddFavourite,
//   checkValid,
//   getAllFavourite
// );
// router.put("/favourite", auth, validateAddFavourite, checkValid, addFavourite);
// router.delete(
//   "/favourite",
//   auth,
//   validateAddFavourite,
//   checkValid,
//   delFavourite
// );

export default router;
