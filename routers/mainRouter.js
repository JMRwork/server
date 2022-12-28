const express = require('express')
const router = express.Router()
const { getHome, getGame, getAbout, getLogin, getRegister, login, logout, register } = require('../controllers/main')

router.route('/').get(getHome)
router.route('/home').get(getHome)
router.route('/game').get(getGame)
router.route('/about').get(getAbout)
router.route('/login').get(getLogin).post(login)
router.route('/logout').get(logout)
router.route('/register').get(getRegister).post(register)

module.exports = router