/**
 * Created by houquan on 2015/3/22.
 */
var http = require('http'),
    fs = require('fs'),
    path = require('path'),
    mime = require('mime'),
    cache = {},
    chatServer = require('./lib/chat_server'),
    server = {};


function send404(response){
    response.writeHead(200,{'Content-Type':'text/plain'});
    response.write('Error 404: Resource not found.');
    response.end();
}

function sendFile(response,filepath,filecontent){
    response.writeHead(200,
        {
            'Content-Type':mime.lookup(path.basename(filepath))
        });
    response.end(filecontent);
}

function serverStatic(response,cache,absPath){
    if(cache[absPath]){
        sendFile(response,absPath,cache[absPath]);
    }else{
        fs.exists(absPath,function(exists){
            if(exists){
                fs.readFile(absPath,function(err,data){
                    if(err){
                        send404(response);
                    }else{
                        cache[absPath] = data;
                        sendFile(response,absPath,data);
                    }
                });
            }else{
                send404(response);
            }
        });
    }
}

server = http.createServer(function(request,response){
    var filePath = false,
        absPath = '';
    if(request.url == '/'){
        filePath = 'public/index.html';
    }else{
        filePath = 'public'+request.url;
    }
    absPath = './'+filePath;
    serverStatic(response,cache,absPath);
});
server.listen(3000,function(){
    console.log('Server listening on port 3000');
});

chatServer.listen(server);