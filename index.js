const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const _=require('lodash');
const date=require(__dirname+'/date.js');
const app=express();

mongoose.connect('mongodb://localhost:27017/todolistDB');



app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static('public'));
app.set('view engine','ejs');


const postSchema=mongoose.Schema({
    name:String
});
const listSchema=mongoose.Schema({
    name:String,
    items:[postSchema]
});

const Post=mongoose.model('Post',postSchema);
const List=mongoose.model('List',listSchema);

const post1=new Post({
    name:"buy food"
});
const post2=new Post({
    name:"Make food"
});
const post3=new Post({
    name:"Eat food"
});

const defaultPosts=[post1,post2,post3];

const day=date.getDay();
app.get('/',(req,res)=>{
     
    Post.find({},function(err,foundItem){
        if(err){
            console.log(err);
        }else{
            if(foundItem.length===0)
            {
                // Post.insertMany(defaultPosts,function(err){
                //   console.log('Items Added successfully');
                // });
            }
            res.render('list',{listTitle:day,items:foundItem});
        }
    });
  
});


app.post('/',(req,res)=>{
   
   const itemName=req.body.newItem; 
   const list=req.body.list;
   const item=new Post({
    name:itemName
    });
   if(list===day)
   {
     item.save();
    res.redirect('/');
   }
   else{
        List.findOne({name:list},function(err,foundList){
            foundList.items.push(item);
            foundList.save();
            res.redirect('/'+list);
        })
   }
});

app.get('/:listName',(req,res)=>{
    const customListName=_.capitalize(req.params.listName);
    List.findOne({name:customListName},function(err,foundList){
        if(err)
        {
            console.log(err);
        }else{
            if(!foundList)
            {
                const list=new List({
                    name:customListName,
                    items:defaultPosts
                })
                list.save();
                res.redirect('/'+customListName);
            }else{
                res.render('list',{listTitle:customListName,items:foundList.items});
            }
        }
    });
});

app.post('/delete',(req,res)=>{
    const checkboxId=req.body.checkbox;
    const listName=req.body.listName;
    console.log(listName);
    if(listName===day){
       Post.findByIdAndRemove(checkboxId,function(err){
        if(err){
            console.log(err);
        }else{
            res.redirect('/');
        }
      });
   }else{
      List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkboxId}}},function(err,foundList){
           if(!err)
           {
               res.redirect('/'+listName);
           }
       })
   }
})


app.listen(3000,()=>{
    console.log("server is running on port 3000");
});
