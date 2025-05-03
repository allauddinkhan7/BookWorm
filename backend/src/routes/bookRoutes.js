import { Router } from "express";
import { createBook, getBooks } from "../controllers/book.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();


//route                        middleware, controller
// router.route("/register").post(verifyJwt,registerUser)

//CRUD book routes
//create
router.route("/").post(verifyJwt,createBook);
//read
router.route("/").get(verifyJwt, getBooks);







export default router;
  