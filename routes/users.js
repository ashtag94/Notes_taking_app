var express = require('express');
var router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');


//User model
const User = require('../models/User');

//Login Page
router.get('/login',function(req,res){
    res.render('login');
})

//Registration Page
router.get('/register',function(req,res){
    res.render('register');
})

//Register Handle
router.post('/register',function(req,res){
    const {name, email, password, password2} = req.body;
    let errors = [];

    //check required fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'Please fill all fields'});
    }

    //check passwords match
    if(password !== password2){
        errors.push({msg : 'Passwords do not match'});
    }

    //check password length
    if(password.length < 6){
        errors.push({msg : 'Password should be at least 6 characters'});
    }
    
    if(errors.length > 0){
        res.render('register',{
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        //Validation passed
        User.findOne({email: email})
            .then(user => {
                if(user){
                    //user exist already
                    errors.push({msg: 'Email is already in use'});
                    res.render('register',{
                        errors,
                        name,
                        email,
                        password,
                        password2
                    });
                }
                else {
                    const newUser = new User({
                        name,
                        email,
                        password
                    });
                    
                    //Hash password
                    bcrypt.genSalt(10, (err,salt) => {
                        bcrypt.hash(newUser.password,salt, (err,hash) => {
                            if (err) throw err;
                            //Set password to hash
                            newUser.password = hash;
                            
                            //Save User
                            newUser.save()
                            .then(user => {
                                req.flash('success_msg','You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch();
                        });
                    });

                    
                }
            });

    }
});

//Login handle
router.post('/login',(req,res,next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
});

//Logout handle
router.get('/logout',(req,res) => {
    req.logout();
    req.flash('success_msg','You are logged out');
    res.redirect('/users/login');
});

module.exports = router;