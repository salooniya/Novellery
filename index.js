require('dotenv').config();
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');
const fileUpload = require('express-fileupload');
const MongoStore = require('connect-mongo');
const controller = require('./controllers/index.controller');

// *** express app

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('layout', './layouts/base.ejs');

app.use(morgan('dev'));
app.use('/public', express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(expressLayouts);
app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_KEY,
    cookie: {
        secure: false,
        sameSite: true,
        maxAge: Number(process.env.SESSION_TTL) * 1000
    },
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI,
        ttl: Number(process.env.SESSION_TTL)
    })
}));

app.use(fileUpload());

// *** app routes

app
    .use(controller.middleware);

app
    .route('/')
    .get(controller.homePage.get);

app
    .route('/log-in')
    .get(controller.logInPage.get)
    .post(controller.logInPage.post);

app
    .route('/sign-up')
    .get(controller.signUpPage.get)
    .post(controller.signUpPage.post);

app
    .route('/log-out')
    .get(controller.logOutPage.get);

app
    .route('/novels/create')
    .get(controller.createNovelPage.get)
    .post(controller.createNovelPage.post);

app
    .route('/novels/:novelID')
    .get(controller.novelPage.get);

app
    .route('/novels/:novelID/chapters/create')
    .get(controller.createChapterPage.get)
    .post(controller.createChapterPage.post);

// *** app start

const start = async () => {
    await mongoose.connect(process.env.DB_URI);
    console.log('Database connection successful');
    app.listen(process.env.PORT, () => {
        console.log('Server is running at port', port);
    });
};

start().catch(console.error);
