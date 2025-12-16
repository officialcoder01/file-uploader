const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const query = require('../queries/user');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const createUser = [
    body('name').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Passwords do not match');
        }
        return true;
    }),

    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const msgs = errors.array().map(e => e.msg).join(' ');
            req.flash('error', msgs);
            return res.redirect('/signup');
        }
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            await query.createUser({ name, email, password: hashedPassword });
            req.flash('success', 'Account created successfully. Please log in.');
            return res.redirect('/login');
        } catch (error) {
            console.error('Error creating user:', error);
            req.flash('error', 'Error creating user');
            return res.redirect('/signup');
        }
    }
]

const loginUser = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const msgs = errors.array().map(e => e.msg).join(' ');
            req.flash('error', msgs);
            return res.redirect('/login');
        }
        next();
    }
]

passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
            const user = await query.getUserByEmail(email);
            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await query.getUserById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = {
    createUser,
    loginUser,
};