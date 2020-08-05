require('dotenv').config();

const express = require('express');
const cors = require('cors');
const passport = require('passport');

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

require('./config/passport')(passport);

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());

app.use('/user', userRoutes);

app.use('/admin', adminRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const msg = error.message;
  return res.status(status).json({ success: false, msg });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening to port ${process.env.PORT}`);
});
