const express = require('express');
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const {check, validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const config = require('config');
const router = express.Router();

//@route    GET api/auth
//@desc     Test route
//@access   Public
router.get('/', auth, async (req, res) => {
    try{
        const user= await User.findById(req.user.id).select('-password');
        res.json(user);
    }catch(err){
        console.error(err.message);
        return res.status(500).send('Server error');
    }
    res.send('Auth Route');
})

//@route    POST api/auth
//@desc     authenitcate user & return token
//@access   Public
router.post('/', [
    check('email', 'Please enter a valid Email ID').isEmail(),
    check('password', 'Password is required').exists()
], async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({errors: errors.array()})
    }
    const {email, password} = req.body;
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).json({errors: [{msg: 'Invalid credentials'}]})
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        const isMatched = await bcrypt.compare(password, user.password);

        if(!isMatched)
            return res.status(400).json({errors: [{msg: 'Invalid credentials'}]})


        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 360000}, (err, token)=> {
            if(err)
                throw err;
            res.json({token});
        })

    }catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    console.log(req.body);
})
module.exports = router;