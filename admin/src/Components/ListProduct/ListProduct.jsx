import React, { useState } from "react";
import "./ListProduct.css";
import cross_icon from "../../assets/cross_icon.png";
import { useEffect } from "react";

const ListProduct = () => {
    const [allproducts, setAllProducts] = useState([]);


    //fetch data from API and save in the state variable "allproducts"

    const fetchInfo = async () => {
        try {
            const response = await fetch("https://e-commerce-application-mern-2b4o.vercel.app/allproducts");
            let responseData = await response.json();
            setAllProducts(responseData);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            // You can add additional error handling or display an error message to the user
        }
    };


    //remove product
    const remove_product = async (id) => {
      try {
          await fetch("https://e-commerce-application-mern-2b4o.vercel.app/removeproduct", {
              method: "POST",
              headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json", //Specifies that the client expects a JSON response from the server.
              },
              body: JSON.stringify({ id:id}),
          });
      } catch (error) {
          console.error("Error removing product:", error.message);
          // You can add additional error handling or display an error message to the user
      }
      await fetchInfo()
  };
  

    //to load the data when page loads
    useEffect(() => {
        fetchInfo();
    }, []);



    return (
        <div className="list-product">
            <h1>All Product List</h1>
            <div className="listproduct-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Old Price</p>
                <p>New Price</p>
                <p>Category</p>
                <p>Remove</p>
            </div>

            <div className="listproduct-allproducts">
                <hr />
        
                {allproducts.map((product, index) => {
                    return (
                        <>
                            <div key={index} className="listproduct-format-main listproduct-format">
                                <img src={product.image} alt="" className="listproduct-product-icon" />
                                <p>{product.name}</p>
                                <p>${product.old_price}</p>
                                <p>${product.new_price}</p>
                                <p>{product.category}</p>
                                <img className="listproduct-remove-icon" src={cross_icon} alt="" onClick={() => remove_product(product.id)} />
                            </div>
                            <hr />
                        </>
                    );
                })}
            </div>
        </div>
    );
};

export default ListProduct;
