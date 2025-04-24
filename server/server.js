const express = require('express')
const session = require('express-session')
const cors = require('cors')
const studentRouter = require('./routes/student.js')



const app = express()
app.use(express.json());

app.use(cors({
    origin : "http://localhost:5502",
    credentials : true,
}));

app.use(session({
    secret: 'test1234',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        httpOnly : true,
        secure: false,
        maxAge : 1000 * 60 * 30
    }
}));

app.use("/student",studentRouter);

app.listen(3003, ()=>{
    console.log('서버 실행 중!');
});