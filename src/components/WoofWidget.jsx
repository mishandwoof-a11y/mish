import { useState, useRef, useEffect } from 'react'
import './WoofWidget.css'

// ── Catálogo de recomendaciones ──────────────────────────────────────────────
const CAT = {
  perro: {
    cachorro: {
      pequeno: [
        { n: 'Fawna Cachorro Mordida Pequeña', d: '34% proteína, salmón y pollo.' },
        { n: 'Excelent Puppy Small (Purina)', d: '25% proteína, pollo y arroz.' }
      ],
      mediano: [
        { n: 'Fawna Cachorro Mordida M&G', d: '34% proteína, super premium.' },
        { n: 'Sieger Puppy M&L', d: '30% proteína, 18% grasa.' },
        { n: 'Excelent Puppy M&L (Purina)', d: '25% proteína, pollo y arroz.' }
      ],
      grande: [
        { n: 'Fawna Cachorro Mordida M&G', d: '34% proteína, alto nivel proteico.' },
        { n: 'Sieger Puppy M&L', d: '30% proteína, ideal razas grandes.' }
      ]
    },
    adulto: {
      pequeno: [
        { n: 'Fawna Perro Adulto Mordida Pequeña', d: '33% proteína, croqueta pequeña.' },
        { n: 'Excelent Ad Small (Purina)', d: '24% proteína, económico y completo.' }
      ],
      mediano: [
        { n: 'Fawna Perro Adulto M&G', d: '31% proteína, super premium.' },
        { n: 'Sieger Adult M&L', d: '26% proteína, excelente calidad/precio.' },
        { n: 'Old Prince Equilibrium Adulto', d: 'Pollo y arroz, completo.' }
      ],
      grande: [
        { n: 'Fawna Perro Adulto M&G', d: '31% proteína, razas grandes.' },
        { n: 'Sieger Criadores All In One', d: '28% proteína, 14% grasa.' },
        { n: 'Old Prince Novel Cordero Adulto', d: '32% proteína, sin soja ni TACC.' }
      ]
    },
    senior: {
      pequeno: [
        { n: 'Fawna Perro Adulto Senior', d: '33% proteína, L-carnitina.' },
        { n: 'Excelent Ad +7 (Purina)', d: '24% proteína, para mayores.' }
      ],
      mediano: [
        { n: 'Fawna Perro Adulto Senior', d: '33% proteína, antioxidantes.' },
        { n: 'Sieger Senior +7 M&L', d: '27% proteína, glucosamina.' }
      ],
      grande: [
        { n: 'Sieger Senior +7 M&L', d: '27% proteína, senior razas grandes.' },
        { n: 'Old Prince Novel Cordero Senior', d: '32% proteína, sin alérgenos.' }
      ]
    }
  },
  gato: {
    cachorro: {
      todos: [
        { n: 'Fawna Gato Kitten', d: 'Super premium con salmón.' },
        { n: 'Excelent Kitten (Purina)', d: '35% proteína, muy completo.' }
      ]
    },
    adulto: {
      todos: [
        { n: 'Fawna Gato Adulto', d: '28% proteína, salmón del Pacífico.' },
        { n: 'Excelent Gato Adulto (Purina)', d: '33% proteína, completo.' }
      ],
      castrado: [
        { n: 'Fawna Gato Sterilized', d: '38% proteína, 9% grasa.' },
        { n: 'Excelent Cat Sterilized (Purina)', d: '33% proteína, castrados.' }
      ],
      urinario: [
        { n: 'Fawna Gato Urinario', d: '35% proteína, pH controlado.' },
        { n: 'Excelent Cat Urinary (Purina)', d: '33% proteína, tracto urinario.' }
      ],
      piel: [
        { n: 'Old Prince Novel Cordero Gatos', d: '34% proteína, hipoalergénico.' },
        { n: 'Excelent Cat Skin Care (Purina)', d: 'Omega 3 y 6, piel saludable.' }
      ]
    },
    senior: {
      todos: [
        { n: 'Fawna Gato Adulto', d: 'Antioxidantes, apto mayores.' },
        { n: 'Excelent Gato Adulto (Purina)', d: '33% proteína, completo.' }
      ]
    }
  }
}

const SOBREPESO = [
  { n: 'Fawna Perro Adulto Light', d: '33% proteína, 8% grasa.' },
  { n: 'Old Prince Weight Control', d: '24% proteína, 8% grasa.' }
]

const PIEL_ALERGIA = [
  { n: 'Old Prince Novel Cordero', d: '32% proteína, hipoalergénico.' },
  { n: 'Excelent Skin Care Cordero', d: 'Fórmula suave para piel sensible.' }
]

// ── Helpers de recomendación ─────────────────────────────────────────────────
function normalizarTamano(t) {
  if (!t) return 'mediano'
  if (t.startsWith('Peque')) return 'pequeno'
  if (t.startsWith('Mediano')) return 'mediano'
  return 'grande'
}

function normalizarEspecialGato(e) {
  if (!e) return 'todos'
  if (e.includes('Castrado') || e.includes('Esterilizado')) return 'castrado'
  if (e.includes('urinario')) return 'urinario'
  if (e.includes('Piel')) return 'piel'
  return 'todos'
}

function getRecomendaciones(data) {
  const { especie, edad, tamano, especial } = data
  const edadKey = edad.toLowerCase()

  if (especie === 'Perro') {
    if (especial.includes('Sobrepeso') || especial.includes('sobrepeso')) return SOBREPESO
    if (especial.includes('Piel') || especial.includes('alergias')) return PIEL_ALERGIA
    const tamanoKey = normalizarTamano(tamano)
    return CAT.perro?.[edadKey]?.[tamanoKey] || []
  }

  if (especie === 'Gato') {
    if (edadKey === 'adulto') {
      const espKey = normalizarEspecialGato(especial)
      return CAT.gato.adulto?.[espKey] || CAT.gato.adulto.todos
    }
    return CAT.gato?.[edadKey]?.todos || []
  }

  return []
}

// ── WhatsApp URL builder ─────────────────────────────────────────────────────
function buildWAUrl(data, productos) {
  const paw  = String.fromCodePoint(0x1F43E)
  const dog  = String.fromCodePoint(0x1F436)
  const cat  = String.fromCodePoint(0x1F431)
  const pin  = String.fromCodePoint(0x1F4CD)
  const bag  = String.fromCodePoint(0x1F6CD)
  const star = String.fromCodePoint(0x2B50)
  const pray = String.fromCodePoint(0x1F64F)

  const icono = data.especie === 'Perro' ? dog : cat
  const tamanoLabel = data.tamano || 'No aplica'
  const especialLabel = data.especial || 'Sin necesidades especiales'
  const productosLines = productos.map(p => `${star} ${p.n}`).join('\n')

  const texto =
    `Hola! Consulte el asesor de Mish&Woof ${paw}\n` +
    `\n${icono} Datos de mi mascota:\n` +
    `${pin} Tipo: ${data.especie}\n` +
    `${pin} Raza: ${data.raza}\n` +
    `${pin} Edad: ${data.edad}\n` +
    `${pin} Tamaño: ${tamanoLabel}\n` +
    `${pin} Necesidad especial: ${especialLabel}\n` +
    `\n${bag} Productos sugeridos:\n` +
    `${productosLines}\n` +
    `\nMe pueden dar precios y disponibilidad? Gracias! ${pray}`

  return `https://wa.me/543516322656?text=${encodeURIComponent(texto)}`
}

// ── SVG Pastor Alemán ────────────────────────────────────────────────────────
function DogAvatarFAB() {
  return (
    <svg width="38" height="38" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Orejas externas */}
      <polygon points="22,18 32,50 14,50" fill="#1C1C18"/>
      <polygon points="78,18 68,50 86,50" fill="#1C1C18"/>
      {/* Orejas internas */}
      <polygon points="24,22 31,46 17,46" fill="#8B5010"/>
      <polygon points="76,22 69,46 83,46" fill="#8B5010"/>
      {/* Cabeza */}
      <ellipse cx="50" cy="58" rx="30" ry="28" fill="#C87828"/>
      {/* Zona superior oscura */}
      <ellipse cx="50" cy="46" rx="22" ry="14" fill="#1C1C18"/>
      {/* Pecho/hocico claro */}
      <ellipse cx="50" cy="68" rx="18" ry="14" fill="#E8A040"/>
      {/* Nariz */}
      <ellipse cx="50" cy="66" rx="7" ry="5" fill="#1C1C18"/>
      {/* Ojos */}
      <ellipse cx="37" cy="55" rx="5.5" ry="5.5" fill="#fff"/>
      <ellipse cx="63" cy="55" rx="5.5" ry="5.5" fill="#fff"/>
      <ellipse cx="38" cy="56" rx="3" ry="3" fill="#1C1C18"/>
      <ellipse cx="64" cy="56" rx="3" ry="3" fill="#1C1C18"/>
      <ellipse cx="39" cy="55" rx="1" ry="1" fill="#fff"/>
      <ellipse cx="65" cy="55" rx="1" ry="1" fill="#fff"/>
      {/* Lengua */}
      <ellipse cx="50" cy="76" rx="5" ry="4" fill="#E05080"/>
      {/* Collar */}
      <rect x="28" y="81" width="44" height="7" rx="3.5" fill="#CC2200"/>
      <ellipse cx="50" cy="88" rx="4" ry="3.5" fill="#fff" opacity="0.9"/>
    </svg>
  )
}

function DogAvatarHeader() {
  return (
    <svg width="54" height="54" viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {/* Cuerpo sentado */}
      <ellipse cx="60" cy="108" rx="26" ry="18" fill="#C87828"/>
      {/* Patas delanteras */}
      <rect x="38" y="96" width="12" height="22" rx="6" fill="#C87828"/>
      <rect x="70" y="96" width="12" height="22" rx="6" fill="#C87828"/>
      {/* Cola */}
      <path d="M86 100 Q106 80 96 68" stroke="#C87828" strokeWidth="9" strokeLinecap="round" fill="none"/>
      {/* Orejas externas */}
      <polygon points="30,12 42,48 18,48" fill="#1C1C18"/>
      <polygon points="90,12 78,48 102,48" fill="#1C1C18"/>
      {/* Orejas internas */}
      <polygon points="32,17 40,44 22,44" fill="#8B5010"/>
      <polygon points="88,17 80,44 98,44" fill="#8B5010"/>
      {/* Cabeza */}
      <ellipse cx="60" cy="62" rx="32" ry="30" fill="#C87828"/>
      {/* Zona superior oscura */}
      <ellipse cx="60" cy="50" rx="24" ry="16" fill="#1C1C18"/>
      {/* Hocico/pecho */}
      <ellipse cx="60" cy="73" rx="20" ry="16" fill="#E8A040"/>
      {/* Nariz */}
      <ellipse cx="60" cy="71" rx="8" ry="5.5" fill="#1C1C18"/>
      {/* Ojos */}
      <ellipse cx="46" cy="59" rx="6" ry="6" fill="#fff"/>
      <ellipse cx="74" cy="59" rx="6" ry="6" fill="#fff"/>
      <ellipse cx="47" cy="60" rx="3.5" ry="3.5" fill="#1C1C18"/>
      <ellipse cx="75" cy="60" rx="3.5" ry="3.5" fill="#1C1C18"/>
      <ellipse cx="48" cy="59" rx="1.2" ry="1.2" fill="#fff"/>
      <ellipse cx="76" cy="59" rx="1.2" ry="1.2" fill="#fff"/>
      {/* Lengua */}
      <ellipse cx="60" cy="82" rx="6" ry="5" fill="#E05080"/>
      {/* Collar */}
      <rect x="36" y="87" width="48" height="8" rx="4" fill="#CC2200"/>
      <ellipse cx="60" cy="95" rx="4.5" ry="4" fill="#fff" opacity="0.9"/>
    </svg>
  )
}

function DogAvatarMini() {
  return (
    <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <polygon points="22,18 32,50 14,50" fill="#1C1C18"/>
      <polygon points="78,18 68,50 86,50" fill="#1C1C18"/>
      <polygon points="24,22 31,46 17,46" fill="#8B5010"/>
      <polygon points="76,22 69,46 83,46" fill="#8B5010"/>
      <ellipse cx="50" cy="58" rx="30" ry="28" fill="#C87828"/>
      <ellipse cx="50" cy="46" rx="22" ry="14" fill="#1C1C18"/>
      <ellipse cx="50" cy="68" rx="18" ry="14" fill="#E8A040"/>
      <ellipse cx="50" cy="66" rx="7" ry="5" fill="#1C1C18"/>
      <ellipse cx="37" cy="55" rx="5.5" ry="5.5" fill="#fff"/>
      <ellipse cx="63" cy="55" rx="5.5" ry="5.5" fill="#fff"/>
      <ellipse cx="38" cy="56" rx="3" ry="3" fill="#1C1C18"/>
      <ellipse cx="64" cy="56" rx="3" ry="3" fill="#1C1C18"/>
      <ellipse cx="50" cy="76" rx="5" ry="4" fill="#E05080"/>
      <rect x="28" y="81" width="44" height="7" rx="3.5" fill="#CC2200"/>
      <ellipse cx="50" cy="88" rx="4" ry="3.5" fill="#fff" opacity="0.9"/>
    </svg>
  )
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function WoofWidget() {
  const [open, setOpen]       = useState(false)
  const [badge, setBadge]     = useState(true)
  const [messages, setMessages] = useState([])
  const [input, setInput]     = useState('')
  const [typing, setTyping]   = useState(false)
  const [data, setData]       = useState({ step: 0, especie: '', edad: '', raza: '', tamano: '', especial: '' })
  // chipsLocked: set of message indices cuyo group de chips fue respondido
  const [chipsLocked, setChipsLocked] = useState(new Set())
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Iniciar conversación cuando se abre por primera vez
  useEffect(() => {
    if (open && messages.length === 0) {
      addBotMessage({
        text: '¡Hola! Soy Woof, el asesor de Mish&Woof. ¿Tu mascota es...?',
        chips: ['Perro', 'Gato'],
        immediate: true
      })
    }
  }, [open])

  function lockChipsAt(idx) {
    setChipsLocked(prev => new Set([...prev, idx]))
  }

  function addUserMessage(text) {
    setMessages(prev => [...prev, { role: 'user', text }])
  }

  function addBotMessage({ text, chips, products, immediate = false }) {
    const delay = immediate ? 0 : 600
    const typingDelay = immediate ? 0 : 200

    if (!immediate) setTyping(true)

    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [
        ...prev,
        { role: 'bot', text, chips: chips || null, products: products || null }
      ])
    }, delay + typingDelay)
  }

  function handleOpen() {
    setOpen(true)
    setBadge(false)
    setTimeout(() => inputRef.current?.focus(), 300)
  }

  function handleClose() {
    setOpen(false)
  }

  function resetChat() {
    setMessages([])
    setData({ step: 0, especie: '', edad: '', raza: '', tamano: '', especial: '' })
    setChipsLocked(new Set())
    setInput('')
    // Re-iniciar en el próximo render
    setTimeout(() => {
      addBotMessage({
        text: '¡Hola de nuevo! ¿Tu mascota es...?',
        chips: ['Perro', 'Gato'],
        immediate: true
      })
    }, 50)
  }

  function handleChip(value, msgIdx) {
    lockChipsAt(msgIdx)
    addUserMessage(value)

    const nextData = { ...data }
    const step = nextData.step

    if (step === 0) {
      nextData.especie = value
      nextData.step = 1
      setData(nextData)
      addBotMessage({ text: '¿Qué edad tiene?', chips: ['Cachorro', 'Adulto', 'Senior'] })
      return
    }

    if (step === 1) {
      nextData.edad = value
      nextData.step = 2
      setData(nextData)
      addBotMessage({ text: '¿Cuál es su raza? Escribila y presioná Enviar.' })
      setTimeout(() => inputRef.current?.focus(), 700)
      return
    }

    if (step === 3) {
      // perro → tamaño
      if (nextData.especie === 'Perro') {
        nextData.tamano = value
        nextData.step = 4
        setData(nextData)
        addBotMessage({
          text: '¿Tiene alguna necesidad especial?',
          chips: [
            'Sin necesidades especiales',
            'Sobrepeso / control de peso',
            'Piel sensible o alergias',
            'Problemas urinarios'
          ]
        })
        return
      }
      // gato adulto → necesidad especial
      if (nextData.especie === 'Gato') {
        nextData.especial = value
        nextData.step = 5
        setData(nextData)
        showRecomendaciones(nextData)
        return
      }
    }

    if (step === 4) {
      // perro → necesidad especial
      nextData.especial = value
      nextData.step = 5
      setData(nextData)
      showRecomendaciones(nextData)
      return
    }

    if (step === 5) {
      // post-recomendaciones
      if (value.includes('otra consulta') || value.includes('Sí')) {
        resetChat()
      } else {
        addBotMessage({ text: '¡Perfecto! Gracias por usar el asesor de Mish&Woof. ¡Hasta pronto!' })
      }
      return
    }
  }

  function handleSend() {
    const txt = input.trim()
    if (!txt || data.step !== 2) return

    addUserMessage(txt)
    setInput('')

    const nextData = { ...data, raza: txt, step: 3 }
    setData(nextData)

    // step 3: según especie
    if (nextData.especie === 'Perro') {
      addBotMessage({
        text: '¿Qué tamaño tiene?',
        chips: ['Pequeño (hasta 10 kg)', 'Mediano (10-35 kg)', 'Grande (mas de 35 kg)']
      })
    } else if (nextData.especie === 'Gato') {
      if (nextData.edad === 'Adulto') {
        addBotMessage({
          text: '¿Tiene alguna necesidad especial?',
          chips: [
            'Sin necesidades especiales',
            'Castrado / Esterilizado',
            'Problemas urinarios',
            'Piel sensible'
          ]
        })
      } else {
        // cachorro / senior → directo a recomendaciones
        const finalData = { ...nextData, especial: 'ninguna', tamano: 'todos', step: 5 }
        setData(finalData)
        showRecomendaciones(finalData)
      }
    }
  }

  function showRecomendaciones(d) {
    const productos = getRecomendaciones(d)
    if (!productos || productos.length === 0) {
      addBotMessage({ text: 'No encontré productos para esa combinación. ¡Consultanos por WhatsApp!' })
      return
    }
    addBotMessage({
      text: `Acá van mis recomendaciones para tu ${d.especie.toLowerCase()}:`,
      products: productos
    })
    // Mensaje siguiente con botón de nueva consulta
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { role: 'bot', text: '¿Necesitas otra consulta?', chips: ['Sí, otra consulta', 'No, gracias!'] }
      ])
    }, 900)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend()
  }

  const isInputActive = data.step === 2

  return (
    <>
      {/* Panel de chat */}
      <div className={`woof-panel${open ? ' woof-panel--visible' : ''}`} role="dialog" aria-label="Asesor Woof">
        {/* Header */}
        <div className="woof-header">
          <DogAvatarHeader />
          <div className="woof-header__info">
            <div className="woof-header__name">Woof — asesor Mish&amp;Woof</div>
            <div className="woof-header__sub">Pastor alemán experto en balanceados</div>
          </div>
          <button className="woof-header__close" onClick={handleClose} aria-label="Cerrar chat">
            ✕
          </button>
        </div>

        {/* Mensajes */}
        <div className="woof-messages" role="log" aria-live="polite">
          {messages.map((msg, idx) => (
            <div key={idx}>
              <div className={`woof-msg woof-msg--${msg.role}`}>
                {msg.role === 'bot' && (
                  <div className="woof-avatar"><DogAvatarMini /></div>
                )}
                <div className={`woof-bubble woof-bubble--${msg.role}`}>
                  {msg.text}
                  {msg.products && (
                    <div className="woof-products">
                      {msg.products.map((p, i) => (
                        <div key={i} className="woof-product-card">
                          <div className="woof-product-card__name">{p.n}</div>
                          <div className="woof-product-card__desc">{p.d}</div>
                        </div>
                      ))}
                      <a
                        href={buildWAUrl(data, msg.products)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="woof-wa-btn"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.556 4.124 1.527 5.857L0 24l6.335-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.808 9.808 0 01-5.001-1.374l-.36-.214-3.72.885.936-3.618-.235-.372A9.788 9.788 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182 17.42 2.182 21.818 6.58 21.818 12c0 5.42-4.398 9.818-9.818 9.818z"/>
                        </svg>
                        Consultar por WhatsApp
                      </a>
                    </div>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="woof-avatar">Vos</div>
                )}
              </div>

              {/* Chips del mensaje */}
              {msg.chips && (
                <div className="woof-chips-wrap">
                  {msg.chips.map((chip, ci) => (
                    <button
                      key={ci}
                      className="woof-chip"
                      disabled={chipsLocked.has(idx)}
                      onClick={() => handleChip(chip, idx)}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="woof-typing">
              <div className="woof-avatar"><DogAvatarMini /></div>
              <div className="woof-typing__dots">
                <div className="woof-typing__dot" />
                <div className="woof-typing__dot" />
                <div className="woof-typing__dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="woof-input-row">
          <input
            ref={inputRef}
            className="woof-input"
            type="text"
            placeholder={isInputActive ? 'Escribí la raza...' : 'Seleccioná una opción arriba'}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={!isInputActive}
            aria-label="Escribir mensaje"
          />
          <button
            className="woof-send-btn"
            onClick={handleSend}
            disabled={!isInputActive || !input.trim()}
            aria-label="Enviar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* FAB */}
      <button
        className={`woof-fab${open ? ' woof-fab--open' : ''}`}
        onClick={open ? handleClose : handleOpen}
        aria-label="Asesor Woof"
        aria-expanded={open}
      >
        {badge && !open && <span className="woof-fab__badge">1</span>}
        {!open && <span className="woof-fab__tooltip">Asesor Woof</span>}
        <DogAvatarFAB />
      </button>
    </>
  )
}
