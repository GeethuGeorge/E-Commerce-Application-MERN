import React, { useContext, useState } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Contexts/ShopContext";
import { useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons'

const Navbar = () => {

  const[menu, setMenu]=useState("shop");
   const{getTotalCartItems}=useContext(ShopContext)

   const menuRef=useRef()

   //menuref is used to toogle a class in ul tag
   const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle('nav-menu-visible');
 };


    return (
        <div className="navbar">
            <div className="nav-logo">
                <img src={logo} alt="" />
                <p>SHOPPER</p>
            </div>
            <FontAwesomeIcon icon={faCaretDown} className="nav-dropdown" onClick={dropdown_toggle}  style={{ fontSize: '48px', color: '#7166bc'}}  />
            <ul ref={menuRef} className="nav-menu">
                <li onClick={()=>{setMenu("shop")}}><Link to="/" style={{textDecoration:"none"}}>Shop</Link>{menu === "shop" ? <hr /> : <></> }</li>                                   
                <li onClick={()=>{setMenu("mens")}}><Link to="/mens"  style={{textDecoration:"none"}}>Men</Link>{menu === "mens" ? <hr /> : <></> }</li>
                <li onClick={()=>{setMenu("womens")}}><Link to="/womens"  style={{textDecoration:"none"}}>Women</Link>{menu === "womens" ? <hr /> : <></> }</li>
                <li onClick={()=>{setMenu("kids")}}><Link to="/kids"  style={{textDecoration:"none"}}>Kid</Link>{menu === "kids" ? <hr /> : <></> }</li>
            </ul>
            <div className="nav-login-cart">
                {localStorage.getItem('auth-token')?<button onClick={()=>{localStorage.removeItem('auth-token');window.location.replace('/')}}>Logout</button>: <Link to ="/login"><button>Login</button></Link>  }
     
                <Link to ='/cart'><img src={cart_icon} alt="" className="nav-cart" /></Link>
                <div className="nav-cart-count">{getTotalCartItems()}</div>
            </div>
        </div>
    );
};

export default Navbar;
