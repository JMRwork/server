const { getLocationService } = require('./status');
const { getActions, findLocalActions } = require('../repository/actions');

async function getLocalActionsService(userId) {
    const location = await getLocationService(userId);
    if (location.message) {
        return { message: location.message };
    }
    // Still only gathering actions for now
    const localActionsResponse = await findLocalActions(location);
    if (localActionsResponse.error) {
        return { message: localActionsResponse.error };
    }
    const ActionsResponse = await getActions();
    if (ActionsResponse.error) {
        return { message: ActionsResponse.error };
    }

    const actions = ActionsResponse.map(action => {
        for (let i = 0; i < localActionsResponse.length; i++) {
            if (action.action_id === localActionsResponse[i].action_id) {
                return action;
            } else {
                continue;
            }
        }
        return null;
    });

    console.log(actions);

    const response = {
        localActions: localActionsResponse,
        actions
    };
    return response;
};

module.exports = {
    getLocalActionsService
};
