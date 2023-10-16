const express = require('express');
const ejs = require('ejs');
const fs = require('fs');
const moment = require('moment');
const dotenv = require('dotenv');
const debug = require('debug');
const chalk = require('chalk');
const morgan = require('morgan');

//Puerto de conexion 
const port = process.env.PORT || 3000;

// Cargar variables de entorno desde .env
dotenv.config(dotenv);

const app = express();

// Configurar EJS como motor de plantillas
app.set ('Views', '/Views');
app.set('view engine', 'ejs');
// Usar Morgan para registrar solicitudes HTTP
app.use(morgan('combined'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Ruta para /products
app.get('/Data/products.json', (req, res) => {
    // Leer el contenido de products.json
    fs.readFile('products.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
        return;
      }
      // Parsear el archivo JSON
      const products = JSON.parse(data);  
      // Procesar los productos para calcular el valor actual del stock
      products.forEach(product => {
        product.stockValue = product.product_price * product.product_quantity;
      }); 
      // Renderizar la plantilla EJS
      res.render('products', { products });
    });
  });

  // Ruta para /persons
app.get('/Data/persons.json', (req, res) => {
    // Obtener la fecha y hora actual utilizando moment
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
  
    // Agregar una nueva entrada al archivo access.json
    fs.appendFile('access.json', `${currentTime}\n`, (err) => {
      if (err) {
        console.error(err);
      }
    });
  
    // Leer el contenido de persons.json
    fs.readFile('persons.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error interno del servidor');
        return;
      }
  
      // Parsear el archivo JSON
      const persons = JSON.parse(data);
  
      // Filtrar personas con edad en días superior a 5475
      const filteredPersons = persons.filter(person => {
        const birthDate = moment(person.birthdate, 'YYYY-MM-DD');
        const today = moment();
        const ageInDays = today.diff(birthDate, 'days');
        return ageInDays > 5475;
      });
  
      // Renderizar la plantilla EJS
      res.render('persons', { filteredPersons });
    });
  });

  app.listen(port, () => {
    debug(`La aplicación está escuchando en el puerto ${port}`);
    console.log(`La aplicación está en ejecución en http://localhost:${port}`)});