const path = require('path')
const file = path.join(__dirname, '../public/engineCSS.html')

const getHome = async (req, res) => {
    res.status(200).sendFile(file)
}

const getGame = async (req, res) => {
    res.status(200).sendFile(file)
}

const getAbout = async (req, res) => {
    res.status(200).sendFile(file)
}

const getLogin = async (req, res) => {
    res.status(200).sendFile(file)
}

const getRegister = async (req, res) => {
    res.status(200).sendFile(file)
}

const login = async (req, res) => {
    const { username, password } = req.body
    console.log(username, password)
    console.log(req.body.username)
    res.status(200).sendFile(file)
}

const logout = async (req, res) => {
    res.status(200).sendFile(file)
}

const register = async (req, res) => {
    res.status(200).sendFile(file)
}

module.exports = {
    getHome,
    getGame,
    getAbout,
    getLogin,
    getRegister,
    login,
    logout,
    register
}