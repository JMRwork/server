const verifySession = (req, res, next) => {
    if (!(req.session.id && req.session.username)) {
        res.clearCookie('u_on');
    }
    next();
};

module.exports = {
    verifySession
};
