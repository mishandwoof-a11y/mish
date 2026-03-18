import ProductCard from './ProductCard'

export default function ProductGrid({ lista, comparacion, esAdmin, onComparar, onEditar, onEliminar }) {
  const comparacionLlena = comparacion.length === 2

  if (lista.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-icon">🐾</span>
        <p>No hay productos para mostrar.</p>
      </div>
    )
  }

  const s = lista.length !== 1 ? 's' : ''

  return (
    <>
      <p className="results-count">Mostrando {lista.length} producto{s}</p>
      <div className="grid">
        {lista.map(p => (
          <ProductCard
            key={p.id}
            producto={p}
            seleccionado={comparacion.some(c => c._cmpIdx === p._cmpIdx)}
            comparacionLlena={comparacionLlena}
            esAdmin={esAdmin}
            onComparar={onComparar}
            onEditar={onEditar}
            onEliminar={onEliminar}
          />
        ))}
      </div>
    </>
  )
}
