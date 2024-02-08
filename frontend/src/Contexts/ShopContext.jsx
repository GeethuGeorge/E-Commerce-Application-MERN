import React, { useState } from "react";
import { createContext } from "react";

import { useEffect } from "react";
//create context
export const ShopContext = createContext(null);

const getDefaultCart = () => {
    let cart = {};
    for (let index = 0; index < 300 + 1; index++) {
        cart[index] = 0;
    }
    return cart;
};

//create context provider
export const ShopContextProvider = ({ children }) => {
    const [all_product, setAll_product] = useState([]);
    // the data is n all_product.js inside contextValue variable
    const [cartItems, setCartItems] = useState(getDefaultCart());
    //console.log(cartItems)//{1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 0, 11: 0, 12: 0, 13: 0, 14: 0, 15: 0, 16: 0, 17: 0, 18: 0, 19: 0, 20: 0, 21: 0, 22: 0, 23: 0, 24: 0, 25: 0, 26: 0, 27: 0, 28: 0, 29: 0, 30: 0, 31: 0, 32: 0, 33: 0, 34: 0, 35: 0, 36: 0}

    //useEffect to display all products from backend
    useEffect(() => {
        fetch("  https://e-commerce-application-mern-2b4o.vercel.app/allproducts")
      
            .then((response) => response.json())
            .then((data) => setAll_product(data));
        if (localStorage.getItem("auth-token"))
            fetch("https://e-commerce-application-mern-2b4o.vercel.app/getcart", {
                method: "POST",
                headers: {
                    Accept: "application/form-data",
                    "auth-token": localStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                },
                body: "",
            })
                .then((response) => response.json())
                .then((data) => setCartItems(data));
    }, []);

    //add to cart
    const addToCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] + 1,
        }));

        if (localStorage.getItem("auth-token")) {
            fetch("https://e-commerce-application-mern-2b4o.vercel.app/addtocart", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemID: itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error("Error:", error));
        }
    };

    //remove item from cart
    const removeFromCart = (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: prev[itemId] - 1, //existing items- 1
        }));

        if (localStorage.getItem("auth-token")) {
            fetch("https://e-commerce-application-mern-2b4o.vercel.app/removeFromCart", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "auth-token": localStorage.getItem("auth-token"),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ itemID: itemId }),
            })
                .then((response) => response.json())
                .then((data) => console.log(data))
                .catch((error) => console.error("Error:", error));
        }
    };

    //total cart amount
    // total cart amount
    // It iterates through the cartItems, finds the corresponding product information in the all_product array, and calculates the total amount based on the quantity and price of each item.
    const getTotalCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = all_product.find((product) => product.id === Number(item));

                if (itemInfo) {
                    totalAmount += itemInfo.new_price * cartItems[item];
                } else {
                    console.error(`Product with ID ${item} not found in all_product.`);
                }
            }
        }
        return totalAmount;
    };

    //get Total Number of cart items
    const getTotalCartItems = () => {
        let totalItem = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                totalItem += cartItems[item];
            }
        }
        return totalItem;
    };

    //useEffect hook is used to log cartItems after the component renders and whenever cartItems changes. This ensures that the logging only occurs after the state has been successfully updated.
    useEffect(() => {
        console.log(cartItems); // This log will reflect the updated state
    }, [cartItems]); // Run this effect whenever cartItems changes

    const contextValue = { all_product, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems };
    //console.log(cartItems); //cart item is an object

    return <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
