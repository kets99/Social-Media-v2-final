var postbutton = document.querySelectorAll('.postbutton')[1];

postbutton.disabled=true;
postbutton.style.boxShadow='none';
postbutton.style.backgroundColor='crimson';
var inputfile = document.querySelector('input[type="file"]');
var icon1 = document.getElementsByClassName('postimg');
var newpost = document.getElementById('newpost');
var cancel = document.querySelector('.postbutton');
var textarea = document.querySelector('textarea');


icon1[0].addEventListener('click',(e)=>{
    document.querySelector('.postfile').click();
});

newpost.addEventListener('click',(e)=>{
        document.querySelector('.postbox').style.opacity=1;
        document.querySelector('.postbox').style.height='80%';
});

cancel.addEventListener('click',(e)=>{
    console.log('click');
        document.querySelector('.postbox').style.opacity=0;
        document.querySelector('.postbox').style.height=0;
});

textarea.addEventListener('click',(e)=>{
    textarea.value="";
});

inputfile.addEventListener('change',()=>{
    postbutton.disabled=false;
    postbutton.style.boxShadow='0px 0px 8px white';
    postbutton.style.backgroundColor='blueviolet';
});

postbutton.addEventListener('click',()=>{
    var formdata = new FormData();
    formdata.append("caption",textarea.value);
    formdata.append("file",inputfile.files[0]);
    fetch('/post/add',{
        method:'post',
        body: formdata
    });
    document.querySelector('.postbox').style.opacity=0;
    document.querySelector('.postbox').style.height=0;
});

var suggestions = document.querySelectorAll('.friend');
console.log(suggestions[0]);
for(var i=0;i<suggestions.length;i++){
    suggestions[i].children[1].children[0].addEventListener('click',(e)=>{
        var img = e.srcElement.parentElement.parentElement.children[0].children[0].getAttribute('src');
        fetch('/follow',{
            method:'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                img,  
            }),
        });
        e.srcElement.parentElement.parentElement.style.display='none'
    });
}

var posts = document.querySelectorAll('.post');
console.log(posts);
for(var i=0;i<posts.length;i++){
    var likebutton = posts[i].children[3].children[0];
    likebutton.addEventListener('click',(event)=>{
        var postid = event.srcElement.parentElement.parentElement.getAttribute('id');
        console.log('id',postid);
        event.srcElement.disabled=true;
        event.srcElement.style.backgroundColor='black'; 
        event.srcElement.style.color='white'; 
        event.srcElement.style.boxShadow='0px 0px';
        fetch('/post/like',{
            method:'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                postid,  
            }),
        });
    });
}
