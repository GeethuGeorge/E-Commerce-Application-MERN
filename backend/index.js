const port = 4000;
const express = require("express");
const app = express();

// Importing Node.js modules and external libraries
const cloudinary = require('cloudinary').v2;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

// Load environment variables
require('dotenv').config();

// Middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get("/", (req, res) => {
    res.send("Express App is running");
});


// Configure Cloudinary with your cloud name, API key, and API secret
cloudinary.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.api_key,
    api_secret:process.env.api_secret
  });
//-----------------------------------------------

// Configure Multer to handle file uploads
const upload = multer({ storage: multer.memoryStorage() });

// Define the route handler for image uploads
app.post('/upload', upload.single('product'), async (req, res) => {
    try {
        // Convert the buffer to a base64-encoded string
        const base64String = req.file.buffer.toString('base64');

        // Upload the image file to Cloudinary
        const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${base64String}`);
    
        // If the upload is successful, send the public URL of the uploaded image back to the client
        res.json({ 
            success: true,
            imageUrl: result.secure_url 
        });
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        res.status(500).json({ error: 'Failed to upload image' });
    }
});


//----------------------------------------------
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now(),
    },
    available: {
        type: Boolean,
        default: true,
    },
});

//2.End point addProduct to database
app.post("/addproduct", async (req, res) => {
    // Create a new product instance based on the request body
    try {
        //to generate the id automatically
        let products = await Product.find({}); // to retrieve all documents (products) from the "Product" collection using the find method.The result is an array of product
        let id;
        if (products.length > 0) {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id + 1;
        } else {
            id = 1;
        }
        // Create a new product instance based on the request body
        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        // Save the product to the database
        await product.save();

        // Send a response indicating success ie a promise to front end
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        // Handle errors, and send an appropriate response
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error",
        });
    }
});

//3.End point deleteproduct from database
app.post("/removeproduct", async (req, res) => {
    try {
        //to delete one product from db we have one method in mongoose findoneanddelete

        const removedProduct = await Product.findOneAndDelete({
            id: req.body.id,
        });
        console.log("Removed");
        if (!removedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        } else {
            // Respond with a success message
            res.json({ success: true, message: "Product removed successfully", name: req.body.name });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

//creating API for getting all products
app.get("/allproducts", async (req, res) => {
    try {
        // Find all products in the database-we get an array of objects
        const products = await Product.find({});
        console.log("All Products Fetched"); // Respond with the list of products
        res.send(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

//-----------------------------------------------------
//schema creating for userModel
const Users = mongoose.model("Users", {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Object,
        default: Date.now(),
    },
});

//creating endpoint for resgistering the user
app.post("/signup", async (req, res) => {
    let check = await Users.findOne({
        email: req.body.email,
    });

    //if email id exists
    if (check) {
        return res.status(400).json({ success: false, error: "Existing user found with same Email ID" });
    }

    // else If no existing user is found, it creates an initial 'cart' object with 300 items, where each item is initialized to 0.
    let cart = {};
    for (let i = 1; i <= 300; i++) {
        cart[i] = 0;
    }
    //Then, it creates a new user instance using the Mongoose model 'Users' with the provided user details (name, email, password, cartData)
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    });
    // it saves the new user to the database using user.save().
    await user.save();

    //JWT authentication
    //creating a JSON Web Token (JWT) for authentication in a Node.js application using the jsonwebtoken library.
    //create data object
    const data = {
        user: { id: user.id },
    };

    //create token
    const token = jwt.sign(data, process.env.JWT_SECRET); //token wont be readable
    res.json({ success: true, token });
});

//creating end point for userlogin

app.post("/login", async (req, res) => {
    // find a user in the database based on the provided email
    let user = await Users.findOne({
        email: req.body.email,
    });
    //If a user is found, it compares the provided password (req.body.password) with the user's stored password.
    if (user) {
        const passcompare = req.body.password === user.password;
        if (passcompare) {
            //If the passwords match, it generates a JWT token containing user information and signs it with the secret key.
            const data = {
                user: {
                    id: user.id,
                },
            };

            const token = jwt.sign(data, process.env.JWT_SECRET); //token wont be readable
            //The token is then sent back as part of the JSON response.
            res.json({ success: true, token });
        } else {
            res.json({ success: false, error: "Wrong Password" });
        }
    } else {
        res.json({ success: false, error: "Wrong Email id" });
    }
});

//-----------------------------------------------------

//creating end point for new collection data, when new product added via admin dashboard

app.get("/newcollections", async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New Collections Fetched");
    res.send(newcollection);
});

//creating endpoint for popular in womens section
app.get("/popularinwomen", async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("popular_in_women Fetched");
    res.send(popular_in_women);
});

//creating endpoint for adding products in cartData
app.get("/popularinwomen", async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_women = products.slice(0, 4);
    console.log("popular_in_women Fetched");
    res.send(popular_in_women);
});

//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header("auth-token");
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using valid token" });
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "Please authenticate using valid token" });
        }
    }
};
//creating end points for adding products in cart data
app.post("/addtocart", fetchUser, async (req, res) => {
    console.log("added", req.body.itemID);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemID] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
});

//creating endpoint to remove product from cartData
app.post("/removeFromCart", fetchUser, async (req, res) => {
    console.log("removed", req.body.itemID);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemID] > 0) userData.cartData[req.body.itemID] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
});

//creating endpoints to get cart data
app.post("/getcart", fetchUser, async (req, res) => {
    console.log("Get Cart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
});

//Listen Port
//a server often refers to a web server, which is a specialized server designed to handle HTTP requests and serve web pages or API responses from databases
app.listen(port, (error) => {
    if (!error) {
        console.log(`Server running on ${port}`);
    } else {
        console.log("Error:" + error);
    }
});
