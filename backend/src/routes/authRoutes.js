import { Router } from "express";
const router = Router();


//route                        middleware, controller
// router.route("/register").post(verifyJwt,registerUser)
router.get("/register", (req, res) => {
    res.send("helo from register");
});
router.get("/login", (req, res) => {
    res.send("helo from login");
});

export default router;
  