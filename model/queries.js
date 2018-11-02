var mysql2 = require('mysql2');
var bcrypt = require('bcryptjs');

const connection = mysql2.createConnection({
    host:'127.0.0.1',
    port:3306,
    user:'root',
    password:'newpassword',
    database:'final'
});

connection.connect((err)=>{
    if(err) throw err;
    else console.log('Connection Established');
});

// inserting user -----------------------------
var insertUser=(body,callback)=>{
    //Encryption -------------------------------
        bcrypt.genSalt(10,(err,salt)=>{
            if(err) 
                console.log(err);
            else 
                bcrypt.hash(body.password,salt,(err,hash)=>{
                    if(err) 
                        console.log('err',err);
                    else 
                    {
                        //insert to database ------------------------
                        connection.query("INSERT INTO USERINFO(USERNAME,USEREMAIL,USERDOB,USERPASSWORD) VALUES('"+body.username+"','"+body.useremail+"','"+body.dob+"','"+hash+"')",(err,result)=>{
                            if(err)
                                callback(err,null);
                            else
                                callback(null,result.insertId);
                        })
                    } 
                });
        });
}



// Signing In user --------------------------------
var checkUser=(body,callback)=>{
    connection.query("SELECT * from userinfo WHERE useremail='"+body.useremail+"'",(err,rows,fields)=>{
            if(rows.length==1) {
            //Comparing with bcrypts hash key --------
                bcrypt.compare(body.password,rows[0].userpassword,(err,res)=>{
                        if(res)
                            callback(null,rows[0]);
                        else
                            callback(err,null);
                })
            }
            else
                callback(true,null);
    });
}

// Getting user by id--------------------------------
var getUser=(useremail,callback)=>{
    connection.query("SELECT * from userinfo WHERE useremail='"+useremail+"'",(err,rows,fields)=>{
            if(rows) 
                callback(null,rows[0]);
            else
                callback(err,null);
        }             
    );
}

var adddp = (path,userid)=>{
    connection.query("UPDATE userinfo set userdp='"+path+"' where userid ="+userid);
}

var addpost = (data,userid)=>{
    connection.query("insert into posts(userid,caption,postimg) values("+userid+",'"+data.caption+"','"+data.img+"')",(err,res)=>{
        if(err) throw err
        else console.log('Post added',res.insertId);
    });
}

var fetchposts = (userid,callback)=>{
    connection.query("select postid,userid,caption,postimg,nooflikes,noofcomments from posts where userid in (select followee from following where follower="+userid+")",(err,rows)=>{
        if(err) callback(err,null)
        else if(rows.length==0)
            callback('No posts Available',null)
        else
            callback(null,rows)
    });
}

var addlike=(userid,postid,callback)=>{
    connection.query("UPDATE posts SET NOOFLIKES=NOOFLIKES+1 WHERE postid="+postid,(err,rows)=>{
        if(err) callback(err,null);
        else callback(null,rows)
    });
}

var showPost = (postid,callback)=>{
    connection.query("select postid,caption,postimg,nooflikes,noofcomments from posts where postid ="+postid,(err,rows)=>{
        if(err) callback(err,null);
        else callback(null,rows[0]);
    });
}

var addcomment=(comment,postid,userid)=>{
    connection.query("insert into comments(postid,userid,comment) values("+postid+","+userid+",'"+comment+"')",(err,rows)=>{
        if(err) throw err
    });
}

var incrementcommentcount=(postid,callback)=>{
    connection.query("UPDATE posts SET NOOFCOMMENTS=NOOFCOMMENTS+1 WHERE postid="+postid,(err,rows)=>{
        if(err) callback(err,null);
        else callback(null,rows)
    });
}

var getcomments =(postid,callback)=>{
    connection.query("select * from comments where postid="+postid,(err,rows)=>{
        if(err) callback(err,null);
        else callback(null,rows);
    });
}

var getuserbyid=(userid,ival,callback)=>{
    connection.query("SELECT userdp,userid,username from userinfo WHERE userid="+userid ,(err,rows)=>{
            if(rows) 
                callback(null,ival,rows[0]);
            else
                callback(err,ival,null);
        }             
    );
}

var fetchuserposts = (userid,callback)=>{
    connection.query("select userid,caption,postimg,nooflikes,postid from posts where userid ="+userid,(err,rows)=>{
        if(err) callback(err,null)
        else if(rows.length==0)
            callback('No posts Available',null)
        else
            callback(null,rows)
    });
}

var notfollowing=(userid,callback)=>{
    connection.query("select userid,username,userdp from userinfo where userid !="+userid+" and userid not in(select followee from following where follower="+userid+")",(err,rows)=>{
            if(err) callback(err,null)
            else if(rows.length==0)
                callback('No users Available',null)
            else{
                console.log(rows);
                callback(err,rows);                
            }
        }             
    );
}

var following=(userid,callback)=>{
    connection.query("select userid,username,userdp from userinfo where userid !="+userid+" and userid in(select followee from following where follower="+userid+")",(err,rows)=>{
            if(err) callback(err,null)
            else if(rows.length==0)
                callback('No users Available',null)
            else{
                console.log(rows);
                callback(err,rows);                
            }
        }             
    );
}

var getUserByImageUrl = (url,callback)=>{
    console.log("select userid from userinfo where userdp='"+url+"'");
    connection.query("select userid from userinfo where userdp='"+url+"'",(err,rows)=>{
        if(err) callback(err,null);
        else callback(null,rows[0])
    });
}
var follow=(follower,followee)=>{
    console.log("insert into following values("+follower+","+followee+")");
    connection.query("insert into following values("+follower+","+followee+")");
}

var unfollow=(follower,followee)=>{
    console.log("delete from following where follower="+follower+" and followee="+followee);
    connection.query("delete from following where follower="+follower+"and followee="+followee);
}



module.exports={
    insertUser,
    checkUser,
    getUser,
    adddp,
    addpost,
    fetchposts,
    getuserbyid,
    fetchuserposts,
    notfollowing,
    follow,
    getUserByImageUrl,
    following,
    unfollow,
    addlike,
    showPost,
    addcomment,
    getcomments,
    incrementcommentcount
}