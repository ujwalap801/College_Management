

CREATE DATABASE IF NOT EXISTS college_db;
USE college_db;

CREATE TABLE students (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  roll_no VARCHAR(50) UNIQUE,
  email VARCHAR(100),
  phone VARCHAR(20),
  department VARCHAR(100),
  year INT
);


CREATE TABLE courses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  code VARCHAR(20) UNIQUE,
  department VARCHAR(100),
  credits INT
);

-- Faculty Table
CREATE TABLE faculty (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100),
  email VARCHAR(100),
  phone VARCHAR(20),
  department VARCHAR(100),
  designation VARCHAR(100)
);

-- Marks Table
CREATE TABLE marks (
  id INT PRIMARY KEY AUTO_INCREMENT,
  student_id INT,
  course_id INT,
  marks INT,
  FOREIGN KEY (student_id) REFERENCES students(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);