var express = require("express");
var ejs = require("ejs");
var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

var upload = multer({
    storage: storage,
    limits: {fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png|gif/;
    
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    const mimetype = filetypes.test(file.mimetype);
    
    if(mimetype && extname ){
        return cb(null, true);
    } else {
        cb("Error: Images Only ");
    }
}

var app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));
 
app.get("/", function(req, res){
    res.render("index");
});

app.post("/upload", function (req, res){
     upload(req, res, function (err) {
         if(err){
            res.render("index", {
                msg: err
            });
         } else {
             if(req.file == undefined) {
                 res.render("index", {
                     msg: "Error: no File Selected"
                 });
             } else {
                 res.render("index", {
                     msg: "File Uploaded!",
                     file: `uploads/${req.file.filename}`
                 });
             }
         }
     });
});

var server = app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started at port:" + server.address().port);
});