import { useState } from 'react'
import { PRODUCTOS } from '../data/products'
import * as XLSX from 'xlsx'

const LS_KEY   = 'mishwoof_user_productos'
const LS_EDITS = 'mishwoof_edits'

function loadUserProducts() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || [] }
  catch { return [] }
}
function loadEdits() {
  try { return JSON.parse(localStorage.getItem(LS_EDITS)) || {} }
  catch { return {} }
}

export function useProducts() {
  const [productosUsuario, setProductosUsuario]   = useState(loadUserProducts)
  const [productosEditados, setProductosEditados] = useState(loadEdits)

  function saveUserProducts(list) {
    localStorage.setItem(LS_KEY, JSON.stringify(list))
    setProductosUsuario(list)
  }
  function saveEdits(edits) {
    localStorage.setItem(LS_EDITS, JSON.stringify(edits))
    setProductosEditados(edits)
  }

  /** Devuelve todos los productos (base + usuario) con id y _cmpIdx */
  function getListaCompleta(filtro) {
    const baseConIds = PRODUCTOS.map((p, i) => {
      const id   = 'base_' + i
      const edit = productosEditados[id]
      return edit ? { ...p, ...edit, id, esBase: true } : { ...p, id, esBase: true }
    })
    const todos = [...baseConIds, ...productosUsuario]
    const lista = filtro === 'todos' ? todos : todos.filter(p => p.mascota === filtro)
    return lista.map((p, i) => ({ ...p, _cmpIdx: i }))
  }

  function agregarProducto(datos) {
    const nuevo = {
      id:           Date.now().toString(),
      userAdded:    true,
      ingredientes: '',
      ...datos,
    }
    saveUserProducts([...productosUsuario, nuevo])
  }

  function editarProducto(id, datos) {
    if (id.startsWith('base_')) {
      saveEdits({ ...productosEditados, [id]: { ...datos } })
    } else {
      const lista = productosUsuario.map(p => p.id === id ? { ...p, ...datos } : p)
      saveUserProducts(lista)
    }
  }

  function eliminarProducto(id) {
    saveUserProducts(productosUsuario.filter(p => p.id !== id))
  }

  function importarExcel(file, onDone) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb    = XLSX.read(e.target.result, { type: 'array' })
        const ws    = wb.Sheets[wb.SheetNames[0]]
        const filas = XLSX.utils.sheet_to_json(ws, { defval: '' })
        const result = procesarFilas(filas)
        onDone(result)
      } catch (err) {
        onDone({ error: 'Error al leer el archivo Excel. Asegurate de usar la plantilla correcta.' })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  function procesarFilas(filas) {
    let agregados = 0, duplicados = 0, errores = 0
    const baseKeys = new Set(PRODUCTOS.map(p => `${p.marca}|${p.nombre}|${p.mascota}`.toLowerCase()))
    const userKeys = new Set(productosUsuario.map(p => `${p.marca}|${p.nombre}|${p.mascota}`.toLowerCase()))
    const nuevos = []

    filas.forEach((fila, rowIdx) => {
      const get = (key) => {
        const found = Object.keys(fila).find(k => k.trim().toLowerCase() === key.toLowerCase())
        return found !== undefined ? fila[found] : ''
      }
      const nombre = String(get('Nombre') || '').trim()
      const marca  = String(get('Marca')  || '').trim()
      if (!nombre || !marca) return

      const precioRaw = parseFloat(get('Precio/kg') || 0)
      const protRaw   = parseFloat(get('Proteínas (%)') || get('Proteinas (%)') || get('Proteína (%)') || 0)
      if (isNaN(precioRaw) || precioRaw <= 0 || isNaN(protRaw)) { errores++; return }

      const mascota = normalizarMascota(get('Mascota'))
      const key     = `${marca}|${nombre}|${mascota}`.toLowerCase()
      if (baseKeys.has(key) || userKeys.has(key)) { duplicados++; return }

      const estRaw    = parseInt(get('Estrellas (1-5)') || get('Estrellas (1–5)') || 3)
      const estrellas = Math.max(1, Math.min(5, isNaN(estRaw) ? 3 : estRaw))

      nuevos.push({
        id:           Date.now().toString() + '_' + rowIdx,
        userAdded:    true,
        ingredientes: '',
        mascota,
        marca,
        nombre,
        precio_kg:    precioRaw,
        proteina:     protRaw,
        grasa:        parseFloat(get('Grasas (%)') || 0) || 0,
        humedad:      parseFloat(get('Humedad (%)') || 0) || 0,
        sabor:        String(get('Sabor') || '').trim(),
        tamano_bolso: parseFloat(get('Tamaño bolso (kg)') || '') || null,
        tamano:       String(get('Raza dirigida') || '').trim(),
        estrellas,
        imagen:       '',
      })
      userKeys.add(key)
      agregados++
    })

    if (nuevos.length > 0) saveUserProducts([...productosUsuario, ...nuevos])

    const partes = []
    if (agregados > 0)  partes.push(`${agregados} producto${agregados !== 1 ? 's' : ''} importado${agregados !== 1 ? 's' : ''}`)
    if (duplicados > 0) partes.push(`${duplicados} duplicado${duplicados !== 1 ? 's' : ''} omitido${duplicados !== 1 ? 's' : ''}`)
    if (errores > 0)    partes.push(`${errores} fila${errores !== 1 ? 's' : ''} con errores`)
    return { mensaje: partes.length ? partes.join(' · ') : 'No se encontraron filas válidas.' }
  }

  function descargarPlantilla() {
    const headers = [
      'Mascota', 'Marca', 'Nombre', 'Precio/kg', 'Sabor',
      'Tamaño bolso (kg)', 'Proteínas (%)', 'Grasas (%)',
      'Humedad (%)', 'Raza dirigida', 'Estrellas (1-5)'
    ]
    const ejemplos = [
      ['perro', 'Royal Canin', 'Adult Medium Breed', 12500, 'Pollo', 15, 28, 14, 10, 'Razas medianas (11–25 kg)', 5],
      ['gato', 'Purina Pro Plan', 'Indoor Adult Salmón', 14200, 'Salmón', 7.5, 35, 15, 8, 'Gatos adultos de interior', 5],
    ]
    const ws = XLSX.utils.aoa_to_sheet([headers, ...ejemplos])
    ws['!cols'] = [
      { wch: 8 }, { wch: 16 }, { wch: 24 }, { wch: 10 }, { wch: 14 },
      { wch: 16 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 28 }, { wch: 14 }
    ]
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Productos')
    XLSX.writeFile(wb, 'plantilla-productos.xlsx')
  }

  return {
    getListaCompleta,
    agregarProducto,
    editarProducto,
    eliminarProducto,
    importarExcel,
    descargarPlantilla,
  }
}

function normalizarMascota(val) {
  const s = String(val).trim().toLowerCase()
  if (s === 'gato' || s === 'cat') return 'gato'
  return 'perro'
}
