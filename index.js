var express     = require('express'),
    nunjucks    = require('nunjucks'),
    bodyParser  = require('body-parser'),
    fs          = require("fs"),
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

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/views'));

app.get('/home', function(req,get_res){
    get_res.render("home/index.njk",{
        "title":"Home"
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
    var folder_path = _templates + "/home/tutorials/" + tutorial_name + "/";
    var fs_path = folder_path + page + ".njk";
    var template_path = "home/tutorials/" + tutorial_name + "/" + page + ".njk";

    fs.exists(fs_path, (exists) => {
        if(exists){
            var table_of_contents = [];
            fs.readdir(folder_path, (err, files) => {
                if(err){
                    console.log("Could not find a single page in directory " + folder_path);
                    return;
                }

                var first_char;
                for(i in files){
                    file_name = files[i];
                    if(tools.str_is_number(file_name[0])){
                        var stripped_dot = file_name.split(".");
                        var file_name_wo_ending = stripped_dot[0];
                        var stripped_dash = file_name_wo_ending.split("-");
                        var file_name_wo_number = stripped_dash[1];
                        var display_name = file_name_wo_number.replace(/_/g," ")

                        table_of_contents.push({
                            template_file: file_name_wo_ending,
                            display_name: display_name
                        });
                    }
                }

                get_res.render(template_path,{
                    "title": tutorial_name + " Tutorial",
                    "table_of_contents":table_of_contents
                });
            })
        }
        else{
            get_res.redirect("/home/tutorials/" + tutorial_name);
        }
    });
    
});

app.listen(config.listener_port);
console.log('Starting server on port' + config.listener_port + '...');