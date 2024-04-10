const express = require('express');
const router = express.Router();
const { getHome, getGame, getAbout, getLogin, getRegister } = require('../controllers/main');
const { getActions, getMap, getInventory, getResearch, getMissions, logout } = require('../controllers/mainAuth');
const login = require('../controllers/authorization');
const register = require('../controllers/register');
const { getUserInventory, updateUserInventory, getItems } = require('../controllers/inventory');
const { getLocalActions } = require('../controllers/actions');

// HTML Routes
router.route('/').get(getHome);
router.route('/home').get(getHome);
router.route('/game').get(getGame);
router.route('/about').get(getAbout);
router.route('/login').get(getLogin).post(login);
router.route('/logout').get(logout);
router.route('/register').get(getRegister).post(register);

router.route('/actions').get(getActions);
router.route('/map').get(getMap);
router.route('/inventory').get(getInventory);
router.route('/research').get(getResearch);
router.route('/missions').get(getMissions);

// API Routes
router.route('/localActions').get(getLocalActions);
router.route('/userInventory').get(getUserInventory).post(updateUserInventory);
router.route('/items').get(getItems);

module.exports = router;
