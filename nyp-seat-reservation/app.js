const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const createError = require('http-errors');
const logger = require('morgan');
const flash = require('connect-flash');
// const MySQLStore = require('express-mysql-session');
const methodOverride = require('method-override');
const mainRoute = require('./routes/main');


const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

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

app.set('trust proxy', 1);

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	// res.locals.error = req.flash('error');
	// res.locals.success = req.flash('success');
	next();
});

// app.use(session({
// 	key: 'nyp-seat-reservation',
// 	secret: 'totallysecretpassword',
// 	store: new MySQLStore({
// 		host: db.host,
// 		port: 3306,
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

app.use('/', mainRoute);

const port = process.env.PORT || 5000;
app.listen(port, () => { });