const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    id:{type:Number, required:true},
    title : {type:String, required:true},
    is_completed : {type:Boolean, required:true}
})

const taskData = mongoose.model("task", taskSchema);

module.exports= taskData;