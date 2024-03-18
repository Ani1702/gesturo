const mongoose=require("mongoose");
const levelData=require("./levelData.js");
const quesData=require("./questionData.js");
const Level=require("../models/levels.js");
const Question=require("../models/questions.js");



main()
    .then(()=>{
        console.log('Connection Successful! DB Connected!');
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/gesturo');
}

const initLevelDB = async ()=>{
    await Level.deleteMany({});
    await Level.insertMany(levelData.data);
    console.log("data was initialized")
}

const initQuesDB = async ()=>{
    // await Question.deleteMany({});
        
    // Insert new questions
    const quest = quesData.data; // Assuming you'll have data for questions
    const ques = await Question.insertMany(quest);

    const quesLev=await Question.find({ levelNumber: 1 });
    
    // Update the level with new questions
    const level = await Level.findOneAndUpdate(
        { number: 1 }, // Filter criteria
        { questions: quesLev.map(question => question._id) }, // Update operation
        { new: true } // Options: return the modified document
    );
    console.log(level);
}

initQuesDB();
