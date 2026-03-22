import { useState } from 'react'

const LS_USUARIOS = 'mishwoof_usuarios'
const LS_SESION   = 'mishwoof_sesion'
const ADMIN_PASS  = 'admin123'

function loadUsuarios() {
  try { return JSON.parse(localStorage.getItem(LS_USUARIOS)) || [] }
  catch { return [] }
}
function loadSesion() {
  try { return JSON.parse(localStorage.getItem(LS_SESION)) || null }
  catch { return null }
}

export function useAuth() {
  const [usuarios, setUsuarios]         = useState(loadUsuarios)
  const [sesionActual, setSesionActual] = useState(loadSesion)

  const esAdmin = () => !!(sesionActual && sesionActual.rol === 'admin')

  function guardarUsuariosLS(list) {
    localStorage.setItem(LS_USUARIOS, JSON.stringify(list))
    setUsuarios(list)
  }
  function guardarSesionLS(sesion) {
    if (sesion) localStorage.setItem(LS_SESION, JSON.stringify(sesion))
    else localStorage.removeItem(LS_SESION)
    setSesionActual(sesion)
  }

  function login(email, pass) {
    const u = usuarios.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === pass
    )
    if (!u) return 'Email o contraseña incorrectos.'
    guardarSesionLS({ nombre: u.nombre, email: u.email, mascota: u.mascota, telefono: u.telefono, rol: 'usuario' })
    return null
  }

  function register(nombre, email, pass, mascota, telefono) {
    if (usuarios.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return 'Ya existe una cuenta con ese email.'
    }
    const lista = [...usuarios, { nombre, email, password: pass, mascota, telefono }]
    guardarUsuariosLS(lista)
    guardarSesionLS({ nombre, email, mascota, telefono, rol: 'usuario' })
    return null
  }

  function loginAdmin(pass) {
    if (pass !== ADMIN_PASS) return 'Contraseña incorrecta.'
    guardarSesionLS({ nombre: 'Administrador', rol: 'admin' })
    return null
  }

  function logout() {
    guardarSesionLS(null)
  }

  return { sesionActual, esAdmin, login, register, loginAdmin, logout }
}
