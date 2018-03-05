var tools       = require("./../tools.js"),
    bodyParser  = require('body-parser');

module.exports = function(app, templates, mongoose){

    var page_schema = mongoose.Schema({
        tutorial: String,
        title: String,
        content: String
    });
    
    var Page_Model = mongoose.model('Page_Model', page_schema);

    app.get('/home/admin', function(req,get_res){
        
        var tut_folder_path = templates + "/home/tutorials/";
        
        tools.get_tutorials(tut_folder_path, (err,tutorials) => {
            get_res.render("home/admin/admin.njk",{
                "title": "Admin Page",
                "tutorials": tutorials
            });
        });
    });

    app.post('/home/admin', function(req,post_res){
        
        var tut_folder_path = templates + "/home/tutorials/";
        
        var new_page  = new Page_Model({ 
            tutorial: req.body.tutorial,
            title: req.body.title,
            content: req.body.article
        });

        new_page.save(function (err, new_page) {
            if (err) return console.error(err);
            else{
                console.log("Successfully stored article");

                Page_Model.find(function (err, pages) {
                    if (err) return console.error(err);
                    console.log(pages);
                })
            }
        });

        post_res.redirect("/home/admin");
    });

}