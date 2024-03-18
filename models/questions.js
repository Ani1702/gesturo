const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const questionSchema = new mongoose.Schema({
    levelNumber:{type:Number,required:true},
    text: { type: String, required: true },
    options: [{ type: String }], 
    correctAnswer: { type: String },
  });

const Question=mongoose.model("Question",questionSchema);
module.exports=Question;