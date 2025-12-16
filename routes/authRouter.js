const { Router } = require('express');
const authController = require('../controllers/authController');
const passport = require('passport');
const router = Router();


router.get('/', async (req, res) => {
    res.render('home', { user: req.user });
});

router.get('/signup', (req, res) => {
    res.render('signup', { user: req.user });
});
router.post('/signup', authController.createUser);

router.get('/login', (req, res) => {
    res.render('login', { user: req.user });
});
router.post('/login',
    authController.loginUser,
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true,
        successFlash: 'Successfully signed in.'
    })
);

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        
        res.redirect('/')
    });
});

module.exports = router;