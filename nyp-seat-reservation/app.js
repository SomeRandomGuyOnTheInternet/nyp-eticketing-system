// TODO: Complete documentation (app.js & DBConnection.js)
// TODO: Find another solution client-side templating cause right now, it's possible to inject bad code inside the templates and have javascript execute them
// TODO: Use camelcase for html ids
// TODO: Update console.log to morgan

const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session');
const methodOverride = require('method-override');
const passport = require('passport');


// Importing all the routes 
// We split the webpages by routes for clarity and security purposes
// So each route is in charge of a chunk of webpages that are connected logically (eg: all planner functions are handled under the planner route, which is located in planner.js)
// This'll make it easier to maintain the webpages
const mainRoute = require('./routes/main');
const helperRoute = require('./routes/helper');
const plannerRoute = require('./routes/planner');
const adminRoute = require('./routes/admin');
const authenticate = require('./config/passport');

// Our app is a blank canvas at this point (wow so artistic)
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('trust proxy', 1);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(cookieParser());
app.use(logger('dev'));
app.use(flash());

const fypjapplication = require('./config/DBConnection');
const db = require('./config/db');
fypjapplication.setUpDB(true);

app.use(session({
	key: 'nyp-seat-reservation',
	secret: 'totallysecretpassword',
	store: new MySQLStore({
		host: db.host,
		port: db.port,
		user: db.username,
		password: db.password,
		database: db.database,
		clearExpired: true,
		checkExpirationInterval: 900000,
		expiration: 900000,
	}),
	resave: false,
	saveUninitialized: false,
}));

app.use((req, res, next) => {
    res.locals.message = req.flash('message');
	next();
});

app.use(passport.initialize());
app.use(passport.session());

authenticate.localStrategy(passport);

// Over here, we tell the app what url prefix to use for each of the route's webpages
// So if we say app.use('/helper', helper.js), every webpage's url in helper.js will begin with 'helper/'
// Eg: localhost:5000/helper/events
// Just make sure that your route file ends with module.exports = router; otherwise it will crash
app.use('/', mainRoute);
app.use('/helper', helperRoute);
app.use('/planner', plannerRoute);
app.use('/admin', adminRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => { });