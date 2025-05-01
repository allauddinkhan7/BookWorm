import bcrypt from "bcryptjs";
import { User } from "../models/user.models.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const userForToken = await User.findById(userId);
    const accessToken = userForToken.generateAccessToken();
    const refreshToken = userForToken.generateRefreshToken();

    //save refresh token
    userForToken.refreshToken = refreshToken;
    await userForToken.save({ validateBeforeSave: true });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new Error("Token generation failed");
  }
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if ([username, email, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const isUserExist = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserExist) {
      return res.status(409).json({ message: "User already exists" });
    }
    
    const profilePicture = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    
    // Hash the password (only if no pre-save hook exists)
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      profilePicture,
    });
    
    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );
    
    if (!createdUser) {
      return res.status(500).json({ msg: "Error creating user" });
    }

    return res.status(201).json({
      message: "User created successfully",
      user: createdUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const isUserExist = await User.findOne({
      $or: [{ email }],
    });

    if (!isUserExist) {
      return res.status(400).json({ message: "user not found" });
    }

    const isPasswordCorrect = await isUserExist.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //generate access token and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      isUserExist._id
    );
    const loggedInUser = await User.findById(isUserExist._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        message: "User logged in successfully",
        user: loggedInUser,
        accessToken,
        refreshToken,
      });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export {registerUser, loginUser}; 