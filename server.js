// var http = require('http');
//
// http.createServer(function(request, response) {
//
//     // 发送 HTTP 头部
//     // HTTP 状态值: 200 : OK
//     // 内容类型: text/plain
//     response.writeHead(200, {
//         'Content-Type': 'text/plain'
//     });
//
//     // 发送响应数据 "Hello World"
//     response.end('Hello World\n');
// }).listen(8888);
//
// // 终端打印如下信息
// console.log('Server running at http://127.0.0.1:8888/');
var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({
        port: 7777
    });
var clients = [];
console.log('Server running');
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        var data = JSON.parse(message);
        if (data.type !== 0) { // number 0 once connection // number 1 onMouseDown number 2 onMousemove number 3 onMouseup
            sendMsg(data.uuid, data.type, data.x, data.y);
        } else {
            clients.push({
                "id": data.uuid,
                "ws": ws
            });
            sendMsg(data.uuid, 6, data.x, data.y);
        }
    });
    ws.on('close', function(e) {
        console.log('client is levaing');
        for (var i = 0; i < clients.length; i++) {
            if (clients[i].ws === ws) {
                sendMsg(clients[i].id, 7, 0, 0);
                clients.splice(i, 1);
                break;
            }
        }
    });
});

function sendMsg(uuid, type, x, y) {
    // if (clients[i].ws.readyState === WebSocket.OPEN)
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].id !== uuid) {
            clients[i].ws.send(JSON.stringify({
                "uuid": uuid,
                "type": type,
                "x": x,
                "y": y
            }));
        }
    }
}
