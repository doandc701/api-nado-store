import express, { Request, Response } from "express";
import {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
} from "../../controllers/Authorization/UserController";

import { verifyToken, isAdmin, isModerator } from "../../middlewares/authJwt";
import uploads from "../../middlewares/upload";
import authPage from "../../middlewares/basicAuth";

import {
  SignUp,
  SignIn,
} from "../../controllers/Authentication/AuthController";

import {
  getRoles,
  postRoles,
} from "../../controllers/Authentication/RolesController";

// import { loginAccountLimiter } from "../../services/rateLimit.service";

const router = express.Router();

// router.post("/auth/signup", postUsers);
// router.post("/signup", uploads.single("avatar[]"), SignUp);
router.post("/register", uploads.single("avatar"), SignUp);
// router.post(
//   "/signin",
//   authPage(["6457288639a2dcda6de10d56", "644116f219d977e49dc75c3b"]),
//   SignIn,
//   loginAccountLimiter,
// );

// PERMISSION ADMIN AND MODIFILED
router.post(
  "/login",
  authPage(["6507b75e5abe10679308af7e", "650fe8222c1716e810349e16"]),
  SignIn
);
// PERMISSION USER
router.post("/buyer/login", authPage(["6507b82882a03acc69c61b7f"]), SignIn);

// Authorization:
// GET /api/test/all
// GET /api/test/user
// GET /api/test/mod
// GET /api/test/admin
router.get("/api/test/all", allAccess);
router.get("/api/test/user", verifyToken, userBoard);
router.get("/api/test/mod", [verifyToken, isModerator], moderatorBoard);
router.get("/api/test/admin", [verifyToken, isAdmin], adminBoard);

// roles
// roles
router.get("/role", getRoles);
router.post("/role", postRoles);
export default router;
