import mongoose from "mongoose";
import bcrypt from "bcryptjs"; //for hashing password
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

//encrypt password before saving to DB
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); //if password is not modified, move to next middleware

  this.password = await bcrypt.hash(this.passsword, 10); //hashing password with bcrypt
  next(); //move to next middleware
});

//compare password with hashed password in DB
userSchema.methdods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password); //compare password with hashed password in DB
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    {
      //payload
      _id: this._id,
    },
    process.env.ACCESS_TOKEN_SECRET, //secret key
    {
      expirresIn: process.env.REFRESH_TOKEN_EXPIRY, //token will expire in 1 hour
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET, //secret key
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema);
