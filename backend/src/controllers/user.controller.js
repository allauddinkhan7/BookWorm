

const registerUser = async (req,res) => {
    try {
        const {username, email, password} = req.body;
        
        if(
            [username, email, password].some((field) => field?.trim() === "")
        ) return res.status(400).json({message: "All fields are required"});

    
        const isUserExist = await User.findOne({
            $or:[
                {username},{email}
            ]
        })


        if(isUserExist) return res.status(409).json({message: "User already exists"});

        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`; //dicebear api to generate random profile image

        const newUser = await User.create({
            username,
            email,
            password,
            profileImage
        })

        const createdUser = await User.findById(newUser._id).select("-password -refreshToken"); //to not show password in response
        if (!createdUser) res.status(500).json({msg:"Error creating user"})
        
        res.status(201).json({
            message: "User created successfully",
            user: createdUser,
        }); 
          
    } catch (error) {
        res.tatus(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
}


