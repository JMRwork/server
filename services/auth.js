const { findUserByUsername } = require('../repository/users');

async function loginService(username, password) {
    const response = await findUserByUsername(username);
    console.log(response);
    if (response.error) {
        return { message: response.error };
    }
    if (response.password === password) {
        return response;
    } else {
        return { message: 'Credentials not correct.' };
    }
};

module.exports = {
    loginService
};
