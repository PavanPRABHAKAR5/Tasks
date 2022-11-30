const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const taskData = require("./taskData");

mongoose.connect('mongodb://localhost/task')
.then(()=>{
    console.log("Database connected")
})
.catch(()=>{
    console.log("Error in connecting the database")
})

app.use(express.json());
app.use(bodyParser());


const counterSchema={
    id:{
        type:String
    },
    seq:{
        type:Number
    }
}

const countermodel = mongoose.model("counter",counterSchema);

app.get("/v1/tasks", async (req,res)=>{
    try{
        const result = await taskData.find();
        res.status(201).json({
            status:"Successful",
            result
        });
    }catch(err){
        res.status(404).json({
            status:"Failed",
            message:err.message
        })
    }
})


app.get("/v1/tasks/:id", async (req,res)=>{
    try{
        let id = req.params.id;
        const result = await taskData.find({id:id});
        res.status(201).json({
            status:"Successful",
            result
        });
    }catch(err){
        res.status(404).json({
            error: "There is no task at that id",
            message:err.message
        })
    }
})



app.post("/v1/tasks", async (req,res)=>{


    try{

        countermodel.findOneAndUpdate(
            {id:"autoval"},
            {"$inc":{"seq":1}},
            {new:true},(err,cd)=>{
                // console.log("counter value",cd)
                let seqId;
                if(cd==null){
                    const newval = new countermodel({id:"autoval",seq:1})
                    newval.save()
                    seqId=1
                }else{
                    seqId=cd.seq
                }
                // const data = req.body;
                const result =  taskData.create({
                    id:seqId,
                    title:req.body.title,
                    is_completed:req.body.is_completed,
                });
                res.status(201).json({
                    status:"Successful",
                    id:seqId
                });
            }
        )

    }catch(err){
        res.status(404).json({
            status:"Failed",
            message:err.message
        })
    }
})


app.put("/v1/tasks/:id", async (req,res)=>{
    try{
        let id = req.params.id;
        const result = await taskData.updateOne({id:id}, req.body, {new: true});
        res.status(201).json({
            status:"Successful",
            result:result.body
        });
    }catch(err){
        res.status(404).json({
            status:"if id not found",
            message:err.message
        })
    }
})

app.delete("/v1/tasks/:id", async (req,res)=>{
    try{
        let id = req.params.id;
        const result = await taskData.deleteOne({id:id}, {new: true});
        res.status(201).json({
            status:"Successful",
            id:result.id
        });
    }catch(err){
        res.status(404).json({
            status:"Failed",
            message:err.message
        })
    }
})

app.post("/v1/tasks", async (req,res)=>{
    try{
        const data1 = req.body;
        const data2 = req.body;
        const data3 = req.body;

        const result = await taskData.insertMany([data1, data2, data3]);
        res.status(201).json({
            status:"Successful",
            result
        });
    }catch(err){
        res.status(404).json({
            status:"Failed",
            message:err.message
        })
    }
})

app.listen(3000, ()=>console.log('Server running...'));


