import { Book } from "../models/books.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const createBook = async (req, res) => {
  try {
    const { title, caption, image, rating } = req.body;
   
    if ([title, caption, image, rating].some((field) => field?.trim() === "")) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const bookImageLocalPath = req.files?.image[0]?.path;
    if(!bookImageLocalPath){
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
    })



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

const getBooks = async (req,res) => {
    try {
        console.log("request query", req.query);    
        const page = req.query.page || 1; //default page is 1
        const limit = req.query.limit || 5; //default limit is 10
        const skip = (page - 1) * limit; //skip the previous pages 
        const books = await Book.find({}).sort({createdAt: -1}).skip(skip).limit(limit).populate("user", "username profilePicture") //descending order

        res.send({
            message: "Books fetched successfully",
            books: books,
            currentPage: page,
            totalBooks: await Book.countDocuments({}), //total number of books in the database
            totalPages: Math.ceil(await Book.countDocuments({}) / limit), //total number of pages
        })


    } catch (error) {
        return res.status(500).json({
            message: "Error getting books",
            error: error.message,
        });
        
    }
}
export { createBook,getBooks };
