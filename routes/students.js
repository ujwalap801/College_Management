const express = require('express');
const router = express.Router();
const db = require('../db');
const studentSchema = require('../validators/studentSchema');
const validateWithSchema = require('../utils/validate');


// GET: List all students
router.get('/', (req, res) => {
  db.query('SELECT * FROM students', (err, results) => {
    if (err) return res.status(500).send('Database error');
    res.render('students/index', { students: results });
  });
});

// GET: Show add student form
router.get('/add', (req, res) => {
  res.render('students/add', { student: {} });
});

// POST: Add a new student
router.post('/add', (req, res, next) => {
  const student = req.body;

  try {
    validateWithSchema(studentSchema, student, 'students/add');

    // Check for unique roll_no
    db.query('SELECT id FROM students WHERE roll_no = ?', [student.roll_no], (err1, results) => {
      if (err1) return next(err1);
      if (results.length > 0) {
        const err = new Error('Roll No already exists. Please use a different one.');
        err.status = 400;
        err.view = 'students/add';
        err.data = { student };
        return next(err);
      }

      db.query('INSERT INTO students SET ?', student, (err2) => {
        if (err2) return next(err2);
        res.redirect('/students');
      });
    });
  } catch (err) {
    return next(err);
    //  return res.status(err.status || 400).render(err.view, err.data); 
  }
});

// GET: Show edit form
router.get('/edit/:id', (req, res, next) => {
  const id = req.params.id;

  db.query('SELECT * FROM students WHERE id = ?', [id], (err, results) => {
    if (err) return next(err);
    if (results.length === 0) return res.status(404).send('Student not found');

    res.render('students/edit', { student: results[0] });
  });
});

// POST: Update student
router.post('/edit/:id', (req, res, next) => {
  const student = req.body;
  const id = req.params.id;

  try {
    validateWithSchema(studentSchema, student, 'students/edit', { id });

    // Ensure updated roll_no is still unique
    db.query(
      'SELECT id FROM students WHERE roll_no = ? AND id != ?',
      [student.roll_no, id],
      (err1, results) => {
        if (err1) return next(err1);
        if (results.length > 0) {
          const err = new Error('Roll No already exists for another student.');
          err.status = 400;
          err.view = 'students/edit';
          err.data = { student, id };
          return next(err);
        }

        db.query('UPDATE students SET ? WHERE id = ?', [student, id], (err2) => {
          if (err2) return next(err2);
          res.redirect('/students');
        });
      }
    );
  } catch (err) {
    return next(err);
  }
});

// GET: Delete student
router.get('/delete/:id', (req, res, next) => {
  const id = req.params.id;
  db.query('DELETE FROM students WHERE id = ?', [id], (err) => {
    if (err) return next(err);
    res.redirect('/students');
  });
});

module.exports = router;
