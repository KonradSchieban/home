module.exports = {
    str_is_number: function (test_str){
        if (!isNaN(parseInt(test_str, 10))) {
            return true;
        }else{
            return false;
        }
    }
};

