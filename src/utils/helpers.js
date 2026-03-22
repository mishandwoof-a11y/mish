export const MAXIMOS = { proteina: 50, grasa: 30, humedad: 20 }

export function formatoPrecio(n) {
  return '$' + Number(n).toLocaleString('es-AR')
}

export function renderEstrellas(n) {
  const l = Math.max(0, Math.min(5, Math.round(n)))
  return '★'.repeat(l) + '☆'.repeat(5 - l)
}

export function barraColor(campo) {
  return { proteina: 'var(--color-primary)', grasa: '#f0a500', humedad: '#5ab4d6' }[campo]
    || 'var(--color-primary)'
}
