const ajax = require('./respond');

module.exports.isUser = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return ajax.error(res, "This api can only be accessed by signed in users!");
    }
}

module.exports.isSignedOut = (req, res, next) => {
    if (!req.user) {
        next();
    } else {
        res.redirect('/');
        return;
    }
}

module.exports.isAdmin = (req, res, next) => {
    if (!req.user) {
        return ajax.error(res, "This api can only be accessed by signed in admins!");
    }
    
    if (req.user.isAdmin) {
        next();
    } else {
        return ajax.error(res, "This api can only be accessed by admins!");
    }
}

module.exports.isPlanner = (req, res, next) => {
    if (!req.user) {
        return ajax.error(res, "This api can only be accessed by signed in planners!");
    }
    
    if (req.user.isPlanner || req.user.isAdmin) {
        next();
    } else {
        return ajax.error(res, "This api can only be accessed by planners!");
    }
}

module.exports.isHelper = (req, res, next) => {
    if (!req.user) {
        return ajax.error(res, "This api can only be accessed by signed in helpers!");
    }
    
    if (req.user.isHelper || req.user.isPlanner || req.user.isAdmin) {
        next();
    } else {
        return ajax.error(res, "This api can only be accessed by helpers!");
    }
}