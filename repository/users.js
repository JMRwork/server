/* eslint-disable indent */
const db = require('../config/db'); // Assuming you have a db module to handle database connections

async function getAllUsers() {
    try {
        const query = 'SELECT * FROM users';
        const result = await db.query(query);
        return result.rows;
    } catch (error) {
        console.error('Error getting all users:', error);
        throw new Error('Could not retrieve users');
    }
}

async function findUserByUsername(username) {
    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        let response;
        console.log(result.rowCount);
        switch (result.rowCount) {
            case 1:
                response = { sucessful: true, error: null, user: result.rows[0] };
                break;
            default:
                response = { sucessful: false, error: 'Credentials not correct.' };
                break;
        }
        console.log(response);
        return response;
    } catch (error) {
        console.error(`Error getting user by username ${username}:`, error);
        return { sucessful: false, error: 'Internal Server Error' };
    }
}

async function createUser(username, password) {
    const client = await db.connect();
    let response;
    try {
        await client.query('BEGIN');
        const resultUserCreate = await client.query('INSERT INTO users(username, password) VALUES ($1, $2) RETURNING id', [username, password]);
        await client.query('INSERT INTO users_status (user_id) VALUES ($1)', [resultUserCreate.rows[0].id]);
        await client.query('COMMIT');
        response = { message: 'User created successfully' };
    } catch (error) {
        console.error('Error creating user:', error);
        await client.query('ROLLBACK');
        response = { message: 'Internal Server Error' };
    } finally {
        await client.release();
        console.log(response);
        // eslint-disable-next-line no-unsafe-finally
        return response;
    }
}

async function updateUser(id, user) {
    try {
        const query = 'UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *';
        const values = [user.name, user.email, user.password, id];
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error(`Error updating user with id ${id}:`, error);
        throw new Error('Could not update user');
    }
}

async function deleteUser(id) {
    try {
        const query = 'DELETE FROM users WHERE id = $1';
        await db.query(query, [id]);
        return { message: 'User deleted successfully' };
    } catch (error) {
        console.error(`Error deleting user with id ${id}:`, error);
        throw new Error('Could not delete user');
    }
}

module.exports = {
    getAllUsers,
    findUserByUsername,
    createUser,
    updateUser,
    deleteUser
};
