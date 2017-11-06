var express     = require('express'),
    nunjucks    = require('nunjucks'),
    bodyParser  = require('body-parser'),
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

app.get('/home/blog', function(req,get_res){
    get_res.render("home/blog.njk",{
        "title":"Blog"
    });
});

app.listen(config.listener_port);
console.log('Starting server on port' + config.listener_port + '...');