const express = require('express');
const app = express();
const path = require('path');
const db = require('./db');
const studentRoutes = require('./routes/students');
const courseRoutes = require('./routes/courses');
const facultyRoutes = require('./routes/faculty');
const marksRoutes = require('./routes/marks');

require("dotenv").config(); 

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => res.render('index'));
app.use('/students', studentRoutes);
app.use('/courses', courseRoutes);
app.use('/faculty', facultyRoutes);
app.use('/marks', marksRoutes);

const port =process.env.PORT ||4000;
app.use((err, req, res, next) => {
  // console.error(err);

  const status = err.status || 500;

  if (err.view) {
    return res.status(status).render(err.view, {
      error: err,
      ...(err.data || {}) // Spread student/id if available
    });
  }

  res.status(status).send(err.message || 'Server Error');
});


app.listen(port, () => console.log('Server running on http://localhost:3000'));


