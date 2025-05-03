//user exist or or not
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
export const verifyJwt = async (req, _, next) => {
  //not using res so put _ instead
  try {
    //get token from cookies or header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    //if (token)
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    //find user by id in the token
    const user = await User.findById(decodedToken?._id) //ref to this _id -> user.model.js -> jwt.sign({_id})
      .select("-password -refreshToken");

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    //add that Object
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verifying JWT:", error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    } else if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    } else {
      return res.status(500).json({ message: "Internal server error" });
    }
  }
};
