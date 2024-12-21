function findUserStatus() {
    return {
        currency: 10,
        inventory: 0,
        location: 0,
        missionStatus: [{ missionId: 0, missionStep: 0 }, { missionId: 1, missionStep: 1 }],
        researchStatus: [{ researchId: 0, researchStep: 0 }]
    };
}

function findUserCurrency() {
    return 10;
}

module.exports = {
    findUserStatus,
    findUserCurrency
};
