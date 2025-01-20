const {
    findUserStatus,
    findUserLocation,
    findUserInventoryCap,
    findUserCountedItems,
    findUserCurrency,
    findAllUserMissionStatus,
    findAllUserResearchStatus
} = require('../repository/status');

async function getStatusService(userId) {
    try {
        const userStatusResponse = await findUserStatus(userId);
        if (userStatusResponse.error) {
            return { message: userStatusResponse.error };
        }
        const userInventoryCapResponse = await getInventoryCapService(userId);
        const userMissionStatusResponse = await findAllUserMissionStatus(userId);
        const userResearchStatusResponse = await findAllUserResearchStatus(userId);
        userStatusResponse.count = userInventoryCapResponse.count;
        userStatusResponse.inventoryCap = userInventoryCapResponse.inventory_cap;
        userStatusResponse.missionStatus = userMissionStatusResponse;
        userStatusResponse.researchStatus = userResearchStatusResponse;
        return userStatusResponse;
    } catch (err) {
        console.log(err);
        return { message: 'Internal Server Error.' };
    }
}

async function getLocationService(userId) {
    try {
        const userLocationResponse = await findUserLocation(userId);
        if (userLocationResponse.error) {
            return { message: userLocationResponse.error };
        }
        return userLocationResponse.location;
    } catch (err) {
        console.log(err);
        return { message: 'Internal Server Error.' };
    }
}

async function getInventoryCapService(userId) {
    try {
        const userItemsCountResponse = await findUserCountedItems(userId);
        const userInventoryCapResponse = await findUserInventoryCap(userId);
        if (userInventoryCapResponse.error) {
            return { message: userInventoryCapResponse.error };
        }
        const response = {};
        response.count = userItemsCountResponse.count;
        response.inventory_cap = userInventoryCapResponse.inventory_cap;
        return response;
    } catch (err) {
        console.log(err);
        return { message: 'Internal Server Error.' };
    }
}

async function getCurrencyService(userId) {
    try {
        const userCurrencyResponse = await findUserCurrency(userId);
        if (userCurrencyResponse.error) {
            return { message: userCurrencyResponse.error };
        }
        return userCurrencyResponse.currency;
    } catch (err) {
        console.log(err);
        return { message: 'Internal Server Error.' };
    }
}

async function getUserMissionStatus(userId) {
    try {
        const userMissionStatusResponse = await findAllUserMissionStatus(userId);
        if (userMissionStatusResponse.error) {
            return { message: userMissionStatusResponse.error };
        }
    } catch (err) {
        console.log(err);
        return { message: 'Internal Server Error.' };
    }
}

async function getUserResearchsStatus(userId) {
    try {
        const userResearchStatusResponse = await findAllUserResearchStatus(userId);
        if (userResearchStatusResponse.error) {
            return { message: userResearchStatusResponse.error };
        }
    } catch (err) {
        console.log(err);
        return { message: 'Internal Server Error.' };
    }
}

module.exports = {
    getStatusService,
    getLocationService,
    getInventoryCapService,
    getCurrencyService,
    getUserMissionStatus,
    getUserResearchsStatus
};
