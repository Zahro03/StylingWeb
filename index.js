// Import express
const express = require('express');
const session = require('express-session');
const app = express();
const port = 3000;

// Middleware untuk parsing data dari form (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Middleware untuk parsing data JSON
app.use(express.json());

// Set EJS sebagai view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// Menyediakan folder 'public' untuk file statis
app.use(express.static('public'));

// Gunakan session middleware
app.use(session({
  secret: 'your-secret-key',  // Ganti dengan kunci rahasia Anda
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set secure: true jika menggunakan HTTPS
}));

// Middleware untuk memastikan pengguna sudah login
function isAuthenticated(req, res, next) {
  if (req.session.user) {
    return next(); // Lanjutkan ke halaman yang diminta
  } else {
    res.redirect('/login'); // Redirect ke login jika belum login
  }
}

// Menangani GET request ke '/login'
app.get('/login', (req, res) => {
  res.render('login'); // Render login.ejs
});

// Menangani POST request ke '/login'
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Verifikasi data login
  if (username === 'admin' && password === 'admin123') {
    // Menyimpan informasi pengguna dalam sesi
    req.session.user = username;
    res.redirect('/home'); // Arahkan ke halaman home setelah login berhasil
  } else {
    res.send('Login gagal, coba lagi!');
  }
});

// Menangani GET request ke '/home' dengan middleware isAuthenticated
app.get('/home', isAuthenticated, (req, res) => {
  res.render('home'); // Render home.ejs jika pengguna sudah login
});

// Menangani GET request ke '/todo' dengan middleware isAuthenticated
app.get('/todo', isAuthenticated, (req, res) => {
  const todos = [
      { task: 'Belajar EJS', completed: false },
      { task: 'Mengerjakan proyek', completed: true },
      { task: 'Cek email', completed: false }
  ];
  
  res.render('todo', { todos: todos }); // Mengirim data todos ke view
});

// Menangani GET request ke '/signup'
app.get('/signup', (req, res) => {
  res.render('signup'); // Render signup.ejs
});

// Menangani POST request ke '/signup'
app.post('/signup', (req, res) => {
  const { username, password, email } = req.body;

  if (username && password && email) {
    res.send('Sign Up berhasil!'); // Simulasi berhasil Sign Up
  } else {
    res.send('Isi semua data dengan benar.');
  }
});

// Menangani GET request ke '/contact'
app.get('/contact', (req, res) => {
  res.render('contact'); // Render contact.ejs
});

// Menangani POST request ke '/send-message' untuk menangani pengiriman pesan
app.post('/send-message', (req, res) => {
  const { name, email, message } = req.body;

  if (name && email && message) {
    console.log(`Message from ${name} (${email}): ${message}`);
    res.send('Terima kasih telah menghubungi kami! Kami akan segera merespons.');
  } else {
    res.send('Harap isi semua field!');
  }
});

// Menangani GET request ke '/signout' untuk logout
app.get('/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.send('Terjadi kesalahan saat logout.');
    }
    res.redirect('/login'); // Redirect ke halaman login setelah logout
  });
});

// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
