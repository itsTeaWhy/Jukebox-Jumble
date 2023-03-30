const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const cookiesController = require('../controllers/cookiesController');

router.post(
  '/createusers',
  userController.createUser,
  cookiesController.setSSIDCookie,
  (req, res) => {
    res.status(200).send('User Created');
  }
);

router.post(
  '/login',
  userController.verifyUser,
  cookiesController.setSSIDCookie,
  (req, res) => {
    res.status(200).json({
      id: res.locals.id,
      verified: res.locals.verified,
    });
  }
);

router.post(
  '/googleAccountHandler',
  userController.googleAccount,
  (req, res) => {
    res.status(200).json(res.locals.status);
  }
);

router.get('/getscore/:id', userController.getScore, (req, res) => {
  res.status(200).json(res.locals.score);
});

router.post('/updatescore', userController.updateScore, (req, res) => {
  res.status(200).json('score updated');
});
router.get('/gethighscore', userController.getAllUsers, (req, res) => {
  res.status(200).json(res.locals.users);
});

module.exports = router;
