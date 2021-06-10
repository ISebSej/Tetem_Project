const fs = require('fs');
const { PeerServer } = require('peer');

const peerServer = PeerServer({ 
 debug: 3,
 port: 9000, 
 path: '/remote', 
 key: 'tetem',
 ssl: {
    key: fs.readFileSync('/etc/nginx/ssl/tetem-reflectie.nl.key'),
    cert: fs.readFileSync('/etc/nginx/ssl/tetem-reflectie.nl.crt')
  }
 })

console.log("Server started");

console.log("Connected on port 9000")


peerServer.on("open", function(client) { console.log(client) } )
