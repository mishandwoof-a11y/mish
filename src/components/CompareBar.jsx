export default function CompareBar({ comparacion, onCancelar }) {
  if (comparacion.length !== 1) return null

  return (
    <div className="compare-bar">
      <span className="compare-bar__icon">⚖</span>
      <span>Seleccionaste <strong>{comparacion[0].nombre}</strong> — elegí otro para comparar</span>
      <button className="compare-bar__cancel" onClick={onCancelar}>Cancelar</button>
    </div>
  )
}
