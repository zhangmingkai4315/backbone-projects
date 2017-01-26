module.exports = {
    uploadFile: function (file,handler) {
        var formData = new FormData();
        formData.append(
            "files", file
        );
        $.ajax({
            url: '/api/upload',
            type: 'POST',
            data: formData,
            success: function () {
                handler.success([].slice.call(arguments))
            },
            error: function () {
                handler.error([].slice.call(arguments))
            },
            processData:false,
            contentType:false,
        })
    },
    validateFile: function (file, size, type) {
        console.log(file)
        var args = Array.prototype.slice.call(arguments);
        var size = 0;
        var type = /\.(jpg|png|gif)$/i
        if (args.length === 3) {
            size = args[1];
            type = args[2];
        } else if (args.length === 2) {
            size = args[1];
        } else {
            return false;
        }
        return file.size < size && type.test(file.name)
    },
    update_coverimage:function(path){
        $('#cover-image-alert').removeClass().addClass('alert alert-info').text("文件上传成功");
        $('input#cover-image-file-path').val(path);
        $('#show-cover-image').removeClass('hidden');
        $('#show-cover-image img').attr("src", path);
    },
    update_coverimage_error:function(error){
        $('#cover-image-alert').removeClass().addClass('alert alert-danger').text(error);
        $('input#cover-image-file-path').val('');
         $('#show-cover-image').addClass('hidden');
    },
    update_book_file_success:function(path){
        $('#upload-file-alert').removeClass().addClass('alert alert-info').text("文件上传成功");
        $('input#upload-file-path').val(path);
    },
    update_book_file_error:function(error){
        $('#upload-file-alert').removeClass().addClass('alert alert-danger').text(error);
        $('input#upload-file-path').val('');
    }
}