import { useState, useRef } from 'react'
import { useAuth } from './hooks/useAuth'
import { useProducts } from './hooks/useProducts'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import ProductGrid from './components/ProductGrid'
import CompareBar from './components/CompareBar'
import ComparisonModal from './components/ComparisonModal'
import ProductFormModal from './components/ProductFormModal'
import AuthModal from './components/AuthModal'

export default function App() {
  const { sesionActual, esAdmin, login, register, loginAdmin, logout, loading } = useAuth()
  const { getListaCompleta, agregarProducto, editarProducto, eliminarProducto, importarExcel, descargarPlantilla } = useProducts()

  const [filtro, setFiltro]                 = useState('todos')
  const [comparacion, setComparacion]       = useState([])
  const [showFormModal, setShowFormModal]   = useState(false)
  const [showAuthModal, setShowAuthModal]   = useState(false)
  const [authTab, setAuthTab]               = useState('login')
  const [editandoProducto, setEditandoProducto] = useState(null)
  const [showCmpModal, setShowCmpModal]     = useState(false)
  const xlsxInputRef = useRef(null)

  const lista = getListaCompleta(filtro)

  // ── Filtro ───────────────────────────────────────────────
  function handleFilter(f) {
    setFiltro(f)
    setComparacion([])
    setShowCmpModal(false)
  }

  // ── Comparación ──────────────────────────────────────────
  function toggleComparacion(cmpIdx) {
    const producto = lista.find(p => p._cmpIdx === cmpIdx)
    if (!producto) return

    setComparacion(prev => {
      const yaIdx = prev.findIndex(p => p._cmpIdx === cmpIdx)
      if (yaIdx !== -1) {
        return prev.filter((_, i) => i !== yaIdx)
      }
      if (prev.length >= 2) return prev
      const next = [...prev, producto]
      if (next.length === 2) setShowCmpModal(true)
      return next
    })
  }

  function limpiarComparacion() {
    setComparacion([])
    setShowCmpModal(false)
  }

  // ── Form producto ────────────────────────────────────────
  function abrirFormulario() {
    setEditandoProducto(null)
    setShowFormModal(true)
  }

  function abrirEditar(id) {
    const p = lista.find(p => p.id === id)
    if (!p) return
    setEditandoProducto(p)
    setShowFormModal(true)
  }

  function handleGuardar(datos) {
    if (editandoProducto) {
      editarProducto(editandoProducto.id, datos)
    } else {
      agregarProducto(datos)
    }
    setShowFormModal(false)
    setEditandoProducto(null)
  }

  function handleEliminar(id) {
    if (!window.confirm('¿Eliminar este producto?')) return
    eliminarProducto(id)
  }

  // ── Auth ─────────────────────────────────────────────────
  function abrirLogin() {
    setAuthTab('login')
    setShowAuthModal(true)
  }

  function abrirAdminLogin() {
    setAuthTab('admin')
    setShowAuthModal(true)
  }

  function handleLogout() {
    logout()
    setComparacion([])
    setShowCmpModal(false)
  }

  // ── Excel ────────────────────────────────────────────────
  function handleImportar() {
    xlsxInputRef.current?.click()
  }

  function handleFileExcel(e) {
    const file = e.target.files[0]
    if (!file) return
    e.target.value = ''
    importarExcel(file, ({ mensaje, error }) => {
      alert(error || mensaje)
    })
  }

  const [cmpP1, cmpP2] = comparacion.length === 2 ? comparacion : [comparacion[0], null]

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: '#666' }}>Cargando...</div>

  return (
    <>
      <Header
        sesionActual={sesionActual}
        esAdmin={esAdmin()}
        onLogin={abrirLogin}
        onAdminLogin={abrirAdminLogin}
        onLogout={handleLogout}
      />

      <main className="main">
        {/* Input oculto para Excel */}
        <input
          ref={xlsxInputRef}
          type="file"
          accept=".xlsx,.xls"
          style={{ display: 'none' }}
          onChange={handleFileExcel}
        />

        <FilterBar
          filtroActual={filtro}
          esAdmin={esAdmin()}
          onFilter={handleFilter}
          onImportar={handleImportar}
          onDescargarPlantilla={descargarPlantilla}
        />

        <section className="products" id="productsSection">
          <ProductGrid
            lista={lista}
            comparacion={comparacion}
            esAdmin={esAdmin()}
            onComparar={toggleComparacion}
            onEditar={abrirEditar}
            onEliminar={handleEliminar}
          />
        </section>

        <CompareBar
          comparacion={comparacion}
          onCancelar={limpiarComparacion}
        />
      </main>

      {/* FAB agregar producto */}
      {esAdmin() && (
        <button className="fab" id="fabBtn" onClick={abrirFormulario} aria-label="Agregar producto">
          +
        </button>
      )}

      {/* Modales */}
      {showFormModal && (
        <ProductFormModal
          editando={editandoProducto}
          onGuardar={handleGuardar}
          onCerrar={() => { setShowFormModal(false); setEditandoProducto(null) }}
        />
      )}

      {showCmpModal && cmpP1 && cmpP2 && (
        <ComparisonModal
          p1={cmpP1}
          p2={cmpP2}
          onCerrar={limpiarComparacion}
        />
      )}

      {showAuthModal && (
        <AuthModal
          tabInicial={authTab}
          onLogin={login}
          onRegister={register}
          onLoginAdmin={loginAdmin}
          onCerrar={() => setShowAuthModal(false)}
        />
      )}
    </>
  )
}
