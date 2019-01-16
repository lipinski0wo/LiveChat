import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
import socketioJwt from 'socketio-jwt';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';




mongoose
    .connect('mongodb://master_teller:master_teller123@ds137464.mlab.com:37464/teller', { useNewUrlParser: true })
    .then(() => { console.log(`mongoose connected`) })
    .catch(err => console.log(`mongoose errored`))

mongoose.model('Users', new mongoose.Schema({
    email: {
        type: String,
        required: true,
        min: 4,
        max: 120
    },
    hash: {
        type: String,
        required: true,
        min: 2,
        max: 60
    },
    date: {
        type: Date,
        default: Date.now
    }
}));

const Users = mongoose.model('Users');










const options = {
    secret: 'secret',
    timeout: 1000,
    handshake: true
};

const app = express();
const server = http.createServer(app);
const io = socketIo(server);







app.use(bodyParser.json());

app.post('/api/register', (req, res) => {
    Users
        .findOne({ email: req.body.email })
        .then(user => {
            if (user) return res.json({ status: 'error' });
            if (req.body.password1 !== req.body.password2) return res.json({ status: 'error' });
            if (req.body.email.length === 0 || req.body.password1.length === 0) return res.json({ status: 'error' });
            new Users({
                email: req.body.email,
                hash: req.body.password1
            })
                .save()
                .then(saved => {
                    return res.json({ status: 'success' });
                });
        });
});

app.post('/api/login', (req, res) => {
    Users
        .findOne({ email: req.body.email })
        .then(user => {
            if (!user) return res.json({ status: 'error' });
            if (user.hash !== req.body.password) return res.json({ status: 'error' });

            const token = jwt.sign({
                _id: user._id,
                email: user.email,
                hash: user.hash,
                date: user.date
            }, options.secret, { expiresIn: '1h' });
            res.json({ status: 'success', token });
        });
});


server.listen(8080, () => console.log('server listening on port 8080'));

//   app.post('/login', function (req, res) {
//     var profile = {
//       first_name: 'John',
//       last_name: 'Doe',
//       email: 'john@doe.com',
//       id: 123
//     };

//     // We are sending the profile inside the token
//     var token = jwt.sign(profile, options.secret, { expiresInMinutes: 60*5 });

//     res.json({token: token});
//   });

//   server = http.createServer(app);

//   sio = socketIo.listen(server);

//   if (options.handshake) {
//     sio.use(socketio_jwt.authorize(options));

//     sio.sockets.on('echo', function (m) {
//       sio.sockets.emit('echo-response', m);
//     });
//   } else {
//     sio.sockets
//       .on('connection', socketio_jwt.authorize(options))
//       .on('authenticated', function (socket) {
//         socket.on('echo', function (m) {
//           socket.emit('echo-response', m);
//         });
//       });
//   }

//   server.__sockets = [];
//   server.on('connection', function (c) {
//     server.__sockets.push(c);
//   });
//   server.listen(9000, callback);
//   enableDestroy(server);
// };

// exports.stop = function (callback) {
//   sio.close();
//   try {
//     server.destroy();
//   } catch (er) {}
//   callback();
// };