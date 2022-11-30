const jwt = require('jsonwebtoken');
const _secret='za:efh6ou2ghn874zaf_312z';

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, _secret);
        const userId = decodedToken.userId;
        const admin =decodedToken.admin
        req.auth = {
            "userId": userId,
            "admin": admin
        };
        next();
    } catch(error) {
        res.status(401).json({ error,type:"auth"});
    }
};
