import React from "react";
import { GoogleLogin } from "react-google-login";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const clientId =
    "88560141638-64a3h5d4jq9ddjhq00h6m8n5unss8g04.apps.googleusercontent.com";
const LogInGoogle = ({ setLoggedIn }) => {
    const [googleInfo, setGoogleInfo] = useState({});
    const navigate = useNavigate();
    const onSuccess = (res) => {
        // console.log("LOGIN SUCCESS! Current user: ", res.profileObj);
        setGoogleInfo(res.profileObj);
        axios
            .post(
                "http://localhost:5001/users/googleAccountHandler",
                res.profileObj,
                { withCredentials: true }
            )
            .then((response) => {
                console.log(response.data);
                setLoggedIn(true);
                navigate("/");
            })
            .catch((e) => console.log(e));
        // console.log(res.profileObj);
    };

    const onFailure = (res) => {
        console.log("LOGIN FAILED! res: ", res);
    };

    return (
        <div>
            <GoogleLogin
                clientId={clientId}
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={"single_host_origin"}
                // isSignedIn={true}
            />
        </div>
    );
};

export default LogInGoogle;
