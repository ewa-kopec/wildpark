import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import db from './db/database.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 5000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Home
app.get('/', (req, res) => {
  db.all('SELECT * FROM habitats', (err, habitats) => {
    if (err) return res.status(500).send('Database error');
    res.render('index', { title: 'Home', habitats });
  });
});

// Habitats list
app.get('/habitats', (req, res) => {
  db.all('SELECT * FROM habitats', (err, habitats) => {
    if (err) return res.status(500).send('Database error');
    res.render('habitats', { title: 'Habitats', habitats });
  });
});

// Single habitat with exhibits
app.get('/habitats/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM habitats WHERE id = ?', [id], (err, habitat) => {
    if (err || !habitat) return res.status(404).render('404', { title: 'Not Found' });
    db.all('SELECT * FROM exhibits WHERE habitat_id = ?', [id], (err2, exhibits) => {
      if (err2) return res.status(500).send('Database error');
      res.render('habitat-detail', { title: habitat.name, habitat, exhibits });
    });
  });
});

// FAQ
app.get('/faq', (req, res) => {
  res.render('faq', { title: 'FAQ' });
});

// Contact GET
app.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact Us', success: false, errors: [] });
});

// Contact POST
app.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) errors.push('Please enter your full name (at least 2 characters).');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Please enter a valid email address.');
  if (!subject || subject.trim().length < 3) errors.push('Please enter a subject.');
  if (!message || message.trim().length < 10) errors.push('Message must be at least 10 characters.');

  if (errors.length > 0) {
    return res.render('contact', { title: 'Contact Us', success: false, errors });
  }

  db.run(
    'INSERT INTO contacts (name, email, subject, message) VALUES (?, ?, ?, ?)',
    [name.trim(), email.trim(), subject.trim(), message.trim()],
    (err) => {
      if (err) return res.status(500).send('Database error');
      res.render('contact', { title: 'Contact Us', success: true, errors: [] });
    }
  );
});

// 404 fallback
app.use((req, res) => {
  res.status(404).render('404', { title: 'Page Not Found' });
});

app.listen(PORT, () => {
  console.log(`🦁 Wildscape Park is running at http://localhost:${PORT}`);
});