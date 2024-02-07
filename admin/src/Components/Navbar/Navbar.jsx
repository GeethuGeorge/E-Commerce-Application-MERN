import React from 'react'
import './Navbar.css';
import navlogo from "../../assets/nav-logo.svg";
import geethupic from "../../assets/geethupic.jpg";
/* import navProfile from "../../assets/nav-profile.svg"; */


const Navbar = () => {
  return (
    <div className="navbar">
      <img  src={navlogo} alt="" className="nav-logo" />
      <img src={geethupic} alt="" className="nav-profile-logo" />
{/*       <img src={navProfile} alt="" className="nav-profile" /> */}

    </div>
  )
}

export default Navbar