import { MAXIMOS, formatoPrecio, renderEstrellas, barraColor } from '../utils/helpers'

function NutriBar({ valor, campo }) {
  const pct = Math.min(((valor || 0) / MAXIMOS[campo]) * 100, 100).toFixed(1)
  return (
    <div className="nutri-bar">
      <div className="nutri-fill" style={{ width: `${pct}%`, background: barraColor(campo) }} />
    </div>
  )
}

export default function ProductCard({ producto, seleccionado, comparacionLlena, esAdmin, onComparar, onEditar, onEliminar }) {
  const p     = producto
  const emoji = p.mascota === 'perro' ? '🐶' : '🐱'

  const infoExtra = [
    p.tamano_bolso ? `📦 Bolso de ${p.tamano_bolso} kg` : null,
    p.sabor        ? `🍖 Sabor: ${p.sabor}`              : null,
    p.tamano       ? `🐾 ${p.tamano}`                    : null,
    p.ingredientes ? `🌿 ${p.ingredientes}`               : null,
  ].filter(Boolean)

  const btnDisabled = comparacionLlena && !seleccionado

  return (
    <article className={`card${seleccionado ? ' card--selected' : ''}`}>
      <div className="card__image-wrap">
        {p.imagen
          ? <img className="card__img" src={p.imagen} alt={p.nombre}
              onError={e => { e.target.outerHTML = `<div class="card__img-placeholder">${emoji}</div>` }} />
          : <div className="card__img-placeholder">{emoji}</div>
        }
        <span className={`card__badge card__badge--${p.mascota}`}>
          {p.mascota === 'perro' ? '🐶 Perro' : '🐱 Gato'}
        </span>
        {esAdmin && (
          <button className="card__edit" onClick={() => onEditar(p.id)} title="Editar producto" aria-label={`Editar ${p.nombre}`}>
            ✏
          </button>
        )}
        {esAdmin && p.userAdded && (
          <button className="card__delete" onClick={() => onEliminar(p.id)} title="Eliminar producto" aria-label={`Eliminar ${p.nombre}`}>
            ✕
          </button>
        )}
      </div>

      <div className="card__body">
        <p className="card__brand">{p.marca}</p>
        <h2 className="card__name">{p.nombre}</h2>
        <p className="card__price">
          {formatoPrecio(p.precio_kg)}<span className="card__price-unit"> /kg</span>
        </p>

        <div className="card__nutri">
          {['proteina', 'grasa', 'humedad'].map(campo => (
            <div className="nutri-row" key={campo}>
              <span className="nutri-label">{campo.charAt(0).toUpperCase() + campo.slice(1)}</span>
              <NutriBar valor={p[campo]} campo={campo} />
              <span className="nutri-value">{p[campo] ?? 0}%</span>
            </div>
          ))}
        </div>

        {infoExtra.length > 0 && (
          <div className="card__info">
            {infoExtra.map((r, i) => <p key={i} className="card__info-row">{r}</p>)}
          </div>
        )}

        <p className="card__rating-label">Valoración Mish&amp;Woof</p>
        <div className="card__stars" aria-label={`${p.estrellas} de 5 estrellas`}>
          {renderEstrellas(p.estrellas)}
        </div>

        <button
          className={`card__compare-btn${seleccionado ? ' card__compare-btn--active' : ''}`}
          disabled={btnDisabled}
          onClick={() => onComparar(p._cmpIdx)}
          aria-label={`Comparar ${p.nombre}`}
        >
          + Comparar
        </button>
      </div>
    </article>
  )
}
