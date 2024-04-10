const getLocalActions = async (req, res) => {
    try {
        res.status(200).json([
            {
                action: 'getWood',
                value: 1,
                textContent: 'Get Wood'
            },
            {
                action: 'getFood',
                value: 2,
                textContent: 'Farm food'
            },
            {
                action: 'getWater',
                value: 5,
                textContent: 'Get Water'
            }]);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error.'
        });
    }
};

module.exports = {
    getLocalActions
};
