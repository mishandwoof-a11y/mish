import { useState, useEffect } from 'react'

const EMPTY = {
  mascota: 'perro', imagen: '', marca: '', nombre: '',
  precio_kg: '', proteina: '', grasa: '', humedad: '',
  sabor: '', tamano_bolso: '', tamano: '', estrellas: 5,
}

export default function ProductFormModal({ editando, onGuardar, onCerrar }) {
  const [form, setForm]           = useState(EMPTY)
  const [imgTab, setImgTab]       = useState('url')
  const [imgPreview, setImgPreview] = useState('')
  const [imagenActual, setImagenActual] = useState('')

  const esEditar = !!editando

  useEffect(() => {
    if (editando) {
      setForm({
        mascota:      editando.mascota     || 'perro',
        imagen:       editando.imagen      || '',
        marca:        editando.marca       || '',
        nombre:       editando.nombre      || '',
        precio_kg:    editando.precio_kg   || '',
        proteina:     editando.proteina    || '',
        grasa:        editando.grasa       || '',
        humedad:      editando.humedad     || '',
        sabor:        editando.sabor       || '',
        tamano_bolso: editando.tamano_bolso || '',
        tamano:       editando.tamano      || '',
        estrellas:    editando.estrellas   || 5,
      })
      const img = editando.imagen || ''
      setImagenActual(img)
      setImgPreview(img)
      setImgTab(img.startsWith('data:') ? 'file' : 'url')
    } else {
      setForm(EMPTY)
      setImagenActual('')
      setImgPreview('')
      setImgTab('url')
    }
  }, [editando])

  function set(key, val) {
    setForm(f => ({ ...f, [key]: val }))
  }

  function handleUrlChange(e) {
    const url = e.target.value.trim()
    set('imagen', url)
    setImagenActual(url)
    setImgPreview(url)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      setImagenActual(ev.target.result)
      setImgPreview(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  function handleSubmit(e) {
    e.preventDefault()
    const datos = {
      mascota:      form.mascota,
      imagen:       imagenActual || form.imagen,
      marca:        form.marca.trim(),
      nombre:       form.nombre.trim(),
      precio_kg:    parseFloat(form.precio_kg)    || 0,
      proteina:     parseFloat(form.proteina)     || 0,
      grasa:        parseFloat(form.grasa)        || 0,
      humedad:      parseFloat(form.humedad)      || 0,
      sabor:        form.sabor.trim(),
      tamano_bolso: parseFloat(form.tamano_bolso) || null,
      tamano:       form.tamano.trim(),
      estrellas:    parseInt(form.estrellas)      || 5,
    }
    onGuardar(datos)
  }

  return (
    <div className="modal" style={{ display: 'flex' }} onClick={e => { if (e.target === e.currentTarget) onCerrar() }}>
      <div className="modal__box">
        <div className="modal__header">
          <h2 className="modal__title">{esEditar ? 'Editar producto' : 'Agregar producto'}</h2>
          <button className="modal__close" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>

        <form className="product-form" onSubmit={handleSubmit}>
          {/* Mascota */}
          <div className="form-group">
            <label className="form-label">Mascota</label>
            <select className="form-input form-select" value={form.mascota} onChange={e => set('mascota', e.target.value)}>
              <option value="perro">🐶 Perro</option>
              <option value="gato">🐱 Gato</option>
            </select>
          </div>

          {/* Imagen */}
          <div className="form-group">
            <label className="form-label">Imagen</label>
            <div className="form-img-tabs">
              <button type="button" className={`img-tab${imgTab === 'url' ? ' img-tab--active' : ''}`} onClick={() => setImgTab('url')}>URL</button>
              <button type="button" className={`img-tab${imgTab === 'file' ? ' img-tab--active' : ''}`} onClick={() => setImgTab('file')}>Subir foto</button>
            </div>
            {imgTab === 'url' ? (
              <input className="form-input" type="url" placeholder="https://..." value={form.imagen} onChange={handleUrlChange} />
            ) : (
              <>
                <input className="form-input" type="file" accept="image/*" onChange={handleFileChange} />
                <p className="form-hint">JPG, PNG, WebP — max 2 MB</p>
              </>
            )}
            {imgPreview && (
              <div className="form-img-preview">
                <img src={imgPreview} alt="Preview"
                  onError={e => { e.target.parentElement.innerHTML = '<span class="preview-error">No se pudo cargar la imagen</span>' }} />
              </div>
            )}
          </div>

          {/* Marca */}
          <div className="form-group">
            <label className="form-label">Marca *</label>
            <input className="form-input" required value={form.marca} onChange={e => set('marca', e.target.value)} placeholder="Royal Canin" />
          </div>

          {/* Nombre */}
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="form-input" required value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Adult Medium Breed" />
          </div>

          {/* Precio */}
          <div className="form-group">
            <label className="form-label">Precio /kg *</label>
            <input className="form-input" required type="number" min="0" step="1" value={form.precio_kg} onChange={e => set('precio_kg', e.target.value)} placeholder="12500" />
          </div>

          {/* Estrellas */}
          <div className="form-group">
            <label className="form-label">Estrellas</label>
            <select className="form-input form-select" value={form.estrellas} onChange={e => set('estrellas', e.target.value)}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ★</option>)}
            </select>
          </div>

          {/* Proteína */}
          <div className="form-group">
            <label className="form-label">Proteína %</label>
            <input className="form-input" type="number" min="0" max="100" step="0.1" value={form.proteina} onChange={e => set('proteina', e.target.value)} placeholder="28" />
          </div>

          {/* Grasa */}
          <div className="form-group">
            <label className="form-label">Grasa %</label>
            <input className="form-input" type="number" min="0" max="100" step="0.1" value={form.grasa} onChange={e => set('grasa', e.target.value)} placeholder="14" />
          </div>

          {/* Humedad */}
          <div className="form-group">
            <label className="form-label">Humedad %</label>
            <input className="form-input" type="number" min="0" max="100" step="0.1" value={form.humedad} onChange={e => set('humedad', e.target.value)} placeholder="10" />
          </div>

          {/* Sabor */}
          <div className="form-group">
            <label className="form-label">Sabor</label>
            <input className="form-input" value={form.sabor} onChange={e => set('sabor', e.target.value)} placeholder="Pollo" />
          </div>

          {/* Bolso */}
          <div className="form-group">
            <label className="form-label">Tamaño bolso (kg)</label>
            <input className="form-input" type="number" min="0" step="0.5" value={form.tamano_bolso} onChange={e => set('tamano_bolso', e.target.value)} placeholder="15" />
          </div>

          {/* Tamaño / Raza */}
          <div className="form-group form-group--full">
            <label className="form-label">Raza / Tamaño dirigido</label>
            <input className="form-input" value={form.tamano} onChange={e => set('tamano', e.target.value)} placeholder="Razas medianas (11–25 kg)" />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn--secondary" onClick={onCerrar}>Cancelar</button>
            <button type="submit" className="btn btn--primary">
              {esEditar ? 'Guardar cambios' : 'Agregar producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
