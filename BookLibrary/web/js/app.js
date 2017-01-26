// global.app = app || {}
var LibraryView = require('./views/LibraryView');
var util = require('./utils/utils');
$(function(){
    console.log("debug")
    $('#release-date').datepicker();
    new LibraryView(books);
    $("#cover-image").change(function(){
        if(util.validateFile(this.files[0],10000000,/\.(jpg|png|gif)$/i)){
             util.uploadFile(this.files[0],{
                 success:function(data){
                    var path = data[0].data.path;
                    // console.log()
                    util.update_coverimage(path);
                 },
                 error:function(data){
                    var error = typeof data[0].data.error===null||"上传失败,请稍后重试";
                    // console.log(data)
                    util.update_coverimage_error(error);
                 }
             });
        }else{
            $('#cover-image-alert').removeClass().addClass('alert alert-danger').text('无法上传，格式或尺寸超出范围');
        }
    });

    $("#upload-file").change(function(){
        if(util.validateFile(this.files[0],3000000000,/\.(pdf|pptx|ppt|doc|docx|rar)$/i)){
             util.uploadFile(this.files[0],{
                 success:function(data){
                    var path = data[0].data.path;
                    // console.log()
                    util.update_book_file_success(path);
                 },
                 error:function(data){
                    var error = typeof data[0].data.error===null||"上传失败,请稍后重试";
                    // console.log(data)
                    util.update_book_file_error(error);
                 }
             });
        }else{
            $('#upload-file-alert').removeClass().addClass('alert alert-danger').text('无法上传，格式或尺寸超出范围');
        }
    });
});