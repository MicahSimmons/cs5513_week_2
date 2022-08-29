/* Include the basic http server package */
const HTTP = require('http');
const FS = require('fs').promises;

function apiHandler ( req, rsp ) {
    console.log("Performing API Response!")
    let fileName = "/stuff.json";
    let filePath = __dirname + "/db" + fileName;

    FS.readFile(filePath)
        .then( fileData => {
            console.log("Opened file: " + filePath)
            rsp.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
            rsp.end(fileData);  
        })
        .catch( (e) => {
            console.log("File not found: " + filePath)
            rsp.writeHead(404);
            rsp.end();
        })
}

function defaultHandler ( req, rsp ) {
    let fileName = (req.url == "/") ? "/index.html" : req.url;
    let filePath = __dirname + "/public" + fileName;

    /* extract file extension and map to mime type */
    let re = /(?:\.([^.]+))?$/
    let ext = re.exec(fileName);
    let mime = "";
    switch (ext[1]) {
        case "css":
            mime = 'text/css; charset=UTF-8';
            break;
        case "jsx":
            mime = "text/babel; charset=UTF-8";
            break;
        case "html":
        default:
            mime = 'text/html; charset=UTF-8';
            break;
    }

    FS.readFile(filePath)
        .then( fileData => {
            console.log("Opened file: " + filePath + " ext:" + ext + " type:" + mime)
            rsp.writeHead(200, {'Content-Type': mime});
            rsp.end(fileData);  
        })
        .catch( (e) => {
            console.log("File not found: " + filePath)
            rsp.writeHead(404);
            rsp.end();
        })
}

const apiTable = {
    "/api": apiHandler,
    "__default": defaultHandler
}

/* Create a server, and attach a default handler function */
var server = HTTP.createServer( (req, rsp) => {
  /* req.url gives the path used to contact the server.  An If or Switch on the URL
   * would be useful for handling multiple API's.
   */
  let handler = apiTable[req.url];
  if (handler) {
    handler(req, rsp);
  } else {
    apiTable["__default"](req,rsp);
  }
});

/* Attach the server to a listening port.  REPL seems to redirect this to the default https port? */
server.listen(8000);
console.log("Server Started");
