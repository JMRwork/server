/* eslint-disable indent */
const db = require('../config/db.js');

async function findUserStatus(userId) {
    try {
        const result = await db.query('SELECT * FROM users_status WHERE user_id = $1', [userId]);
        let response;
        switch (result.rowCount) {
            case 0:
                response = { error: 'User status not Found.' };
                break;
            default:
                response = result.rows[0];
        }
        return response;
    } catch (e) {
        console.error('Error getting user status:', e);
        const response = { error: 'Internal Server Error.' };
        return response;
    }
}

async function findUserLocation(userId) {
    try {
        const result = await db.query('SELECT location FROM users_status WHERE user_id = $1', [userId]);
        let response;
        switch (result.rowCount) {
            case 0:
                response = { error: 'User location not Found.' };
                break;
            default:
                response = result.rows[0];
        }
        return response;
    } catch (e) {
        console.error('Error getting user currency:', e);
        const response = { error: 'Internal Server Error.' };
        return response;
    }
}

async function findUserInventoryCap(userId) {
    try {
        const result = await db.query('SELECT inventory_cap FROM users_status WHERE user_id = $1', [userId]);
        let response;
        switch (result.rowCount) {
            case 0:
                response = { error: 'User inventory capacity not Found.' };
                break;
            default:
                response = result.rows[0];
        }
        console.log(response);
        return response;
    } catch (e) {
        console.error('Error getting user currency:', e);
        const response = { error: 'Internal Server Error.' };
        return response;
    }
}

async function findUserCountedItems(userId) {
    try {
        const result = await db.query('SELECT COUNT(*) FROM users_items WHERE user_id = $1', [userId]);
        console.log(result);
        return result.rows[0];
    } catch (e) {
        console.error('Error getting user item capacity status:', e);
        const response = { error: 'Internal Server Error.' };
        return response;
    }
}

async function findUserCurrency(userId) {
    try {
        const result = await db.query('SELECT currency FROM users_status WHERE user_id = $1', [userId]);
        let response;
        switch (result.rowCount) {
            case 0:
                response = { error: 'User currency not Found.' };
                break;
            default:
                response = result.rows[0];
        }
        return response;
    } catch (e) {
        console.error('Error getting user currency:', e);
        const response = { error: 'Internal Server Error.' };
        return response;
    }
}

async function findAllUserMissionStatus(userId) {
    try {
        const result = await db.query('SELECT * FROM users_missions WHERE user_id = $1', [userId]);
        let response;
        switch (result.rowCount) {
            case 0:
                response = { error: 'User don\'t have an active mission.' };
                break;
            default:
                response = result.rows;
        }
        return response;
    } catch (e) {
        console.error('Error getting user all mission status:', e);
        const response = { error: 'Internal Server Error.' };
        return response;
    }
}

async function findAllUserResearchStatus(userId) {
    try {
        const result = await db.query('SELECT * FROM users_researchs WHERE user_id = $1', [userId]);
        let response;
        switch (result.rowCount) {
            case 0:
                response = { error: 'User don\'t have any research.' };
                break;
            default:
                response = result.rows;
        }
        return response;
    } catch (e) {
        console.error('Error getting user all research status:', e);
        const response = { error: 'Internal Server Error.' };
        return response;
    }
}

module.exports = {
    findUserStatus,
    findUserLocation,
    findUserInventoryCap,
    findUserCountedItems,
    findUserCurrency,
    findAllUserMissionStatus,
    findAllUserResearchStatus
};
