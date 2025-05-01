const mongoose=require("mongoose");

const optschema=new mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true
    },
    otp:{
        type:String,
        require:true,
    },
    createdAt:{
        type:Date,
        defalut:Date.now,
        expires:300
    }
})


const Otp=mongoose.model("OPT",optschema);

module.exports=Otp;