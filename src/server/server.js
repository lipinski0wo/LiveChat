import express from 'express';
import http from 'http';
import socketIo from 'socket.io';
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

mongoose.model('Conversations', new mongoose.Schema({
    users: {
        type: Array,
        required: true
    },
    talk: [
        {
            _id: {
                type: String,
            },
            text: {
                type: String
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
}));

const Users = mongoose.model('Users');
const Conversations = mongoose.model('Conversations');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const options = {
    secret: 'malina'
}

io.sockets.on('connection', function (socket) {
    // once a client has connected, we expect to get a ping from them saying what room they want to join
    socket.on('room', function ({ token, roomId }, callback1) {
        jwt.verify(token, options.secret, (err, authData) => {
            if (err) {
                callback1('token expired');
            } else {
                socket.join(roomId);
                socket.on('msg', ({ token, msg }, callback2) => {
                    jwt.verify(token, options.secret, (err, authData) => {
                        if (err) {
                            callback2('token expired');
                        } else {
                            Conversations
                                .findById(roomId)
                                .then(conv => {
                                    const newMsg = {
                                        _id: authData._id,
                                        text: msg
                                    }
                                    conv.talk.push(newMsg);
                                    conv.save()
                                        .then(saved => {
                                            callback2(newMsg);
                                            io.sockets.in(roomId).emit('incomming', newMsg);
                                        })
                                        .catch(err => {
                                            callback2('token expired');
                                        })
                                })
                                .catch(err => {
                                    callback2('token expired');
                                })
                        }
                    });
                });
            }
        });




    });
});


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

app.post('/api/getAllUsers', verifyToken, (req, res) => {
    jwt.verify(req.token, options.secret, (err, authData) => {
        if (err) {
            return res.json({ error: 'unauthorized' });
        } else {
            Users
                .find({})
                .then(users => {
                    if (!users) {
                        return res.json({ error: 'no users available' });
                    }
                    return res.json({
                        users: users.filter(user => authData._id !== user._id).map(user => ({ _id: user._id, email: user.email }))
                    });
                })
        }
    })
});

app.post('/api/getConversation', verifyToken, (req, res) => {
    jwt.verify(req.token, options.secret, (err, authData) => {
        if (err) {
            return res.json({ error: 'unauthorized' });
        } else {
            Conversations
                .findOne({ users: { $all: [req.body.friendId, authData._id] } })
                .then(conversation => {
                    if (!conversation) {
                        (new Conversations({
                            users: [req.body.friendId, authData._id]
                        }))
                            .save()
                            .then(newConversation => {
                                if (!newConversation) {
                                    return res.json({ error: '1internal server error' })
                                }
                                return res.json({ conversation: newConversation });
                            })
                            .catch(err => {
                                return res.json({ error: '2internal server error' })
                            });
                    }
                    return res.json({ conversation: { users: conversation.users, _id: conversation._id, talk: conversation.talk } })
                }).catch(err => {
                    // return res.json({ error: '3internal server error' })
                })
        }
    })
});


function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // Split at the space
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1];
        // Set the token
        req.token = bearerToken;
        // Next middleware
        next();
    } else {
        // Forbidden
        res.json({ error: 'unauthorized' });
    }

}

server.listen(8080, () => console.log('server listening on port 8080'));
