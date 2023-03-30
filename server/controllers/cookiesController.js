const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cookieController = {};
cookieController.setSSIDCookie = async (req, res, next) => {
    // setSSIDcookie creates 2 cookies: setSSID cooking and login cookie
    const { id } = res.locals;
    //res.cookie creates a cookie

    // ssid cookie
    await res.cookie("user_id", `${id}`);
    // res.locals.id = id;
    console.log(" SetSSIDCOOKIE", res.locals.id);

    //loggedIn cookie
    await res.cookie("loggedIn", "true", {
        maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
        sameSite: "strict",
        path: "/",
        domain: "localhost",
    });
    return next();
};

module.exports = cookieController;
