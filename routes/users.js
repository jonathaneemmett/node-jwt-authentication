const {Router} = require('express');
const config = require('config');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Model
const User = require('../models/User');

const router = Router();

/**
 * @route   POST api/users
 * @desc    Register a new user
 * @access  Public
 */
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        let user = await User.findOne({ email: email });
        if(user){
            return res.status(400).json({ msg: `That email is already in use.` });
        }

        user = new User({
            name,
            email,
            password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        // JWT Build
        const payload = {
            user: {
                id: user._id
            }
        }

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            {
                expiresIn: 360000,
            },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        )

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error.');
    }
})

module.exports = router;