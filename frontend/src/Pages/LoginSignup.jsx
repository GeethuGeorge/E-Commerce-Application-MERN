import React, { useState } from "react";
import "./CSS/LoginSignup.css";

const LoginSignup = () =>{
    const [state, setState] = useState("Login");
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: "",
    });

    //onchange handler
    const changeHandler = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    //SignUp
    const signup = async () => {
      let responseData;
      const response = await fetch("https://e-commerce-application-mern-2b4o.vercel.app/signup", {
          method: "POST",
          headers:{
            Accept: "application/json",  
            "Content-Type": "application/json", 
          },
          body: JSON.stringify(formData),
      });

      let data = await response.json();
      responseData = data;


      if (responseData.success) {
          localStorage.setItem("auth-token", responseData.token);
          window.location.replace("/");
          console.log(responseData)
      }else{
        alert(responseData.error || "Unknown error occurred");
      }
  };
//-------------------------------------------------
    //Login
    const login = async () => {
      let responseData;
      const response = await fetch("https://e-commerce-application-mern-2b4o.vercel.app/login", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    
      let data = await response.json(); 
      responseData = data;
    
      if (responseData.success) {
        localStorage.setItem("auth-token", responseData.token);
        window.location.replace("/");
        console.log(responseData);
      } else {
        alert(responseData.error || "Unknown error occurred");
      }
    }
    
    

    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>
                <div className="loginsignup-fields">
                    {state === "Sign Up" ? (
                        <input
                            name="username"
                            value={formData.username}
                            onChange={changeHandler}
                            type="text"
                            placeholder="Your Name"
                        />
                    ) : (
                        ""
                    )}
                    <input
                        name="email"
                        value={formData.email}
                        onChange={changeHandler}
                        type="email"
                        placeholder="Email Address"
                    />
                    <input
                        name="password"
                        value={formData.password}
                        onChange={changeHandler}
                        type="password"
                        placeholder="Password"
                    />
                    <button
                        onClick={() => {
                            state === "Login" ? login() : signup();
                        }}
                    >
                        Continue
                    </button>
                    {state === "Sign Up" ? (
                        <p className="loginsignup-login">
                            Already have an account ?{" "}
                            <span
                                onClick={() => {
                                    setState("Login");
                                }}
                            >
                                Login here
                            </span>
                        </p>
                    ) : (
                        <p className="loginsignup-login">
                            Create an account ?{" "}
                            <span
                                onClick={() => {
                                    setState("Sign Up");
                                }}
                            >
                                Click Here
                            </span>
                        </p>
                    )}
                    <div className="loginsignup-agree">
                        <input type="checkbox" name="" id="" />
                        <p>By Continuing, I agree to the terms of use & privacy policy</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginSignup;
