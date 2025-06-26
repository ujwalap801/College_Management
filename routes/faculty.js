const express = require('express');
const router = express.Router();
const db = require('../db');
const facultySchema = require('../validators/facultyValidator');


// READ
router.get('/', (req, res) => {
  db.query('SELECT * FROM faculty', (err, results) => {
    if (err) throw err;
    res.render('faculty/index', { faculty: results });
  });
});

// CREATE - form
router.get('/add', (req, res) => {
  res.render('faculty/add');
});

// CREATE - submit
router.post('/add', (req, res) => {
  const { error, value } = facultySchema.validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message); // Or render with error
  }

  db.query('INSERT INTO faculty SET ?', value, (err) => {
    if (err) throw err;
    res.redirect('/faculty');
  });
});

// UPDATE - form
router.get('/edit/:id', (req, res) => {
  db.query('SELECT * FROM faculty WHERE id = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.render('faculty/edit', { faculty: results[0] });
  });
});

// UPDATE - submit
router.post('/edit/:id', (req, res) => {
  const { error, value } = facultySchema.validate(req.body);
  if (error) {
    // Optional: Re-render form with old data and error message
    return res.status(400).send(error.details[0].message);
  }

  db.query(
    'UPDATE faculty SET ? WHERE id = ?',
    [value, req.params.id],
    (err) => {
      if (err) throw err;
      res.redirect('/faculty');
    }
  );
});

// DELETE
router.get('/delete/:id', (req, res) => {
  db.query('DELETE FROM faculty WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/faculty');
  });
});

module.exports = router;
