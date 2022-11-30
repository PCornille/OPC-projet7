const express=require('express');
const app=express();
const http=require('http');
const port=3301;

const cors = require('cors');
const path = require('path');
const helmet=require('helmet');
const parser=require('body-parser');

const mongoose = require("mongoose");
const dbMdp="tou2Z1XCDRxHrK7R";
mongoose.connect("mongodb+srv://A01:"+dbMdp+"@cluster0.oko9cjg.mongodb.net/projet7?retryWrites=true&w=majority",
    { useNewUrlParser: true,
        useUnifiedTopology: true })
    .then(() => console.log('BDD OK!'))
    .catch(() => console.log('BDD NOK!'));


app.set('port',port);
app.use(cors());
// app.use(parser.json());
// app.use(parser.urlencoded({extended:true}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use('/Images', express.static(path.join(__dirname, 'Images')));
app.use(helmet());

const server=http.createServer(app);
server.listen(port);

const userRoutes=require('./Routes/userRoutes');
const postRoutes=require('./Routes/postRoutes');


app.use('/api/user',userRoutes);
app.use('/api/post',postRoutes);
