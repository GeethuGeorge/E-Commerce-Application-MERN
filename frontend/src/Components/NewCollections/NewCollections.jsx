import React, { useEffect } from "react";
import "./NewCollections.css";
import { useState } from "react";
import Item from "../Item/Item";

const NewCollections = () => {

    const[new_collection, setNew_collection]=useState([])
      
    //to display new collections
    useEffect(() => {
       fetch("https://e-commerce-application-mern-2b4o.vercel.app/newcollections")
       .then((response)=>response.json())
       .then((data)=>setNew_collection(data))
    }, [])
    

    return (
        <div className="new-collections">
            <h1>NEW COLLECTIONS</h1>
            <hr />
            <div className="collections">
                {new_collection.map((item, i) => {
                    return (
                        <Item
                            key={i}
                            id={item.id}
                            name={item.name}
                            image={item.image}
                            new_price={item.new_price}
                            old_price={item.old_price}
                            className={item}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default NewCollections;
