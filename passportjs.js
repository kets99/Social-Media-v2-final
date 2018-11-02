var session = require('express-session');
var passport = require('passport');
var path = require('path');
var LocalStrategy = require('passport-local').Strategy;
var queries = require(path.join(__dirname,'model/queries'));

module.exports=(app)=>{
    
    //passport stuff-----------------------
    app.use(session({secret:'Anything',saveUninitialized:true,resave:true}));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user,done)=>{
        done(null,user.useremail)
    });

    passport.deserializeUser(function(useremail,done){
        queries.getUser(useremail,(err,user)=>{
            if(err)
                console.log(err);
            else{
                done(null,user)
            }
        });
    });

    passport.use(new LocalStrategy({
        usernameField: 'useremail',
        passwordField: 'password'
        },
        (useremail, password, done)=>{
            console.log('checkinguser');
            queries.checkUser({useremail,password},(err,user)=>{
                if(err)
                    done(null,false);
                else
                    done(null,user);
            });
        }
    ));
    //passport ends ------------------------------------
}


