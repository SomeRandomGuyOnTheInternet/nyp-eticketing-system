const flash = require('./flash');

module.exports.isUser = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        flash.error(req, "Please sign in to access that page!");
        res.redirect('/');
        return;
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
        flash.error(req, "Please sign in to access that page!");
        res.redirect('/login');
        return;
    }
    
    if (req.user.isAdmin) {
        next();
    } else {
        res.redirect('/');
        return;
    }
}

module.exports.isPlanner = (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    
    if (req.user.isPlanner) {
        next();
    } else {
        flash.error(req, "You do not have authentication to view that page!");
        res.redirect('/');
        return;
    }
}

module.exports.isHelper = (req, res, next) => {
    if (!req.user) {
        res.redirect('/login');
        return;
    }
    
    if (req.user.isHelper) {
        next();
    } else {
        flash.error(req, "You do not have authentication to view that page!");
        res.redirect('/');
        return;
    }
}