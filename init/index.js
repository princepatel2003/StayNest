//const express=require("express");
const mongoose=require("mongoose");
const Listing=require("../models/listing.js");
const initData=require("./data.js");
//const app=express();


let url="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(url);
};
main().then(()=>{
    console.log("init file is connected");
}).catch((err)=>{
    console.log(err);
});

// app.get("/",(req,res)=>{
//     const sample=new listing({

//     })
// })

const initDB =async()=>{
    await Listing.deleteMany({});
    // console.log("err in data casting");
    initData.data=initData.data.map((obj)=>({...obj, owner: '6745bc01c7607a33b275d6ea',}));
    await Listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();
