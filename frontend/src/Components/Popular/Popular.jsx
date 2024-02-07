import React from "react";
import "./Popular.css";
import { useState } from "react";
import { useEffect } from "react";
import Item from "../Item/Item.jsx";

const Popular = () => {
    const [popularProducts, setpopularProducts] = useState([]);

    //to display new collections
    useEffect(() => {
        fetch("https://e-commerce-application-mern-2b4o.vercel.app/popularinwomen")
            .then((response) => response.json())
            .then((data) => setpopularProducts(data));
    }, []);

    return (
        <div className="popular">
            <h1>POPULAR IN WOMEN</h1>
            <hr />
            <div className="popular_item">
                {popularProducts.map((item, i) => {
                    return (
                        <Item
                            key={i}
                            id={item.id}
                            name={item.name}
                            image={item.image}
                            new_price={item.new_price}
                            old_price={item.old_price}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Popular;
