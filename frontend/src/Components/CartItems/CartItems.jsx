import React, { useContext } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Contexts/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";

const CartItems = () => {
    const { all_product, cartItems, removeFromCart , getTotalCartAmount} = useContext(ShopContext);
    return (
        <div className="cartitems">
            <div className="cartitems-format-main">
                <p>Products</p>
                <p>Title</p>
                <p>Price</p>
                <p>Quantity</p>
                <p>Total</p>
                <p>Remove</p>
            </div>
            <hr />
            {all_product.map((item) => {
                if (cartItems[item.id] > 0) {
                    return (
                        <div>
                            <div className="cartitems-format cartitems-format-main" key={item.id}>
                                <img src={item.image} alt="" className="carticon-product-icon" />
                                <p>{item.name}</p>
                                <p>${item.new_price}</p>
                                <button className="cartitems-quantity">{cartItems[item.id]}</button>
                                <p>${item.new_price * cartItems[item.id]}</p>
                                <img
                                    className="cartitems-remove-icon"
                                    src={remove_icon}
                                    alt=""
                                    onClick={() => {
                                        removeFromCart(item.id);
                                    }}
                                />
                            </div>
                            <hr />
                        </div>
                    );
                }
                return null;
            })}
            <hr />
            <div className="cartitems-down">
                <div className="cartitems-total">
                    <h1>Cart Totals</h1>
                    <div className="cartitems-total-item">
                        <p>Sub Total :</p>
                        <p>${getTotalCartAmount()}</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <p>Shipping Fee :</p>
                        <p>Free</p>
                    </div>
                    <hr />
                    <div className="cartitems-total-item">
                        <h3>Total</h3>
                        <h3>${getTotalCartAmount()}</h3>
                    </div>
                    <button>PROCEED TO CHECKOUT</button>
                </div>

                <div className="cartitems-promocode">
                    <p>If you have a promo code, Please enter</p>
                    <div className="cartitems-promobox">
                        <input type="text"placeholder="Promo Code"/>
                        <button>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItems;
