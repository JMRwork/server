const { findUserByUsername, createUser } = require('../repository/users');

async function registerService(username, password) {
    const hasUserResponse = await findUserByUsername(username);
    if (hasUserResponse.sucessful === true) {
        return { message: 'Username already exists.' };
    } else {
        const createResponse = await createUser(username, password);
        return { message: createResponse.message };
    }
};

module.exports = { registerService };
