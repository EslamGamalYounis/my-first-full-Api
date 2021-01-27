const { strict } = require('assert');
const express = require('express');
const app = express();
app.use(express.static('public'));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const port = 4000;
const mongoose = require('mongoose');

require('./db-connecttion');
const User = require('./models/user');
const Todo = require('./models/Todo');

const handleError = function(err) {
    console.error(err);
    return;    
};

//2 - Create a middleware that logs the request url, method, and current time 
app.use('/',(req,res,next)=>{
    const method =req.method; 
    const url =req.originalUrl;
    console.log(url,method);
    console.log("time of Request "+Date.now());
    next();
  })

// all users functions 
app.post('/users/register',(req,res,next)=>{
    const {usrename,password,firstname,age}=req.body;
    User.create({usrename:usrename,password:password,firstName:firstname,age:age},function (err,User) {
            if (err) {
                res.statusCode = 402;
                return handleError(err);
            }
            res.statusCode=200;
            res.send({message:'user was registered successfully'}) ;
            next();
            });
});

app.post('/users/login',(req,res,next)=>{
    const {usrename,password}=req.body;
    User.findOne({usrename:usrename,password:password},{password:0,age:0,__v:0},function (err,user) {
            if (err) {
                res.statusCode = 401;
                res.send({error:`invalid credentials`})
                return handleError(err);
            }
            const {id,usrename,firstname}=user;
            // to get last todo 
            const objectId = mongoose.Types.ObjectId(id);
            // let lastTodo;
            // Todo.find({userId:objectId},null,{sort:{createdAt:-1},limit:1},(err,todo)=>{
            //     if(err){
            //         res.statusCode = 500;
            //         res.send({error:`server error`})
            //         return handleError(err);
            //     }
            //     lastTodo =todo;
            // })
            res.statusCode=200;
            res.send({message: "logged in successfully" ,usrename } ) ;
            next();
            });
});

app.get('/users',(req,res,next)=>{
    User.find({},{usrename:0,_id:0,password:0,age:0,__v:0},(err,users)=>{
        if(err){
            res.statusCode = 401;
            res.send({error:`invalid path`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send(users);
        next();
    })
});


app.delete('/users/:id',(req,res,next)=>{
    var {id} = req.params;
    User.deleteOne({_id:id},(err)=>{
        if(err){
            res.statusCode = 300;
            res.send({error:`invalid id not found in database`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send('user delete successfully');
        next();
    })
})

app.patch('/users/:id',(req,res,next)=>{
    var {id} = req.params;
    const {usrename,firstName,password,age}=req.body;
    User.updateOne({_id:id},{usrename:usrename,firstName:firstName,password:password,age:age},(err)=>{
        if(err){
            res.statusCode = 300;
            res.send({error:`invalid id not found in database`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send('user is updated successfully');
        next();
    })
})

//-------------------------------------------------------------------------------------------------------------------------//

// all todos functions

app.post('/todos',(req,res,next)=>{
    const {userId,title,body,tags,createdAt,updatedAt}=req.body;
    Todo.create({userId:userId,title:title,body:body,tags:tags,createdAt:createdAt,updatedAt:updatedAt},(err)=>{
        if(err){
            res.statusCode = 300;
            res.send({error:`you enter wrong value`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send({message:'todo was created '})
    })
})


app.get('/todos/:userId',(req,res,next)=>{
    const {userId} =req.params;
    const userObjectId = mongoose.Types.ObjectId(userId);
    
    Todo.find({userId:userObjectId},(err,todos)=>{
        if(err){
            res.statusCode = 401;
            res.send({error:`invalid path`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send({message :'todos returned successfully',todos});
        next();
    })
});

app.get('/todos',(req,res,next)=>{
    const {limit,skip}=req.body;
    Todo.find({},null,{limit:limit,skip:skip},(err,todos)=>{
        if(err){
            res.statusCode = 401;
            res.send({error:`invalid path`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send({message:'todos returned successfully',todos});
        next();
    })
});


app.patch('/todos/:id',(req,res,next)=>{
    var {id} = req.params;
    const {title,body,tags}=req.body;
    Todo.updateOne({_id:id},{title: title,body: body,updatedAt:Date.now(),tags:tags},(err)=>{
        if(err){
            res.statusCode = 300;
            res.send({error:`invalid id not found in database`})
            return handleError(err);
        }
        console.log('')
        res.statusCode=200;
        res.send('todo is updated successfully');
        next();
    })
})


app.delete('/todos/:id',(req,res,next)=>{
    var {id} = req.params;
    Todo.deleteOne({_id:id},(err)=>{
        if(err){
            res.statusCode = 300;
            res.send({error:`invalid id not found in database`})
            return handleError(err);
        }
        res.statusCode=200;
        res.send('todo delete successfully');
        next();
    })
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

//3 - Create a global error handler that logs the error and return {“error”:”internal server error”} with status code 500 
app.use((err, req, res, next) =>{
  console.error(err)
  res.status(500);
  res.send({error:'internal server error'})
  next();
})

// function errorHandler (err, req, res, next) {
//     if (res.headersSent) {
//       return next(err)
//     }
//     res.status(500)
//     res.render('error', { error: err })
//   }

// app.use(function (err, req, res, next) {
//     console.error(err.stack)
//     res.status(500).send('Something broke!')
//   })