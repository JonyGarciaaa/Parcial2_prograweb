import React from 'react';
import { ShoppingCart } from 'lucide-react';

export function ProductCard({ producto }) {
  return (
    <article className="product-card">
      <div className="image-container">
        <img src={producto.imagen_url} alt={producto.nombre} />
        {producto.destacado && <span className="badge">Destacado</span>}
      </div>

      <div className="product-details">
        <span className="category-label">{producto.categoria}</span>
        <h3 className="product-title">{producto.nombre}</h3>
        <p className="product-desc">{producto.descripcion}</p>

        <div className="card-footer">
          <div>
            <span className="price">${producto.precio.toFixed(2)}</span>
            <small className="stock-info">Stock: {producto.stock}</small>
          </div>
          <button className="buy-btn">
            <ShoppingCart size={16} /> Comprar
          </button>
        </div>
      </div>
    </article>
  );
}