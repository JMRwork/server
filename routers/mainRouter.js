const express = require('express');
const router = express.Router();
const { getHome, getGame, getAbout, getLogin, getRegister } = require('../controllers/main');
const { login, logout } = require('../controllers/mainAuth');
const register = require('../controllers/register');
const { getInventory, updateInventory, getItems } = require('../controllers/inventory');
const { getLocalActions } = require('../controllers/actions');
const { getStatus } = require('../controllers/status');

// HTML Routes
router.route('/').get(getHome);
router.route('/home').get(getHome);
router.route('/game').get(getGame);
router.route('/about').get(getAbout);
router.route('/login').get(getLogin).post(login);
router.route('/logout').get(logout);
router.route('/register').get(getRegister).post(register);

// API Routes
router.route('/status').get(getStatus);
router.route('/localActions').get(getLocalActions);
router.route('/userInventory').get(getInventory).post(updateInventory);
router.route('/items').get(getItems);

module.exports = router;
