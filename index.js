//importing express library
const express = require('express');
const app = express()
const noteRouter = require("./routes/noteRoutes");
const userRouter = require("./routes/userRoutes");

const mongoose = require("mongoose");
app.use(express.json());

app.use((req, res, next) => {
    console.log("HTTP Method - " + req.method + " , URL - " + req.url);
    next();
  });

app.use("/users", userRouter);
app.use("/note", noteRouter);

app.get("/", (req,res) =>{
    res.send("Hello");
});

mongoose
  .connect(
    "mongodb+srv://admin:password_10@cluster0.e8ig87x.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(5600, () => { //handle http reqs at port 5600
      console.log("Server started on port number 5600");
    });
  })
  .catch((error) => {
    console.log(error);
  });





