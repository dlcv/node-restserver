const jwt = require('jsonwebtoken');

let verify = (req, res, next) => {
    let token = req.get('token');
    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.user = decoded.user;
    });
    next();
};

let verifyAdmin = (req, res, next) => {
    let role = req.user.role;
    if (role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: "El usuario no tiene los privilegios para realizar esta acción"
        });
    }
    next();
};

let verifyTokenImage = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.TOKEN_SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.user = decoded.user;
    });
    next();
}

module.exports = {
    verify,
    verifyAdmin,
    verifyTokenImage
}