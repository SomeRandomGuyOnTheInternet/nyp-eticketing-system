const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const MySQLStore = require('express-mysql-session');
const methodOverride = require('method-override');

const mainRoute = require('./routes/main');
const plannerRoute = require('./routes/planner');

const app = express();

// TODO: Complete documentation (app.js & DBConnection.js)

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

// app.use(session({
// 	key: 'nyp-seat-reservation',
// 	secret: 'totallysecretpassword',
// 	store: new MySQLStore({
// 		host: db.host,
// 		port: db.port,
// 		user: db.username,
// 		password: db.password,
// 		database: db.database,
// 		clearExpired: true,
// 		checkExpirationInterval: 900000,
// 		expiration: 900000,
// 	}),
// 	resave: false,
// 	saveUninitialized: false,
// }));

// app.use((req, res, next) => {
// 	res.locals.currentUser = req.user;
// 	res.locals.error = req.flash('error');
// 	res.locals.success = req.flash('success');
// 	next();
// });

const fypjapplication = require('./config/DBConnection');
fypjapplication.setUpDB(false);

app.use('/', mainRoute);
app.use('/planner', plannerRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => { });