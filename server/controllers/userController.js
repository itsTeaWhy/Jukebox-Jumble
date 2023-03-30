const User = require('../models/userModel');
const googleUser = require('../models/googleUserModel');
const mongoose = require('mongoose');
const userController = {};

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const cookieParser = require('cookie-parser');

userController.createUser = async (req, res, next) => {
  //deconstruct body
  const { name, email, password } = req.body;

  //test for invalid input
  if (name.length < 1)
    return next({
      log: 'Invalid name param in userController.createUser middleware function',
      status: 400,
      message: {
        err: ' Invalid name param in userController.createUser middleware function',
      },
    });
  if (!validateEmail(email))
    return next({
      log: 'Invalid email param in userController.createUser middleware function',
      status: 400,
      message: {
        err: ' Invalid email param in userController.createUser middleware function',
      },
    });
  if (password.length < 1)
    return next({
      log: 'Invalid password param in userController.createUser middleware function',
      status: 400,
      message: {
        err: 'Invalid password param in userController.createUser middleware function',
      },
    });

  // MongoDB Create User & Error Handling
  try {
    await User.create({ name, email, password });
    res.locals.success = true;
    return next();
  } catch (err) {
    return next({
      log: 'Express error handler caught createUser middleware error',
      status: 400,
      message: { err: err.message },
    });
  }
};

userController.verifyUser = async (req, res, next) => {
  //deconstruct body
  const { email, password } = req.body;

  //test for invalid input
  if (!validateEmail(email))
    return next({
      log: 'Invalid email param in userController.createUser middleware function',
      status: 400,
      message: {
        err: ' Invalid email param in userController.createUser middleware function',
      },
    });
  if (password.length < 1)
    return next({
      log: 'Invalid password param in userController.createUser middleware function',
      status: 400,
      message: {
        err: 'Invalid password param in userController.createUser middleware function',
      },
    });

  //query database
  const user = await User.findOne({ email, password });

  //handle no user found
  if (!user) {
    return next({
      log: 'Error in userController.verifyUser middleware function no user found in DB',
      status: 400,
      message: {
        err: 'Error in userController.verifyUser middleware function no user found in DB',
      },
    });
  }

  //verification process
  //if match, send through
  if (password === user.password) {
    res.locals.id = user._id;
    res.locals.verified = true;
    return next();
    //if no match return incorrect user/password
  } else {
    return next({
      log: 'Wrong username or password',
      status: 400,
      message: {
        err: 'Wrong username or password',
      },
    });
  }
};

userController.googleAccount = async (req, res, next) => {
  try {
    const { email, familyName, givenName, googleId, imageUrl, name } = req.body;
    const user = await googleUser.findOne({ googleId: googleId });

    if (!user) {
      const newGoogleUser = new googleUser({
        name: givenName,
        email: email,
        googleId: googleId,
      });
      await newGoogleUser.save();
      await res.cookie('user_id', googleId);
      res.locals.status = newGoogleUser;
      return next();
    } else {
      await res.cookie('user_id', user.googleId);
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
      res.locals.score_updated = 'success';
      return next();
    } else {
      user.highscore = newScore;
      await user.save();
      res.locals.score_updated = 'success';
      return next();
    }
  } catch (e) {
    return next(e);
  }
};
userController.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.locals.users = users;
    return next();
  } catch (err) {
    return next({
      log: 'Express error handler caught getAllUsers middleware error',
      status: 400,
      message: { err: err.message },
    });
  }
};
module.exports = userController;
