const { findUserByUsername } = require('../repository/users');

async function loginService(username, password) {
    console.log(username);
    const response = await findUserByUsername(username);
    console.log(response);
    if (response.successful === false) {
        return { message: response.error };
    }
    console.log('aqui');
    const user = response.user;
    console.log(user);
    if (user.password === password) {
        return { user };
    } else {
        return { message: 'Credentials not correct.' };
    }
};

module.exports = {
    loginService
};
