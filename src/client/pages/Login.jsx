import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../assets/styles.scss";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import LoginButton from "../components/LogInGoogle";
import { gapi } from "gapi-script";
import LogInGoogle from "../components/LogInGoogle";
const clientId =
    "88560141638-64a3h5d4jq9ddjhq00h6m8n5unss8g04.apps.googleusercontent.com";
function Login({ loggedIn, setLoggedIn }) {
    const navigate = useNavigate();
    const [inputPassword, setInputPassword] = useState("");
    const [inputEmail, setInputEmail] = useState("");

    async function checkLogin(event) {
        event.preventDefault();
        try {
            const res = await axios.post(
                "http://localhost:5001/users/login",
                { email: inputEmail, password: inputPassword },
                { withCredentials: true }
            );
            console.log(res);
            // .then(res => res.json())
            const loginStatus = Cookies.get("loggedIn");

            console.log(loggedIn);
            setLoggedIn(true);
            console.log("correct input");
            navigate("/");
        } catch (err) {
            console.error("Error: ", err);
        }
    }
    return (
        <div>
            <h1>Login</h1>
            <div className="loginPage">
                <form onSubmit={checkLogin}>
                    <div className="inputs">
                        <input
                            className="login-input"
                            type="text"
                            name="username"
                            placeholder="Email"
                            email={inputEmail}
                            onChange={(e) => {
                                setInputEmail(e.target.value);
                            }}
                        />
                        <input
                            className="login-input"
                            type="password"
                            name="password"
                            placeholder="Password"
                            password={inputPassword}
                            onChange={(e) => {
                                setInputPassword(e.target.value);
                            }}
                        />
                    </div>
                    <button className="login-button" type="submit">
                        Login
                    </button>
                    <LogInGoogle
                        loggedIn={loggedIn}
                        setLoggedIn={setLoggedIn}
                    />
                </form>
                <form>
                    <h3>Don't have an account? Sign up now</h3>
                    <button
                        className="login-button"
                        onClick={() => navigate("/signup")}
                    >
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
