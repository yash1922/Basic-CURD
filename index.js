const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT =3000;
app.use(express.json())
app.use(express.static(path.join(__dirname,'public')));
//middleware

mongoose.connect('mongodb+srv://yash:yash123@cluster0.ox3ehwf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(()=> console.log('connected to database'))
.catch(err=>console.log("connection failed",err));

//Define user schema
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
})
const User = mongoose.model('User', UserSchema);

app.get('/users',(req,res)=>{
    User.find({})
    .then(user=> res.json(user))
    .catch(err=> res.status(500).json({
        message: err.message
    }));
});

app.post( '/users' , ( req,res ) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    user.save()
    .then(newUser => res.status(201).json(newUser))
    .catch(err => res.status(400).json({ message: err.message
    }));
});
app.put('/users/:id',(req,res)=>
{
    const userId=req.params.id;
    const updateData={
        name: req.body.name,
        email: req.body.email,
        password:req.body.password
    };

    User.findByIdAndUpdate(userId,updateData,{new:true})
    .then(updatedUser => 
    {
        if(!updatedUser)
        {
            return res.status(404).json({message:'User not found'});
        }
        res.json(updatedUser);
    })
    .catch(err => res.status(400).json({message: err.message}));
});



app.listen(PORT);

