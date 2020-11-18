// TODO: Complete documentation (app.js & DBConnection.js)
// TODO: Use camelcase for html ids
// TODO: Update console.log to morgan
// TODO: Create 404 page
// TODO: minify the hosted version
// TODO: use json web tokens to make api more secure

const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session');
const methodOverride = require('method-override');
require('dotenv').config();

// Importing all the routes 
// We split the webpages by routes for clarity and security purposes
// So each route is in charge of a chunk of webpages that are connected logically (eg: all planner functions are handled under the planner route, which is located in planner.js)
// This'll make it easier to maintain the webpages
const mainRoute = require('./routes/page-load/main');
const helperRoute = require('./routes/page-load/helper');
const plannerRoute = require('./routes/page-load/planner');
const adminRoute = require('./routes/page-load/admin');

const apiRoute = require('./routes/api/index');
const helperApiRoute = require('./routes/api/helper');
const plannerApiRoute = require('./routes/api/planner');
const adminApiRoute = require('./routes/api/admin');
const notificationApiRoute = require('./routes/api/notification');

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
app.locals.moment = require('moment');

const fypjapplication = require('./config/DBConnection');
fypjapplication.setUpDB(false);

app.use(session({
	key: 'nyp-seat-reservation',
	secret: 'totallysecretpassword',
	store: new MySQLStore({
		host: process.env.DB_HOST,
		port: undefined,
		user: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
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

const authenticate = require('./config/passport');
authenticate.localStrategy(passport);

// Over here, we tell the app what url prefix to use for each of the route's webpages
// So if we say app.use('/helper', helper.js), every webpage's url in helper.js will begin with 'helper/'
// Eg: localhost:5000/helper/events
// Just make sure that your route file ends with module.exports = router; otherwise it will crash
app.use('/', mainRoute);
app.use('/helper', helperRoute);
app.use('/planner', plannerRoute);
app.use('/admin', adminRoute);
app.use('/api', apiRoute);
app.use('/api/admin', adminApiRoute);
app.use('/api/planner', plannerApiRoute);
app.use('/api/helper', helperApiRoute);
app.use('/api/notification', notificationApiRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => { });