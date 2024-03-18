const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const LevelSchema = new mongoose.Schema({
    number:{type:Number,required:true},
    title: { type: String, required: true }, 
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
//     owner:{
//       type:Schema.Types.ObjectId,
//       ref:"User"
//   },
  });
  
  const Level = mongoose.model('Level', LevelSchema);
  
module.exports=Level;