import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
const router = Router();


//route                        middleware, controller
// router.route("/register").post(verifyJwt,registerUser)
router.route("/register").post(registerUser)

// router.POST("/register", (req, res) => {
//     res.send("helo from register");
// });
router.get("/login", (req, res) => {
    res.send("helo from login");
});

export default router;
  