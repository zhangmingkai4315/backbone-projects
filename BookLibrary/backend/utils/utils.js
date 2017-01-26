module.exports = {
    send_json:function(res,data,err,statusCode){
        var args = [].slice.call(arguments);
        var code = 200;
        if(args.length==4){
            code=statusCode;
        }
        res.status(code).json({
            data:data,
            error:err
        });
    }
}