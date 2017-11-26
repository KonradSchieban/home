var tools       = require("./../tools.js");

module.exports = function(app, templates){

    app.get('/home/admin', function(req,get_res){
        
        var tut_folder_path = templates + "/home/tutorials/";
        
        tools.get_tutorials(tut_folder_path, (err,tutorials) => {
            get_res.render("home/admin/admin.njk",{
                "title":"Admin",
                "tutorials": tutorials
            });
        });
    });

}