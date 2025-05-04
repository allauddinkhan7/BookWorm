import { Router } from "express";
import { createBook, deleteBook, getBooks, getRecommendedBooks } from "../controllers/book.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
const router = Router();


//route                        middleware, controller
// router.route("/register").post(verifyJwt,registerUser)

//CRUD book routes
//create
router.route("/").post(verifyJwt,createBook);
//read
router.route("/").get(verifyJwt, getBooks);

//delete
router.route("/:id").delete(verifyJwt, deleteBook);

//get recommended books by the  logged in user
router.route("/user").get(verifyJwt, getRecommendedBooks);





export default router;
  