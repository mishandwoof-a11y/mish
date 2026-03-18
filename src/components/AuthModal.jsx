import { useState } from 'react'

export default function AuthModal({ tabInicial = 'login', onLogin, onRegister, onLoginAdmin, onCerrar }) {
  const [tab, setTab]             = useState(tabInicial)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPass, setLoginPass]   = useState('')
  const [loginError, setLoginError] = useState('')

  const [regNombre, setRegNombre]     = useState('')
  const [regEmail, setRegEmail]       = useState('')
  const [regPass, setRegPass]         = useState('')
  const [regMascota, setRegMascota]   = useState('perro')
  const [regTelefono, setRegTelefono] = useState('')
  const [regError, setRegError]       = useState('')

  const [adminPass, setAdminPass]   = useState('')
  const [adminError, setAdminError] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    const err = onLogin(loginEmail, loginPass)
    if (err) setLoginError(err)
    else onCerrar()
  }

  function handleRegister(e) {
    e.preventDefault()
    const err = onRegister(regNombre, regEmail, regPass, regMascota, regTelefono)
    if (err) setRegError(err)
    else onCerrar()
  }

  function handleAdmin(e) {
    e.preventDefault()
    const err = onLoginAdmin(adminPass)
    if (err) setAdminError(err)
    else onCerrar()
  }

  function cambiarTab(t) {
    setTab(t)
    setLoginError(''); setRegError(''); setAdminError('')
  }

  return (
    <div className="modal" style={{ display: 'flex' }} onClick={e => { if (e.target === e.currentTarget) onCerrar() }}>
      <div className="modal__box modal__box--auth">
        <div className="modal__header">
          <h2 className="modal__title">Acceso</h2>
          <button className="modal__close" onClick={onCerrar} aria-label="Cerrar">✕</button>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab${tab === 'login'    ? ' auth-tab--active' : ''}`} onClick={() => cambiarTab('login')}>Ingresar</button>
          <button className={`auth-tab${tab === 'register' ? ' auth-tab--active' : ''}`} onClick={() => cambiarTab('register')}>Registrarse</button>
          <button className={`auth-tab auth-tab--admin${tab === 'admin' ? ' auth-tab--active' : ''}`} onClick={() => cambiarTab('admin')} title="Acceso administrador">⚙</button>
        </div>

        {/* Login */}
        {tab === 'login' && (
          <div className="auth-panel">
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" required value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="tu@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input className="form-input" type="password" required value={loginPass} onChange={e => setLoginPass(e.target.value)} />
              </div>
              {loginError && <p className="auth-error">{loginError}</p>}
              <div className="form-actions">
                <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>Ingresar</button>
              </div>
            </form>
          </div>
        )}

        {/* Register */}
        {tab === 'register' && (
          <div className="auth-panel">
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="form-group">
                <label className="form-label">Nombre</label>
                <input className="form-input" required value={regNombre} onChange={e => setRegNombre(e.target.value)} placeholder="Tu nombre" />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="form-input" type="email" required value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="tu@email.com" />
              </div>
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input className="form-input" type="password" required minLength={4} value={regPass} onChange={e => setRegPass(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Tengo un...</label>
                <select className="form-input form-select" value={regMascota} onChange={e => setRegMascota(e.target.value)}>
                  <option value="perro">🐶 Perro</option>
                  <option value="gato">🐱 Gato</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Teléfono (opcional)</label>
                <input className="form-input" type="tel" value={regTelefono} onChange={e => setRegTelefono(e.target.value)} placeholder="+54 351..." />
              </div>
              {regError && <p className="auth-error">{regError}</p>}
              <div className="form-actions">
                <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>Crear cuenta</button>
              </div>
            </form>
          </div>
        )}

        {/* Admin */}
        {tab === 'admin' && (
          <div className="auth-panel">
            <p className="auth-admin-hint">Ingresá la contraseña de administrador</p>
            <form className="auth-form" onSubmit={handleAdmin}>
              <div className="form-group">
                <label className="form-label">Contraseña admin</label>
                <input className="form-input" type="password" required value={adminPass} onChange={e => setAdminPass(e.target.value)} />
              </div>
              {adminError && <p className="auth-error">{adminError}</p>}
              <div className="form-actions">
                <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>Acceder</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
