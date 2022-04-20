import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/cineview").then(() => {
    console.log("connection successful");
}).catch((e) => {
    console.log(e);
})