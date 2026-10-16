import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ProductTable } from './components/ProductTable';
import { Search, Plus } from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:3001/api/productos';

function App() {
  // El estado empieza VACÍO: ya no hay datos quemados
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Estados para filtros
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  // Estado del formulario
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    categoria: 'Audio',
    precio: '',
    stock: '',
    descripcion: '',
    imagen_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'
  });

  const [errorServidor, setErrorServidor] = useState(null);

  // 1. Cargar datos reales desde SQL Server al abrir la web
  const cargarProductos = async () => {
    setCargando(true);
    setErrorServidor(null);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`El servidor respondió con código ${res.status}`);
      const data = await res.json();
      setProductos(data);
    } catch (error) {
      console.error('Error al conectar con el servidor:', error);
      setErrorServidor('No se pudo conectar con el servidor (http://localhost:3001). Asegúrate de tener corriendo "npm run server" en tu terminal.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // 2. Guardar en SQL Server y actualizar el estado
  const handleAgregarProducto = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...nuevoProducto,
          precio: parseFloat(nuevoProducto.precio),
          stock: parseInt(nuevoProducto.stock) || 0
        })
      });
      const productoGuardado = await res.json();

      // Agrega el nuevo producto que devolvió la base de datos
      setProductos([productoGuardado, ...productos]);

      // Resetear campos del formulario
      setNuevoProducto({
        nombre: '',
        categoria: 'Audio',
        precio: '',
        stock: '',
        descripcion: '',
        imagen_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80'
      });
    } catch (error) {
      console.error('Error al guardar en la base de datos:', error);
    }
  };

  // 3. Eliminar de SQL Server y actualizar el estado
  const handleEliminar = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setProductos(productos.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  // Obtener categorías dinámicas de los productos que existan en la BD
  const categorias = ['Todas', ...new Set(productos.map((p) => p.categoria || 'Otros'))];

  // Filtrado reactivo en memoria con useState
  const productosFiltrados = productos.filter((prod) => {
    const coincideNombre = prod.nombre?.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaSeleccionada === 'Todas' || prod.categoria === categoriaSeleccionada;
    return coincideNombre && coincideCategoria;
  });

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {/* Formulario que envía a la BD */}
        <section className="form-card">
          <h3><Plus size={20} /> Registrar en SQL Server</h3>
          <form onSubmit={handleAgregarProducto} className="product-form">
            <input
              type="text"
              placeholder="Nombre del producto *"
              required
              value={nuevoProducto.nombre}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
            />
            <select
              value={nuevoProducto.categoria}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
            >
              <option value="Audio">Audio</option>
              <option value="Periféricos">Periféricos</option>
              <option value="Pantallas">Pantallas</option>
              <option value="Otros">Otros</option>
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Precio ($) *"
              required
              value={nuevoProducto.precio}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })}
            />
            <input
              type="number"
              placeholder="Stock *"
              required
              value={nuevoProducto.stock}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })}
            />
            <input
              type="text"
              placeholder="Descripción corta"
              value={nuevoProducto.descripcion}
              onChange={(e) => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })}
            />
            <button type="submit" className="add-btn">Guardar en BD</button>
          </form>
        </section>

        {/* Buscador y Filtros */}
        <div className="filter-bar">
          <div className="search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <div className="category-chips">
            {categorias.map((cat) => (
              <button
                key={cat}
                className={`chip ${categoriaSeleccionada === cat ? 'active' : ''}`}
                onClick={() => setCategoriaSeleccionada(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Mensaje de error si el servidor está apagado */}
        {errorServidor && (
          <div style={{ background: '#fee2e2', color: '#991b1b', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #f87171', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>⚠️ {errorServidor}</span>
            <button onClick={cargarProductos} style={{ background: '#991b1b', color: 'white', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer' }}>Reintentar</button>
          </div>
        )}

        {/* Mensaje mientras carga o la tabla con datos reales */}
        {cargando ? (
          <p className="no-products">Conectando y cargando productos desde Docker...</p>
        ) : (
          <ProductTable productos={productosFiltrados} onEliminar={handleEliminar} />
        )}
      </main>
    </div>
  );
}

export default App;