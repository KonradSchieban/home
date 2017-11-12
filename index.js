var express     = require('express'),
    nunjucks    = require('nunjucks'),
    bodyParser  = require('body-parser'),
    fs          = require("fs"),
    favicon     = require('serve-favicon'),
    async       = require('async'),
    tools       = require("./tools.js"),
    config      = require('./config.json');
    
var app         = express();

// Configure Nunjucks
var _templates = process.env.NODE_PATH ? process.env.NODE_PATH + '/views' : 'views' ;
nunjucks.configure(_templates, {
    autoescape: true,
    cache: false,
    express: app
});

// Set Nunjucks as rendering engine for pages with .html suffix
app.engine( 'html', nunjucks.render ) ;
app.set( 'view engine', 'html' ) ;

app.use(favicon(__dirname + '/views/home/images/favicon.ico'));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));

app.get('/home', function(req,get_res){

    var tut_folder_path = _templates + "/home/tutorials/";

    tools.get_tutorials(tut_folder_path, (err,tutorials) => {
        get_res.render("home/index.njk",{
            "title":"Home",
            "tutorials": tutorials
        });
    });
    
});

app.get('/home/work', function(req,get_res){
    get_res.render("home/work.njk",{
        "title":"Work"
    });
});

app.get('/home/tutorials', function(req,get_res){
    get_res.render("home/tutorials.njk",{
        "title":"Tutorials"
    });
});

app.get('/home/tutorials/docker', function(req,get_res){
    get_res.render("home/tutorials/docker.njk",{
        "title":"Tutorials"
    });
});


app.get('/home/tutorials/:tutorial_name/:page', function(req,get_res){
    var page = req.params.page;
    var tutorial_name = req.params.tutorial_name;
    var tut_folder_path = _templates + "/home/tutorials/";
    var folder_path = tut_folder_path + tutorial_name + "/";
    var fs_path = folder_path + page + ".njk";
    var template_path = "home/tutorials/" + tutorial_name + "/" + page + ".njk";

    fs.exists(fs_path, (exists) => {
        if(exists){
            async.parallel({
                tutorials: function(callback){
                    tools.get_tutorials(tut_folder_path, (err,tutorials) => {
                        callback(null, tutorials)
                    });
                },
                tutorial_toc: function(callback){
                    tools.get_tutorial_toc(folder_path, (err,table_of_contents) => {
                        callback(null, table_of_contents)
                    });
                }
            },(err,res) =>{
                get_res.render(template_path,{
                    "title": tutorial_name + " Tutorial",
                    "tutorials": res.tutorials,
                    "table_of_contents": res.tutorial_toc
                });
            });
        }
        else{
            get_res.redirect("/home/tutorials/" + tutorial_name);
        }
    });
    
});

app.listen(config.listener_port);
console.log('Starting server on port' + config.listener_port + '...');