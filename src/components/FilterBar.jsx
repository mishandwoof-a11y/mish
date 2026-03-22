export default function FilterBar({ filtroActual, esAdmin, onFilter, onImportar, onDescargarPlantilla }) {
  const filtros = [
    { key: 'todos', label: 'Todos' },
    { key: 'perro', label: '🐶 Perros' },
    { key: 'gato',  label: '🐱 Gatos' },
  ]

  return (
    <section className="filters" aria-label="Filtrar por mascota">
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
          <button
            className="btn--outline-sm"
            title="Descargar plantilla Excel"
            onClick={onDescargarPlantilla}
          >
            📥 Plantilla
          </button>
          <button
            className="btn--outline-sm"
            title="Importar desde Excel"
            onClick={onImportar}
          >
            📤 Importar Excel
          </button>
        </>
      )}
    </section>
  )
}
