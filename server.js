import express from 'express';
import cors from 'cors';
import sql from 'mssql';

const app = express();
app.use(cors());
app.use(express.json());

// Configuración con tu contenedor Docker
const dbConfig = {
  user: 'sa',
  password: 'Password123!',
  server: 'localhost',
  port: 1433,
  database: 'TiendaDB',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// Ruta raíz para evitar el "Cannot GET /"
app.get('/', (req, res) => {
  res.send('<h1>Servidor API activo</h1><p>Los datos están en <a href="/api/productos">/api/productos</a>.</p><p>Para ver tu app web abre: <a href="http://localhost:5173">http://localhost:5173</a></p>');
});

// 1. Obtener todos los productos
app.get('/api/productos', async (req, res) => {
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request().query('SELECT * FROM productos ORDER BY id DESC');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Guardar nuevo producto
app.post('/api/productos', async (req, res) => {
  const { nombre, descripcion, precio, stock, imagen_url, categoria } = req.body;
  try {
    const pool = await sql.connect(dbConfig);
    const result = await pool.request()
      .input('nombre', sql.NVarChar, nombre)
      .input('descripcion', sql.NVarChar, descripcion)
      .input('precio', sql.Decimal(10, 2), precio)
      .input('stock', sql.Int, stock)
      .input('imagen_url', sql.NVarChar, imagen_url)
      .input('categoria', sql.NVarChar, categoria)
      .query(`
        INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url, categoria)
        OUTPUT INSERTED.*
        VALUES (@nombre, @descripcion, @precio, @stock, @imagen_url, @categoria)
      `);
    res.status(201).json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Eliminar producto
app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await sql.connect(dbConfig);
    await pool.request()
      .input('id', sql.Int, id)
      .query('DELETE FROM productos WHERE id = @id');
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3001, () => {
  console.log('Servidor API conectado a SQL Server en http://localhost:3001');
});