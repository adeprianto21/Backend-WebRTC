require('dotenv').config();

const express = require('express');
const app = express();
const cors = require('cors');
const passport = require('passport');
const http = require('http');
const server = http.createServer(app);
const socket = require('socket.io');
const io = socket(server);
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const productRoutes = require('./routes/product');

require('./config/passport')(passport);

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads', 'images'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);

app.use('/user', userRoutes);

app.use('/admin', adminRoutes);

// app.use('/product/image', express.static(__dirname + ))

app.use('/product', productRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const msg = error.message;
  return res.status(status).json({ success: false, msg });
});

const users = {};

io.on('connection', (socket) => {
  if (!users[socket.id]) {
    users[socket.id] = socket.id;
    console.log(`User ${socket.id} Connected`);
  }

  socket.emit('yourID', socket.id);

  io.sockets.emit('allUsers', users);

  socket.on('disconnect', () => {
    console.log(`User ${socket.id} Disconnected`);
    delete users[socket.id];
    io.sockets.emit('allUsers', users);
  });

  socket.on('callUser', (data) => {
    console.log('hey');
    io.to(data.userToCall).emit('hey', {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on('acceptCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal);
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is listening to port ${process.env.PORT}`);
});
