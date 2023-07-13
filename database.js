// const { Pool } = require("pg");
const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// });

// pool.connect((err) => {
//   if (err) throw err;
//   console.log("Connect to PostgreSQL successfully!");
// });
const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  logging: false, // Establece en console.log para ver las consultas SQL en bruto
  dialect: "postgres",
  dialectModule: require("pg"),
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});
const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const { Dog, Temperament } = sequelize.models;

///////// Las RELACIONES de muchos a muchos mediante una TABLA INTERMEDIA
Dog.belongsToMany(Temperament, {
  through: "temperaments_dog",
});
Temperament.belongsToMany(Dog, {
  through: "temperaments_dog",
});
/////////

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};

// module.exports = pool;
