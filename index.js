var WebSocketServer = require("ws").Server
var http = require("http")
var express = require("express")
var app = express()
var port = process.env.PORT || 5000

//antonio adding

var contacts = [
{
    id: 1,
    firstName: 'Steve',
    lastName: 'Becherer',
    email: 'steve@conquer.com'
},
{
    id: 2,
	firstName: 'Mike',
    lastName: 'Jones',
    email: 'jones@theman.com'}
];

var currentId = 2;


app.use(express.static(__dirname + "/"))

var server = http.createServer(app)
server.listen(port)

console.log("http server listening on %d", port)

var wss = new WebSocketServer({server: server})
console.log("websocket server created")


//antonio:
app.get('/contacts', function(req, res) {
    res.send({ contacts: contacts });
});

app.post('/contacts', function(req, res) {
    var contactFirstName = req.body.firstName;
    var contactLastName = req.body.lastName;
    var contactEmail = req.body.email;
    currentId++;

    contacts.push({
        id: currentId,
        firstName: contactFirstName,
        lastName: contactLastName,
        email: contactEmail,

    });

    res.send('Successfully created contact!');
});

app.put('/contacts/:id', function(req, res) {
    var id = req.params.id;
    var newFirstName = req.body.newFirstName;
    var newLastName = req.body.newLastName;
    var newEmail = req.body.newEmail;

    var found = false;

    contacts.forEach(function(contact, index) {
        if (!found && contact.id === Number(id)) {
            contact.firstName = newFirstName;
        	contact.lastName = newLastName;
        	contact.email = newEmail;
        }
    });

    res.send('Succesfully updated product!');
});

app.delete('/contacts/:id', function(req, res) {
    var id = req.params.id;

    var found = false;

    contacts.forEach(function(contact, index) {
        if (!found && contact.id === Number(id)) {
            contacts.splice(index, 1);
        }
    });

    res.send('Successfully deleted contact!');
});


wss.on("connection", function(ws) {
  var id = setInterval(function() {
    ws.send(JSON.stringify(new Date()), function() {  })
  }, 1000)

  console.log("websocket connection open")

  ws.on("close", function() {
    console.log("websocket connection close")
    clearInterval(id)
  })
})
