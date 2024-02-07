import React, { useState } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const AddProduct = () => {
    const [image, setImage] = useState(false);

    //to store prodcut details
    const [productDetails, setProductDetails] = useState({
        name: "",
        image: "",
        category: "women",
        new_price: "",
        old_price: "",
    });
    //to add image
    const imageHandler = (event) => {
        setImage(event.target.files[0]);
    };

    //to store the input values
    const changeHandler = (event) => {
        setProductDetails({
            ...productDetails,
            [event.target.name]: event.target.value,
        });
    };

    const notify = (message, type) => {
        toast(message, { type });
    };

    //add handler to store the values in the state

    const Add_Product = async () => {
        //console.log(productDetails); // Logs the current state of productDetails to the console.

        let responseData; 
        let product = productDetails; 
        try {
            let formData = new FormData();
            formData.append("product", image); // In this case, "product" is an object that contains the image file as one of its properties, and you're appending the entire "product" object to the FormData object.

            let response = await fetch("http://localhost:4000/upload", {
              
                method: "POST",
                headers: {
                    Accept: "application/json", 
                },
                body: formData,
            });

            let responseData = await response.json();
       
            //: Reads the JSON response from the server. This assumes that the server responds with JSON data.
            //console.log("Response Data:", responseData); //{success: 1, image_url: 'http://localhost:4000/images/product_1706887185685.png'}

            if (responseData.success) {
                console.log("Image upload successful");
                console.log(responseData)
                // Update the product details with the image URL
                let updatedProduct = (product.image = responseData.imageUrl);
                console.log("Updated Product:", updatedProduct);
                console.log(product);

                //Add the product when addproduct is called
                let resp = await fetch("http://localhost:4000/addproduct", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json", //Specifies that the client expects a JSON response from the server.
                    },
                    body: JSON.stringify(product),
                });

                let responsefromSever = await resp.json(); //: Reads the JSON response from the server. This assumes that the server
                if (responsefromSever.success) {
                    notify("Product Added Successfully", "success");
                    setProductDetails({
                      name: "",
                      image: "",
                      category: "women",
                      new_price: "",
                      old_price: "",
                  })
                  console.log(productDetails)
                } else {
                    notify("Failed adding the product", "error");
                }
            } else {
                console.error("Image upload failed");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div className="add-product">
            <div className="addproduct-itemfield">
                <p>Product Title</p>
                <input
                    value={productDetails.name}
                    onChange={changeHandler}
                    type="text"
                    name="name"
                    placeholder="Type here"
                />
            </div>

            <div className="addproduct-price">
                <div className="addproduct-itemfield">
                    <p>Price</p>
                    <input
                        value={productDetails.old_price}
                        onChange={changeHandler}
                        type="text"
                        name="old_price"
                        placeholder="Type here"
                    />
                </div>

                <div className="addproduct-itemfield">
                    <p>Offer Price</p>
                    <input
                        value={productDetails.new_price}
                        onChange={changeHandler}
                        type="text"
                        name="new_price"
                        placeholder="Type here"
                    />
                </div>
            </div>

            <div className="addproduct-itemfield">
                <p>Product Category</p>
                <select
                    value={productDetails.category}
                    onChange={changeHandler}
                    name="category"
                    className="add-product-selector"
                >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                    <option value="kid">Kid</option>
                </select>
            </div>

            <div className="addproduct-itemfield">
                <label htmlFor="file-input">
                    <img
                        src={image ? URL.createObjectURL(image) : upload_area}
                        className="addproduct-thumbnail-img"
                        alt=""
                    />
                </label>
                <input onChange={imageHandler} type="file" name="image" id="file-input" hidden />
            </div>

            <button
                onClick={() => {
                    Add_Product();
                }}
                className="addproduct-btn"
            >
                ADD
            </button>
        </div>
    );
};

export default AddProduct;
