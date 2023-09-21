const express = require('express');
const session = require('express-session');
const gameRoutes = require('./app/routes/gameRoutes');

const app = express();

app.use(session({
    secret: 'secret-key',  // Reemplaza esto con una clave secreta de tu elección
    resave: false,
    saveUninitialized: true,
  }));

app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/', gameRoutes);  // Añadir esta línea para manejar la URL raíz
app.use('/game', gameRoutes);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
