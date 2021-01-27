const mongoose = require('mongoose');

const todoSchema=new mongoose.Schema({
    userId:{
    type:mongoose.ObjectId
    },
    title:{
    type:String,
    required:true,
    minlength:10,
    maxLength:20
    },
    body:{
    type:String,
    required:true,
    minlength:10,
    maxLength:500
    }, 
    tags:{
    type:[String]    
    },
    createdAt: {type:Date},
    updatedAt: {type:Date,default:Date.now}
    });

    const Todo = mongoose.model('Todo', todoSchema);
    module.exports = Todo;