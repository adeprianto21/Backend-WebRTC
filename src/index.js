require('dotenv').config();

const express = require('express');

const app = express();

app.use(express.urlencoded({ extended: false }));

app.use(express.json());

app.listen(process.env.PORT, () => {
  console.log(`Server is listening to port ${process.env.PORT}`);
});
