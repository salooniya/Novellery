const bcrypt = require('bcrypt');
const { User } = require('../models/user.model');
const { Novel, Chapter } = require('../models/novel.model');

// *** index controller

exports.middleware = async (req, res, next) => {
    req.data = {};
    if (req.session) {
        req.data.user = await User.findById(req.session.user);
    }
    next();
};

exports.homePage = {
    get: async (req, res) => {
        res.render('pages/home', req.data);
    }
};

exports.logInPage = {
    get: (req, res) => {
        res.render('pages/log-in', req.data);
    },
    post: async (req, res) => {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                if (user.comparePassword(req.body.password)) {
                    req.session.user = user._id;
                    res.redirect('/');
                } else {
                    res.render('pages/log-in', req.data);
                }
            } else {
                res.render('pages/log-in', req.data);
            }
        } catch (e) {
            console.log(e);
            res.render('pages/log-in', req.data);
        }
    }
};

exports.signUpPage = {
    get: (req, res) => {
        res.render('pages/sign-up', req.data);
    },
    post: async (req, res) => {
        try {
            if (req.body.password === req.body.confirm_password) {
                const user = await User.create({
                    full_name: req.body.full_name,
                    email: req.body.email,
                    password: req.body.password
                });
                req.session.user = user._id;
                res.redirect('/');
            } else {
                res.render('pages/sign-up', req.data);
            }
        } catch (e) {
            console.log(e);
            res.render('pages/sign-up', req.data);
        }
    }
};

exports.logOutPage = {
    get: (req, res) => {
        req.session.destroy();
        res.redirect('/');
    }
};

exports.novelPage = {
    get: async (req, res) => {
        try {
            const novel = await Novel.findById(req.params.novelID);
            const chapters = await Chapter.find({ novelID: novel._id });
            novel.chapters = [...chapters];
            req.data.novel = novel;
            res.render('pages/novel', req.data);
        } catch (e) {
            console.log(e);
            res.render('pages/novel', req.data);
        }

    }
};

exports.createNovelPage = {
    get: (req, res) => {
        res.render('pages/create-novel', req.data);
    },
    post: async (req, res) => {
        try {
            req.body.agree = req.body.agree === 'on';
            req.body.mature = req.body.mature === 'on';
            req.body.userID = req.data.user._id;
            const { cover_image } = req.files;
            const name = Date.now();
            cover_image.mv('./public/novels/' + name);
            req.body.cover_image = name;
            const novel = await Novel.create(req.body);
            res.redirect(`/novels/${novel._id}/chapters/create`);
        } catch (e) {
            console.log(e);
            res.render('pages/create-novel', req.data);
        }
    }
};

exports.createChapterPage = {
    get: (req, res) => {
        req.data.novelID = req.params.novelID;
        res.render('pages/create-chapter', req.data);
    },
    post: async (req, res) => {
        try {
            req.data.novelID = req.params.novelID;
            req.body.novelID = req.data.novelID;
            await Chapter.create(req.body);
            res.redirect(`/novels/${req.params.novelID}`);
        } catch (e) {
            console.log(e);
            res.render('pages/create-chapter', req.data);
        }
    }
};
