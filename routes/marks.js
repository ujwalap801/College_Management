const express = require('express');
const router = express.Router();
const db = require('../db');

const markSchema = require('../validators/markSchema');

// View all marks for a student (updated)
router.get('/view/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  const marksQuery = `
    SELECT m.id, m.marks, m.course_id, c.name AS course_name, c.code
    FROM marks m
    JOIN courses c ON m.course_id = c.id
    WHERE m.student_id = ?
  `;

  const coursesQuery = 'SELECT * FROM courses';

  db.query(marksQuery, [studentId], (err, marks) => {
    if (err) return res.status(500).send('Error retrieving marks');

    db.query(coursesQuery, (err2, courses) => {
      if (err2) return res.status(500).send('Error loading courses');

      res.render('marks/view', {
        studentId,
        marks,
        allCourses: courses 
      });
    });
  });
});


// Show form to add marks
// router.get('/:studentId', (req, res) => {
//   const studentId = req.params.studentId;

//   db.query('SELECT * FROM courses', (err, courses) => {
//     if (err) return res.status(500).send('Error loading courses');
//     res.render('marks/add', { studentId, courses });
//   });
// });

// Show form to add marks
router.get('/:studentId', (req, res) => {
  const studentId = req.params.studentId;

  db.query('SELECT * FROM courses', (err, courses) => {
    if (err) return res.status(500).send('Error loading courses');
    res.render('marks/add', {
      studentId,
      courses,
      formData: {},
      errorMessage: null
    });
  });
});

// Submit new marks
// router.post('/:studentId', (req, res, next) => {
//   const studentId = req.params.studentId;
//   const { course_id, marks } = req.body;

//   const { error } = markSchema.validate({ course_id, marks });
//   if (error) {
//     const err = new Error('Validation Error: ' + error.details[0].message);
//     err.status = 400;
//     err.view = 'marks/add';
//     err.data = { studentId, courses: [], formData: { course_id, marks } };
//     return next(err);
//   }

//   db.query(
//     'INSERT INTO marks (student_id, course_id, marks) VALUES (?, ?, ?)',
//     [studentId, course_id, marks],
//     (err) => {
//       if (err) return res.status(500).send('Failed to save marks');
//       res.redirect('/marks/view/' + studentId);
//     }
//   );
// });


// Submit new marks
router.post('/:studentId', (req, res) => {
  const studentId = req.params.studentId;
  const { course_id, marks } = req.body;

  const { error } = markSchema.validate({ course_id, marks });

  if (error) {
    db.query('SELECT * FROM courses', (err2, courses) => {
      if (err2) return res.status(500).send('Error loading courses');

      return res.status(400).render('marks/add', {
        studentId,
        courses,
        formData: { course_id, marks },
        errorMessage: error.details[0].message
      });
    });
    return;
  }

  db.query(
    'INSERT INTO marks (student_id, course_id, marks) VALUES (?, ?, ?)',
    [studentId, course_id, marks],
    (err) => {
      if (err) return res.status(500).send('Failed to save marks');
      res.redirect('/marks/view/' + studentId);
    }
  );
});


// Show Edit Form
router.get('/edit/:id', (req, res) => {
  const markId = req.params.id;

  db.query('SELECT * FROM marks WHERE id = ?', [markId], (err, results) => {
    if (err || results.length === 0) return res.status(404).send('Mark not found');

    const mark = results[0];

    db.query('SELECT * FROM courses', (err2, courses) => {
      if (err2) return res.status(500).send('Error loading courses');
      res.render('marks/edit', { mark, courses });
    });
  });
});

// Submit Edit
router.post('/edit/:id', (req, res, next) => {
  const markId = req.params.id;
  const { course_id, marks } = req.body;

  const { error } = markSchema.validate({ course_id, marks });
  if (error) {
    const err = new Error('Validation Error: ' + error.details[0].message);
    err.status = 400;
    err.view = 'marks/edit';
    err.data = { mark: { id: markId, course_id, marks }, courses: [] };
    return next(err);
  }

  db.query('SELECT student_id FROM marks WHERE id = ?', [markId], (err, results) => {
    if (err || results.length === 0) return res.status(404).send('Mark not found');
    const studentId = results[0].student_id;

    db.query(
      'UPDATE marks SET course_id = ?, marks = ? WHERE id = ?',
      [course_id, marks, markId],
      (err2) => {
        if (err2) return res.status(500).send('Failed to update mark');
        res.redirect('/marks/view/' + studentId);
      }
    );
  });
});


//  Delete mark
router.get('/delete/:id', (req, res) => {
  const markId = req.params.id;

  db.query('SELECT student_id FROM marks WHERE id = ?', [markId], (err, results) => {
    if (err || results.length === 0) return res.status(404).send('Mark not found');
    
    const studentId = results[0].student_id;

    db.query('DELETE FROM marks WHERE id = ?', [markId], (err2) => {
      if (err2) return res.status(500).send('Failed to delete mark');
      res.redirect('/marks/view/' + studentId);
    });
  });
});

module.exports = router;
