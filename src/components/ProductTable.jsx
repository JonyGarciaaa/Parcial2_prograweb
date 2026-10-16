import React from 'react';
import { Trash2, Star } from 'lucide-react';

export function ProductTable({ productos, onEliminar }) {
  if (productos.length === 0) {
    return <p className="no-products">No hay productos disponibles.</p>;
  }

  return (
    <div className="table-responsive">
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre y Descripción</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((prod) => (
            <tr key={prod.id}>
              <td className="id-cell">#{prod.id}</td>
              <td>
                <img src={prod.imagen_url} alt={prod.nombre} className="table-img" />
              </td>
              <td>
                <strong>{prod.nombre}</strong>
                <p className="table-desc">{prod.descripcion}</p>
              </td>
              <td>
                <span className="table-tag">{prod.categoria}</span>
              </td>
              <td className="table-price">${Number(prod.precio).toFixed(2)}</td>
              <td>
                <span className={`stock-badge ${prod.stock > 10 ? 'in-stock' : 'low-stock'}`}>
                  {prod.stock} unids.
                </span>
              </td>
              <td>
                {prod.destacado ? (
                  <span className="badge-featured"><Star size={14} /> Destacado</span>
                ) : (
                  <span className="badge-standard">Estándar</span>
                )}
              </td>
              <td>
                <button 
                  className="delete-btn" 
                  title="Eliminar producto"
                  onClick={() => onEliminar(prod.id)}
                >
                  <Trash2 size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}