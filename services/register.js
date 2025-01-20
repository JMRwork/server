const { findUserByUsername, createUser } = require('../repository/users');

async function registerService(username, password) {
    const hasUserResponse = await findUserByUsername(username);
    if (hasUserResponse.message) {
        const createResponse = await createUser(username, password);
        return { message: createResponse.message };
    } else {
        return { message: 'Username already exists.' };
    }
};

module.exports = { registerService };
