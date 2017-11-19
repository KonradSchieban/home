var async       = require('async');
    fs          = require('fs');

function str_is_number(test_str){
    if (!isNaN(parseInt(test_str, 10))) {
        return true;
    }else{
        return false;
    }
}

module.exports = {

    str_is_number: function(test_str){
        if (!isNaN(parseInt(test_str, 10))) {
            return true;
        }else{
            return false;
        }
    },

    get_tutorials: function(tut_folder_path, callback){
        var tutorials = [];
        
        async.waterfall([
            function(callback){
                fs.readdir(tut_folder_path, (err,tut_folders) => {
                    if(err){
                        console.log("Folder path: " + tut_folder_path);
                        console.log("Error" + err);
                        console.log("Could not read Tutorial Folder path!");
                        return;
                    }
                    console.log("Found folders: " + tut_folders);
                    callback(null, tut_folders);
                });
            },
            function(tut_folders, callback){
                tut_folders.forEach((tut_folder) => {
                    
                    var pages = fs.readdirSync(tut_folder_path + "/" + tut_folder);
                    var index_page_split_dot = pages[0].split(".");
                    var index_page = index_page_split_dot[0];

                    tutorials.push({
                        "tutorial": tut_folder,
                        "tut_index_page": index_page
                    });
                    
                });
                callback(null, tutorials);
            }
        ], callback);
    },

    get_tutorial_toc: function(folder_path,callback){
        var table_of_contents = [];
        async.waterfall([
            function(callback){
                fs.readdir(folder_path, (err, files) => {
                    if(err){
                        console.log("Could not find a single page in directory " + folder_path);
                        return;
                    }
                    callback(null, files);
                });
            },
            function(files, callback){
                var first_char;
                for(i in files){
                    file_name = files[i];

                    if(str_is_number(file_name[0])){
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
                callback(null, table_of_contents);
            }
        ],callback)

    }
};

