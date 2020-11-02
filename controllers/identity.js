

var Identity = require("../models/user");
var crypto = require('crypto');


module.exports.showLoginForm = function(req,res){
    res.render('login.ejs', {
        password_error: false,
        email_not_exist: false
    });

};

module.exports.showSignUpForm = function(req,res){
    res.render('signUp.ejs',{
        alreadySignUp: false
    });
};


module.exports.showResetForm = function(req,res){
    res.render('resetPassword.ejs',{
        findOutUser: false
    });
};

module.exports.logOut = function(req,res){
    req.session.destroy();
    res.redirect('/')
};


//Reset your password
module.exports.submitNewPassword = function(req,res){
    // var email = req.session.detectUser;

    crypto.pbkdf2(req.body.password, 'salt', 100000, 64,
        'sha512', (err, derivedKey) => {
        if (err) throw err;
            var currentEmail = req.session.detectEmail ;
            var newPassword = derivedKey ;
            console.log(currentEmail);
            console.log(newPassword);
            Identity.update({email: {$eq:currentEmail }},{$set: {password: newPassword}}, function (err,result) {
                if(err) {
                    console.log(err);
                    return res.status(500).send();
                }else if(result){
                    res.redirect('/')
                }
            });
    });
};




//Change user's password
module.exports.changePassword = function(req,res){
    var currentUser = {
        email: req.body.email,
        resetquestion: req.body.answer,
    };

    Identity.findOne(currentUser, function (err,result) {
        if(err){
            console.log(err);
            return res.status(500).send();
        }else if(!result){
            console.log("You need to regist again")
            res.redirect("/signUp");
        }else{
            req.session.detectUser = result.firstname + ' ' + result.lastname;
            req.session.detectEmail = result.email;
            res.locals.detectUser = req.session.detectUser;
            res.render('resetPassword.ejs',{findOutUser : true});
            // console.log(req.session.detectUser);
        }
    });
};




// User login inforamtion  justification
module.exports.submitLoginForm = function(req, res) {
    //encrypted the password
    crypto.pbkdf2(req.body.password, 'salt', 100000, 64,
        'sha512', (err, derivedKey) => {
            if (err) throw err;
            //Save into the customer tag
            var currentUser = {
                email: req.body.email,
                password: derivedKey,
            };
            Identity.findOne(currentUser,function (err,result) {
                console.log(result);
                if(err){
                    console.log(err);
                    return res.status(500).send();
                }
                if (!result){
                    //if we can find that user but the password is wrong......
                    var testEmail = req.body.email;
                     Identity.findOne({email: {$eq:testEmail }}, {password:1},function (err1,result1) {
                         if(result1){
                             console.log("Existed account, incorrect Password");
                             res.render("login.ejs",{password_error: true, email_not_exist:false});


                         }else{
                             console.log("Please register at first");
                             res.render("login.ejs",{password_error: false, email_not_exist:true});
                         }
                     });
                }else{
                    req.session.username = result.firstname + ' ' + result.lastname;
                    console.log(req.session);
                    res.redirect("/main");
                }
            });
        });
};


module.exports.submitRegisterForm = async (req, res) => {
    console.log(req.body.answer);
    try{
        crypto.pbkdf2(req.body.password, 'salt', 100000, 64,
            'sha512', (err, derivedKey) => {

                if (err) throw err;

                //Check whether the database already have this user, if success then prevent him to login, if not, then let him login
                var testEmail = req.body.email;

                console.log(testEmail);
                Identity.findOne({email: {$eq:testEmail }}, {resetquestion:1},function (err2,result2) {
                    if(err2){
                        console.log(err);
                        return res.status(500).send();
                    }

                    console.log(result2);
                    if(result2){
                        console.log("Existed account, already registered");
                        res.render('signUp.ejs',{alreadySignUp : true});
                    }else{
                        //Find one:
                        var customer = new Identity({
                            firstname: req.body.firstName,
                            lastname: req.body.lastName,
                            password: derivedKey,
                            email: req.body.email,
                            resetquestion: req.body.answer
                        });
                        console.log("Passed");
                        customer.save();
                        console.log('password has been encrypted: ' +customer);
                        res.redirect('/');
                    }
                });
            });
    }catch (e) {
        res.redirect('/signUp');
    }
};