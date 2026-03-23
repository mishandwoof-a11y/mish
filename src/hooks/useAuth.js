import { useState, useEffect } from 'react'
import { auth, db } from '../firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

const ADMIN_PASS = 'admin123'

export function useAuth() {
  const [sesionActual, setSesionActual] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const snap = await getDoc(doc(db, 'usuarios', firebaseUser.uid))
        if (snap.exists()) {
          setSesionActual({ uid: firebaseUser.uid, ...snap.data() })
        } else {
          setSesionActual({ uid: firebaseUser.uid, email: firebaseUser.email, rol: 'usuario' })
        }
      } else {
        // Only clear session if it's not an admin session (admin doesn't use Firebase Auth)
        setSesionActual(prev => (prev?.rol === 'admin' ? prev : null))
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const esAdmin = () => !!(sesionActual && sesionActual.rol === 'admin')

  async function login(email, pass) {
    try {
      await signInWithEmailAndPassword(auth, email, pass)
      return null
    } catch {
      return 'Email o contraseña incorrectos.'
    }
  }

  async function register(nombre, email, pass, mascota, telefono) {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass)
      const perfil = { nombre, email, mascota, telefono, rol: 'usuario' }
      await setDoc(doc(db, 'usuarios', cred.user.uid), perfil)
      setSesionActual({ uid: cred.user.uid, ...perfil })
      return null
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') return 'Ya existe una cuenta con ese email.'
      if (err.code === 'auth/weak-password') return 'La contraseña debe tener al menos 6 caracteres.'
      return 'Error al registrar. Intentá nuevamente.'
    }
  }

  function loginAdmin(pass) {
    if (pass !== ADMIN_PASS) return 'Contraseña incorrecta.'
    setSesionActual({ nombre: 'Administrador', rol: 'admin' })
    return null
  }

  async function logout() {
    if (sesionActual?.rol === 'admin') {
      setSesionActual(null)
    } else {
      await signOut(auth)
    }
  }

  return { sesionActual, esAdmin, login, register, loginAdmin, logout, loading }
}
