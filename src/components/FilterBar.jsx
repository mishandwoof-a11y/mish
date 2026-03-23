export default function FilterBar({
  filtroActual, esAdmin, onFilter, onImportar, onDescargarPlantilla,
  busqueda, onBuscar, orden, onOrden,
}) {
  const filtros = [
    { key: 'todos', label: 'Todos' },
    { key: 'perro', label: '🐶 Perros' },
    { key: 'gato',  label: '🐱 Gatos' },
  ]

  const sortOpts = [
    { key: 'precio',   label: 'Precio ↑' },
    { key: 'proteina', label: 'Proteína ↑' },
  ]

  return (
    <section aria-label="Filtrar y buscar">
      {/* Fila 1: tabs de mascota + botones admin */}
      <div className="filters">
        {filtros.map(f => (
          <button
            key={f.key}
            className={`filter-btn${filtroActual === f.key ? ' active' : ''}`}
            onClick={() => onFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
        <span className="filters__spacer" />
        {esAdmin && (
          <>
            <button className="btn--outline-sm" title="Descargar plantilla Excel" onClick={onDescargarPlantilla}>
              📥 Plantilla
            </button>
            <button className="btn--outline-sm" title="Importar desde Excel" onClick={onImportar}>
              📤 Importar Excel
            </button>
          </>
        )}
      </div>

      {/* Fila 2: búsqueda + sort */}
      <div className="search-sort-bar">
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar por nombre, marca, sabor..."
            value={busqueda}
            onChange={e => onBuscar(e.target.value)}
            aria-label="Buscar productos"
          />
        </div>

        <div className="sort-buttons">
          {sortOpts.map(s => (
            <button
              key={s.key}
              className={`sort-btn${orden === s.key ? ' sort-btn--active' : ''}`}
              onClick={() => onOrden(orden === s.key ? null : s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
