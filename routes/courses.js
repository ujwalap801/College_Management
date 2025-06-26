const express = require('express');
const router = express.Router();
const db = require('../db');
const courseSchema = require('../validators/courseValidator');

// READ - list all courses
router.get('/', (req, res) => {
  db.query('SELECT * FROM courses', (err, results) => {
    if (err) throw err;
    res.render('courses/index', { courses: results });
  });
});

// CREATE - show add form
router.get('/add', (req, res) => {
  res.render('courses/add', { course: null });
});

// CREATE - handle form submit
router.post('/add', (req, res) => {
  const { error, value } = courseSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(err => err.message);
    return res.status(400).render('courses/add', {
      course: req.body,
      errors
    });
  }

  const { name, code, department, credits } = value;

  db.query('INSERT INTO courses SET ?', { name, code, department, credits }, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).render('courses/add', {
          course: req.body,
          errors: ['Course code must be unique']
        });
      }
      throw err;
    }
    res.redirect('/courses');
  });
});

// UPDATE - show edit form
router.get('/edit/:id', (req, res) => {
  db.query('SELECT * FROM courses WHERE id = ?', [req.params.id], (err, results) => {
    if (err) throw err;
    res.render('courses/edit', { course: results[0], errors: [] });
  });
});

// UPDATE - handle form submit
router.post('/edit/:id', (req, res) => {
  const { error, value } = courseSchema.validate(req.body, { abortEarly: false });

  if (error) {
    const errors = error.details.map(err => err.message);
    return res.status(400).render('courses/edit', {
      course: { ...req.body, id: req.params.id },
      errors
    });
  }

  const { name, code, department, credits } = value;

  db.query('UPDATE courses SET ? WHERE id = ?', [{ name, code, department, credits }, req.params.id], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).render('courses/edit', {
          course: { ...req.body, id: req.params.id },
          errors: ['Course code must be unique']
        });
      }
      throw err;
    }
    res.redirect('/courses');
  });
});

// DELETE
router.get('/delete/:id', (req, res) => {
  db.query('DELETE FROM courses WHERE id = ?', [req.params.id], (err) => {
    if (err) throw err;
    res.redirect('/courses');
  });
});

module.exports = router;
