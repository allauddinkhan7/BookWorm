import { Book } from "../models/books.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import cloudinary from "../utils/cloudinary.js";
const createBook = async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;

    if ([title, caption, image, rating].some((field) => field?.trim() === "")) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bookImageLocalPath = req.files?.image[0]?.path;
    if (!bookImageLocalPath) {
      return res.status(400).json({ message: "Image is required" });
    }

    const bookImg = await uploadOnCloudinary(bookImageLocalPath);
    if (!bookImg) {
      return res.status(500).json({ message: "Error uploading image" });
    }

    const newBook = await Book.create({
      title,
      caption,
      image: bookImg.url,
      rating,
      user: req.user._id, // Assuming you have the user ID from the request object
    });

    res.status(201).json({
      message: "Book created successfully",
      book: newBook,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating book",
      error: error.message,
    });
  }
};

const getBooks = async (req, res) => {
  try {
    console.log("request query from FrontEnd", req.query);
    const page = req.query.page || 1; //default page is 1
    const limit = req.query.limit || 5; //default limit is 10
    const skip = (page - 1) * limit; //skip the previous pages
    const books = await Book.find({})
      .sort({ createdAt: -1 }) //descending order
      .skip(skip)
      .limit(limit)
      .populate("user", "username profilePicture"); //populate is for -> getting the user data from the user model. populate is a mongoose method that allows you to reference documents in other collections. In this case, it populates the user field in the Book model with the username and profilePicture fields from the User model.
    //populate is used to get the user data from the user model. In this case, it populates the user field in the Book model with the username and profilePicture fields from the User model.

    res.send({
      message: "Books fetched successfully",
      books: books,
      currentPage: page,
      totalBooks: await Book.countDocuments({}), //total number of books in the database
      totalPages: Math.ceil((await Book.countDocuments({})) / limit), //total number of pages
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error getting books",
      error: error.message,
    });
  }
};

const deleteBook = async (req, res) => {
  try {
    const findBook = await Book.findById(req, params.id);
    if (!findBook) return res.status(404).json({ message: "Book not found" });

    //check if user is the creator of the book
    if (findBook.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this book" });
    }
    //if authorized, delete the book
    //delete image from cloudinary
    //Ex: https://res.cloudinary.com/dzqjv4x5g/image/upload/v1698231234/asdqweqwe1232esade23423.jpg
    if (findBook.image && findBook.image.includes("cloudinary")) {
      try {
        const publicId = findBook.image.split("/").pop().split(".")[0]; //get the public id from the image url
        await uploadOnCloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.log("Error deleting image from cloudinary", error);
        return res
          .status(500)
          .json({ message: "Error deleting image from cloudinary" });
      }
    }
    await Book.findByIdAndDelete(findBook._id);
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting book",
      error: error.message,
    });
  }
};

const getRecommendedBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user._id }).sort({//get all books that are created by the logged in/current user
      createdAt: -1,
    }); //descending order
    res.json(books);
  } catch (error) {
    return res.status(500).json({
      message: "Error getting recommended books",
      error: error.message,
    });
  }
};

export { createBook, getBooks, deleteBook, getRecommendedBooks };
