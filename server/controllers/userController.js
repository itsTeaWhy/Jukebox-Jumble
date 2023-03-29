const User = require("../models/userModel");
const googleUser = require("../models/googleUserModel");
const mongoose = require("mongoose");
const userController = {};
const cookieParser = require("cookie-parser");

userController.createUser = async (req, res, next) => {
    console.log("in createuser controller");
    const { name, email, password } = req.body;
    try {
        if (name && password && email) {
            const newUser = await User.create({ name, email, password });
            res.locals.id = await User.findOne({ email: email }, { _id: 1 });
            console.log(res.locals.id);
            return next();
        } else {
            throw new Error("Missing name, email, or password");
        }
    } catch (err) {
        next({
            log: "Express error handler caught createUser middleware error",
            status: 400,
            message: { err: err.message },
        });
    }
};

userController.verifyUser = async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.locals.error = "Incorrect email";
        return next();
    }

    if (password === user.password) {
        console.log("id in verifyUser", user._id);
        res.locals.id = user._id;
        res.locals.verified = true;
        return next();
    } else {
        res.locals.error = "Incorrect password";
        res.locals.verified = false;
        return next();
    }
};

userController.googleAccount = async (req, res, next) => {
    try {
        const { email, familyName, givenName, googleId, imageUrl, name } =
            req.body;
        const user = await googleUser.findOne({ googleId: googleId });

        if (!user) {
            const newGoogleUser = new googleUser({
                name: givenName,
                email: email,
                googleId: googleId,
            });
            await newGoogleUser.save();
            await res.cookie("user_id", googleId);
            res.locals.status = newGoogleUser;
            return next();
        } else {
            await res.cookie("user_id", user.googleId);
            res.locals.status = user;
            return next();
        }
    } catch (e) {
        return next(e);
    }
};

userController.getScore = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await googleUser.findOne({ googleId: id });
        if (!user) {
            res.locals.score = await User.findOne(
                { _id: id },
                { _id: 1, highscore: 1, name: 1 }
            );
            return next();
        } else {
            res.locals.score = {
                _id: id,
                highscore: user.highscore,
                name: user.name,
            };
            return next();
        }
    } catch (e) {
        return next(e);
    }
};

userController.updateScore = async (req, res, next) => {
    try {
        const { id, newScore } = req.body;
        const user = await googleUser.findOne({ googleId: id });
        if (!user) {
            const localUser = await User.findOne({ _id: id });
            localUser.highscore = newScore;
            await localUser.save();
            res.locals.score_updated = "success";
            return next();
        } else {
            user.highscore = newScore;
            await user.save();
            res.locals.score_updated = "success";
            return next();
        }
    } catch (e) {
        return next(e);
    }
};
module.exports = userController;
