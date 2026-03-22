import { useEffect, useRef } from 'react'
import {
  Chart,
  BarController,
  CategoryScale, LinearScale, BarElement,
  Tooltip, Legend
} from 'chart.js'
import { formatoPrecio, renderEstrellas } from '../utils/helpers'

Chart.register(BarController, CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function ganador(v1, v2, lowerBetter = false) {
  if (v1 == null || v2 == null || v1 === v2) return null
  return lowerBetter ? (v1 < v2 ? 1 : 2) : (v1 > v2 ? 1 : 2)
}

function ImgOrPlaceholder({ p }) {
  const emoji = p.mascota === 'perro' ? '🐶' : '🐱'
  if (p.imagen) {
    return (
      <img className="cmp-product__img" src={p.imagen} alt={p.nombre}
        onError={e => { e.target.outerHTML = `<div class="cmp-product__placeholder">${emoji}</div>` }} />
    )
  }
  return <div className="cmp-product__placeholder">{emoji}</div>
}

function Celda({ val, isWinner }) {
  return (
    <td className={isWinner ? 'winner' : ''}>
      {val}{isWinner && <span className="winner-crown" title="Mejor valor"> 👑</span>}
    </td>
  )
}

export default function ComparisonModal({ p1, p2, onCerrar }) {
  const chartRef    = useRef(null)
  const chartInst   = useRef(null)

  useEffect(() => {
    if (!p1 || !p2 || !chartRef.current) return
    // Chart.js v4 + React 18 StrictMode: destruir cualquier chart atado al canvas antes de crear uno nuevo
    const existing = Chart.getChart(chartRef.current)
    if (existing) existing.destroy()
    if (chartInst.current) { chartInst.current.destroy(); chartInst.current = null }

    chartInst.current = new Chart(chartRef.current, {
      type: 'bar',
      data: {
        labels: ['Proteína %', 'Grasa %', 'Humedad %'],
        datasets: [
          {
            label: p1.nombre,
            data: [p1.proteina ?? 0, p1.grasa ?? 0, p1.humedad ?? 0],
            backgroundColor: '#3FB498',
            borderRadius: 8,
            borderSkipped: false,
          },
          {
            label: p2.nombre,
            data: [p2.proteina ?? 0, p2.grasa ?? 0, p2.humedad ?? 0],
            backgroundColor: '#7d8fa3',
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.parsed.y}%` } },
        },
        scales: {
          x: { grid: { display: false }, ticks: { font: { weight: '600' } } },
          y: {
            beginAtZero: true, max: 60,
            grid: { color: '#dce3e7' },
            ticks: { callback: v => v + '%', font: { size: 11 } },
          },
        },
      },
    })

    return () => { if (chartInst.current) { chartInst.current.destroy(); chartInst.current = null } }
  }, [p1, p2])

  if (!p1 || !p2) return null

  const gPrecio    = ganador(p1.precio_kg, p2.precio_kg, true)
  const gProteina  = ganador(p1.proteina,  p2.proteina)
  const gGrasa     = ganador(p1.grasa,     p2.grasa, true)
  const gEstrellas = ganador(p1.estrellas, p2.estrellas)

  return (
    <div className="modal" style={{ display: 'flex' }} onClick={e => { if (e.target === e.currentTarget) onCerrar() }}>
      <div className="modal__box modal__box--wide">
        <div className="modal__header">
          <h2 className="modal__title">Comparación</h2>
          <button className="modal__close" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>
        <div className="compare-body">
          {/* Productos */}
          <div className="cmp-products">
            <div className="cmp-product cmp-product--1">
              <ImgOrPlaceholder p={p1} />
              <p className="cmp-product__brand">{p1.marca}</p>
              <h3 className="cmp-product__name">{p1.nombre}</h3>
            </div>
            <div className="cmp-vs">VS</div>
            <div className="cmp-product cmp-product--2">
              <ImgOrPlaceholder p={p2} />
              <p className="cmp-product__brand">{p2.marca}</p>
              <h3 className="cmp-product__name">{p2.nombre}</h3>
            </div>
          </div>

          {/* Tabla */}
          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Característica</th>
                  <th className="th--p1">{p1.nombre}</th>
                  <th className="th--p2">{p2.nombre}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="row-label">💰 Precio /kg</td>
                  <Celda val={formatoPrecio(p1.precio_kg)} isWinner={gPrecio === 1} />
                  <Celda val={formatoPrecio(p2.precio_kg)} isWinner={gPrecio === 2} />
                </tr>
                <tr>
                  <td className="row-label">🥩 Proteína</td>
                  <Celda val={`${p1.proteina ?? 0}%`} isWinner={gProteina === 1} />
                  <Celda val={`${p2.proteina ?? 0}%`} isWinner={gProteina === 2} />
                </tr>
                <tr>
                  <td className="row-label">🫒 Grasa</td>
                  <Celda val={`${p1.grasa ?? 0}%`} isWinner={gGrasa === 1} />
                  <Celda val={`${p2.grasa ?? 0}%`} isWinner={gGrasa === 2} />
                </tr>
                <tr>
                  <td className="row-label">💧 Humedad</td>
                  <td>{p1.humedad ?? 0}%</td>
                  <td>{p2.humedad ?? 0}%</td>
                </tr>
                <tr>
                  <td className="row-label">🍖 Sabor</td>
                  <td>{p1.sabor || '—'}</td>
                  <td>{p2.sabor || '—'}</td>
                </tr>
                <tr>
                  <td className="row-label">📦 Bolso</td>
                  <td>{p1.tamano_bolso ? `${p1.tamano_bolso} kg` : '—'}</td>
                  <td>{p2.tamano_bolso ? `${p2.tamano_bolso} kg` : '—'}</td>
                </tr>
                <tr>
                  <td className="row-label">🐾 Raza / Tamaño</td>
                  <td>{p1.tamano || '—'}</td>
                  <td>{p2.tamano || '—'}</td>
                </tr>
                <tr>
                  <td className="row-label">⭐ Estrellas</td>
                  <Celda val={renderEstrellas(p1.estrellas)} isWinner={gEstrellas === 1} />
                  <Celda val={renderEstrellas(p2.estrellas)} isWinner={gEstrellas === 2} />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Gráfico */}
          <div className="compare-chart-wrap">
            <h3 className="compare-chart-title">Valores nutricionales</h3>
            <div className="compare-chart-legend">
              <span className="legend-dot legend-dot--1" />{p1.nombre}
              &nbsp;&nbsp;
              <span className="legend-dot legend-dot--2" />{p2.nombre}
            </div>
            <canvas ref={chartRef} />
          </div>
        </div>
      </div>
    </div>
  )
}
