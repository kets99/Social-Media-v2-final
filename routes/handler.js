var express = require('express');
var router = express.Router();
var path = require('path');
var queries = require(path.join(__dirname,'../model/queries'));
var passport = require('passport');


//Multer config------------------------------------
var multer = require('multer');

var storage = multer.diskStorage({
    destination:'./public/uploads',
    filename: (req,file,callback)=>{
        callback(null,Date.now()+file.originalname);
    }
});
var upload = multer({ storage: storage })
//--------------------------------------------------

//Landing-------------------------------------------
router.get('/',(req,res)=>{
   res.render('landing');
});


//Sign-up------------------------------------------=
router.get('/signup',(req,res)=>{
    console.log(req.user);
    res.render('signup');
});

router.post('/signup',(req,res)=>{
    queries.insertUser(req.body,(err,userid)=>{
        if(err) 
            res.render('signup',{error: err});
        else{
            req.login(req.body,()=>{
                res.redirect('/setprofile');
            });
        }
    });
});

//set profile ---------------------------------------
router.get('/setprofile',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public/html/interests/interest.html'));
});

router.post('/setprofile',upload.single('profilepic'),(req,res)=>{
    console.log('multer',req.file);
    queries.adddp('uploads/'+req.file.filename,req.user.userid);
    res.redirect('/homepage');
});


//Sign-In--------------------------------------------
router.get('/signin',(req,res)=>{
    console.log(req.user);
   res.render('signin'); 
});

router.post('/signin',passport.authenticate('local',{faiulreRedirect:'/signin',failureFlash : true}),(req,res)=>{
    res.redirect('/homepage')
});

//Homepage---------------------------------------
const loginRequired = (req,res,next)=>{
    if(!req.user){
        res.redirect('/');
    }
    next();
}

const suggestions = (req,res,next)=>{
    queries.notfollowing(req.user.userid,(err,rows)=>{
        if(err){
            console.log(err);
            req.nousererr=err;  
        } else
            req.suggestions=rows;
        next();
    });
}

const fetchPosts = (req,res)=>{
    queries.fetchposts(req.user.userid,(err,posts)=>{
        if(err){
            console.log(err);
            req.err=err;  
        } 
        else {
            req.userposts = posts;
            for(var i=0;i<req.userposts.length;i++){
                queries.getuserbyid(req.userposts[i].userid,i,(err,ival,user)=>{
                    if(err){
                        console.log(err,'user not found');
                        req.userposts[ival].usererr='User Not Found';  
                    } 
                    else {
                        req.userposts[ival].postedby = user.username;
                    }
                });
            }
        }
        res.render('homepage',{name:req.user.username, userdp:req.user.userdp, posts:req.userposts, err:req.err, suggestions:req.suggestions,  nousererr:req.nousererr});
    });
}

router.get('/homepage',loginRequired,suggestions,fetchPosts); 

router.get('/post/show/:postid',(req,res)=>{
    queries.showPost(req.params.postid,(err,post)=>{
        if(err) throw err
        else    
            queries.getcomments(req.params.postid,(err,comments)=>{
                if(err) throw err
                else 
                    res.render('post',{post:post,comments:comments})
            });
    }); 

});

router.post('/post/comment',(req,res)=>{
    console.log(req.body);
    queries.incrementcommentcount(req.body.postid,(err,res)=>{
        if(err) console.log('increment problem',err);
        else
            queries.addcomment(req.body.comment,req.body.postid,req.user.userid);
    });
});

router.post('/post/add',upload.single('file'),(req,res)=>{
    queries.addpost({caption:req.body.caption, img:'uploads/'+req.file.filename},req.user.userid);
});

router.post('/follow',(req,res)=>{
    console.log(req.body.img);
    queries.getUserByImageUrl(req.body.img,(err,followee)=>{
        if(err) throw err
        else queries.follow(req.user.userid,followee.userid)
    })
})

router.post('/post/like',(req,res)=>{
    console.log(req.body,req.user.userid);
    queries.addlike(req.user.userid,req.body.postid,(err,res)=>{
        if(err) throw err;
        console.log('res like',res);
    });
})

router.post('/unfollow',(req,res)=>{
    console.log(req.body.img);
    queries.getUserByImageUrl(req.body.img,(err,followee)=>{
        if(err) throw err
        else queries.unfollow(req.user.userid,followee.userid)
    })
})

//Profile----------------------------------------

//view own's profile
router.get('/profile',loginRequired,(req,res)=>{
    queries.fetchuserposts(req.user.userid,(err,posts)=>{
        if(err){
            console.log(err);
            req.err=err;  
        } 
        queries.following(req.user.userid,(err,rows)=>{
            if(err){
                console.log(err);
                req.nousererr=err;  
            }
            res.render('profile',{name:req.user.username, posts, err:req.err, nousererr:req.nousererr, following:rows, userdp:req.user.userdp});
        });
    });           
});


//view else's profile
router.get('/profile/:userid',loginRequired,(req,res)=>{
    queries.fetchuserposts(req.params.userid,(err,posts)=>{
        if(err){
            console.log(err);
            req.err=err;  
        } 
        queries.following(req.params.userid,(err,rows)=>{
            if(err){
                console.log(err);
                req.nousererr=err;  
            } 
            queries.getuserbyid(req.params.userid,0,(err,nothing,user)=>{
                if(err) throw err
                console.log(user,'userbyid');
                res.render('profile',{name:user.username, posts, err:req.err, nousererr:req.nousererr, following:rows, editprofile:false,userdp:user.userdp, unfollow: false });
            });
        });
    });           
});

//logout------------------------------------------
router.get('/signout',(req,res)=>{
    req.logout();
    res.redirect('/');
});


//Exporting---------------------------------------
module.exports=router;