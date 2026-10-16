import React from 'react';
import { ProductCard } from './ProductCard';

export function ProductList({ productos }) {
  if (productos.length === 0) {
    return <p className="no-products">No se encontraron productos con ese criterio.</p>;
  }

  return (
    <div className="product-grid">
      {productos.map((prod) => (
        <ProductCard key={prod.id} producto={prod} />
      ))}
    </div>
  );
}