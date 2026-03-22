import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { PRODUCTOS } from '../data/products'
import * as XLSX from 'xlsx'
import {
  collection,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from 'firebase/firestore'

export function useProducts() {
  const [productosUsuario, setProductosUsuario] = useState([])
  const [productosEditados, setProductosEditados] = useState({})

  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'productos'), (snap) => {
      setProductosUsuario(snap.docs.map(d => ({ ...d.data(), id: d.id })))
    })
    const unsubEdits = onSnapshot(collection(db, 'productosEditados'), (snap) => {
      const edits = {}
      snap.docs.forEach(d => { edits[d.id] = d.data() })
      setProductosEditados(edits)
    })
    return () => { unsubProducts(); unsubEdits() }
  }, [])

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

  async function agregarProducto(datos) {
    await addDoc(collection(db, 'productos'), {
      userAdded: true,
      ingredientes: '',
      ...datos,
    })
  }

  async function editarProducto(id, datos) {
    if (id.startsWith('base_')) {
      await setDoc(doc(db, 'productosEditados', id), datos)
    } else {
      await updateDoc(doc(db, 'productos', id), datos)
    }
  }

  async function eliminarProducto(id) {
    await deleteDoc(doc(db, 'productos', id))
  }

  function importarExcel(file, onDone) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const wb    = XLSX.read(e.target.result, { type: 'array' })
        const ws    = wb.Sheets[wb.SheetNames[0]]
        const filas = XLSX.utils.sheet_to_json(ws, { defval: '' })
        const result = await procesarFilas(filas)
        onDone(result)
      } catch {
        onDone({ error: 'Error al leer el archivo Excel. Asegurate de usar la plantilla correcta.' })
      }
    }
    reader.readAsArrayBuffer(file)
  }

  async function procesarFilas(filas) {
    let agregados = 0, duplicados = 0, errores = 0
    const baseKeys = new Set(PRODUCTOS.map(p => `${p.marca}|${p.nombre}|${p.mascota}`.toLowerCase()))
    const userKeys = new Set(productosUsuario.map(p => `${p.marca}|${p.nombre}|${p.mascota}`.toLowerCase()))
    const promesas = []

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

      const nuevo = {
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
        _rowIdx:      rowIdx,
      }
      userKeys.add(key)
      promesas.push(addDoc(collection(db, 'productos'), nuevo))
      agregados++
    })

    await Promise.all(promesas)

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
