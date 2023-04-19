import express from 'express';
import cors from 'cors';
import mysql from 'mysql';

// Crea una conexión con la base de datos MySQL
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'to-do_test',
});

// Crea una aplicación Express
const app = express();

// Utiliza el middleware cors para permitir solicitudes desde otros dominios
app.use(cors());
// Utiliza el middleware express.json para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());
// Utiliza el middleware express.urlencoded para analizar el cuerpo de las solicitudes en formato URL-encoded
app.use(express.urlencoded({ extended: true }));

// Define una ruta POST para iniciar sesión
app.post('/login', (req, res) => {
  // Obtiene el nombre de usuario y la contraseña del cuerpo de la solicitud
  const { username, password } = req.body;

  // Define una consulta SQL para buscar al usuario en la base de datos
  const query = 'SELECT * FROM users WHERE nombre = ? AND password = ?';
  // Ejecuta la consulta SQL
  con.query(query, [username, password], function (err, result) {
    if (err) throw err;
    // Envía el resultado de la consulta como respuesta
    res.json(result);
  });
});

// Define una ruta POST para guardar una nueva tarea
app.post('/saveTodo', (req, res) => {
  // Obtiene los datos de la tarea del cuerpo de la solicitud
  const { texto, completada, idUser } = req.body;
  const fecha = Date.now();
  // Define una consulta SQL para insertar la nueva tarea en la base de datos
  const query = `INSERT INTO todo (id, texto, fecha, completada, idUser) VALUES (null, '${texto}', ${fecha}, ${completada}, ${idUser})`;

  // Ejecuta la consulta SQL
  con.query(query, function (err, result) {
    if (err) throw err;
    // Envía un mensaje al cliente indicando que la tarea ha sido agregada correctamente
    res.status(200).send({
      messagge: 'Tarea agregada',
    });
  });
});

// Define una ruta POST para actualizar el estado de una tarea
app.post('/update', (req, res) => {
  // Obtiene el estado y el id de la tarea del cuerpo de la solicitud
  const { completada, id } = req.body;
  // Define una consulta SQL para actualizar el estado de la tarea en la base de datos
  const query = 'UPDATE todo SET completada = ? WHERE id = ?';
  // Ejecuta la consulta SQL
  con.query(query, [completada, id], function (err, result) {
    if (err) throw err;
    // Envía un mensaje al cliente indicando que el estado de la tarea ha sido actualizado correctamente
    if (completada == 0) {
      res.status(200).send({
        messagge: 'Tarea lista para llevarse a cabo',
      });
    } else {
      res.status(200).send({
        messagge: 'Tarea completada',
      });
    }
  });
});

// Define una ruta POST para eliminar una tarea
app.post('/deleteTodo', (req, res) => {
  // Obtiene el id de la tarea del cuerpo de la solicitud
  const { id } = req.body;

  // Define una consulta SQL para eliminar la tarea de la base de datos
  const query = 'DELETE FROM todo WHERE id = ?';

  // Ejecuta la consulta SQL
  con.query(query, [id], (err, result) => {
    if (err) throw err;
    // Envía un mensaje al cliente indicando que la tarea ha sido eliminada correctamente
    res.status(200).send({
      messagge: 'Tarea eliminada',
    });
  });
});

// Define una ruta POST para registrar a un nuevo usuario
app.post('/register', (req, res) => {
  // Obtiene el nombre de usuario y la contraseña del cuerpo de la solicitud
  const { username, password } = req.body;

  // Define una consulta SQL para insertar al nuevo usuario en la base de datos
  const query = `INSERT INTO users (id, nombre, password) VALUES (null, '${username}', '${password}')`;

  // Define una consulta SQL para verificar si el usuario ya existe en la base de datos
  const query1 = 'SELECT * FROM users WHERE nombre = ? AND password = ?';
  con.query(query1, [username, password], function (err, result) {
    if (err) throw err;
    if (result.length > 0) {
      // Si el usuario ya existe en la base de datos, envía un mensaje al cliente indicando que el usuario ya existe
      res.status(200).send({
        messagge: 'Ya existe ese usuario',
      });
    } else {
      // Si el usuario no existe en la base de datos, ejecuta la consulta SQL para insertar al nuevo usuario en la base de datos
      con.query(query, (err, result) => {
        if (err) throw err;
        // Envía un mensaje al cliente indicando que el usuario ha sido registrado correctamente
        res.status(200).send({
          messagge: 'Usuario registrado',
        });
      });
    }
  });
});

// Define una ruta GET para obtener la lista de tareas de un usuario
app.get('/obtain', (req, res) => {
  // Obtiene el id del usuario de los parámetros de la solicitud
  const id = req.query.valor as string;
  // Define una consulta SQL para obtener la lista de tareas del usuario de la base de datos
  con.query('SELECT * FROM todo WHERE idUser = ?', [id], (error, results) => {
    if (error) {
      res.status(500).send(error);
    } else {
      // Envía el resultado de la consulta como respuesta
      res.send(results);
    }
  });
});

// Inicia el servidor en el puerto 5000
app.listen(5000, () => {
  console.log('Server started!!');
});