// ================================================================
//  mish & woof Pet Shop — Lista de Balanceados
//
//  ✏️  CÓMO AGREGAR UN PRODUCTO:
//  1. Copiá el bloque PLANTILLA que está al final del archivo
//  2. Pegalo dentro del array PRODUCTOS (antes del último "]")
//  3. Completá cada campo con los datos del producto
//  4. Para la imagen podés usar:
//       - Una URL:   imagen: "https://ejemplo.com/foto.jpg"
//       - Un archivo local (ponelo en la carpeta imagenes/):
//                    imagen: "imagenes/royal_canin_adult.jpg"
//       - Sin imagen: imagen: ""   → aparece 🐶 o 🐱 automático
//
//  ✏️  CÓMO QUITAR UN PRODUCTO:
//  Borrá todo el bloque { ... },  (incluyendo la coma del final)
// ================================================================

const PRODUCTOS = [

  // ── PERRO 1 ────────────────────────────────────────────────
  {
    nombre:       "Adult Medium Breed",
    marca:        "Royal Canin",
    mascota:      "perro",                // "perro" o "gato"
    imagen:       "",                     // URL o ruta de la imagen
    precio_kg:    12500,                  // precio en pesos por kg
    proteina:     28,                     // % proteína
    grasa:        14,                     // % grasa
    humedad:      10,                     // % humedad
    ingredientes: "Pollo deshidratado, maíz, harina de arroz, aceite de girasol",
    tamano:       "Razas medianas (11–25 kg)",
    estrellas:    5,                      // del 1 al 5
  },

  // ── PERRO 2 ────────────────────────────────────────────────
  {
    nombre:       "Adulto Razas Grandes",
    marca:        "Pedigree",
    mascota:      "perro",
    imagen:       "",
    precio_kg:    7800,
    proteina:     21,
    grasa:        10,
    humedad:      12,
    ingredientes: "Harina de carne vacuna, cereales, soja, vitaminas",
    tamano:       "Razas grandes (+25 kg)",
    estrellas:    3,
  },

  // ── PERRO 3 ────────────────────────────────────────────────
  {
    nombre:       "Natural Grain Free Pollo",
    marca:        "Equilibrio",
    mascota:      "perro",
    imagen:       "",
    precio_kg:    9200,
    proteina:     32,
    grasa:        16,
    humedad:      10,
    ingredientes: "Pollo fresco, batata, arvejas, aceite de salmón",
    tamano:       "Todas las razas, adultos",
    estrellas:    4,
  },

  // ── GATO 1 ────────────────────────────────────────────────
  {
    nombre:       "Indoor Adult Salmón",
    marca:        "Purina Pro Plan",
    mascota:      "gato",
    imagen:       "",
    precio_kg:    14200,
    proteina:     35,
    grasa:        15,
    humedad:      8,
    ingredientes: "Salmón deshidratado, arroz, maíz, aceite de girasol",
    tamano:       "Gatos adultos de interior",
    estrellas:    5,
  },

  // ── GATO 2 ────────────────────────────────────────────────
  {
    nombre:       "Adult Ocean Fish",
    marca:        "Whiskas",
    mascota:      "gato",
    imagen:       "",
    precio_kg:    5900,
    proteina:     26,
    grasa:        12,
    humedad:      11,
    ingredientes: "Pescado de mar, cereales, aceites vegetales, vitaminas",
    tamano:       "Gatos adultos",
    estrellas:    3,
  },

  // ── GATO 3 ────────────────────────────────────────────────
  {
    nombre:       "Sterilised 37",
    marca:        "Royal Canin",
    mascota:      "gato",
    imagen:       "",
    precio_kg:    16800,
    proteina:     37,
    grasa:        13,
    humedad:      8,
    ingredientes: "Harina de pollo, arroz, gluten de trigo, aceite de girasol",
    tamano:       "Gatos adultos castrados",
    estrellas:    4,
  },

  // ══════════════════════════════════════════════════════════
  //  👆 Agregá tus productos ARRIBA de esta línea
  // ══════════════════════════════════════════════════════════

];


// ================================================================
//  📋  PLANTILLA — Copiá y pegá esto para agregar un producto
//
//  {
//    nombre:       "",
//    marca:        "",
//    mascota:      "perro",   ← escribí "perro" o "gato"
//    imagen:       "",        ← URL o "imagenes/archivo.jpg"
//    precio_kg:    0,         ← precio en pesos por kilo
//    proteina:     0,         ← porcentaje (solo el número)
//    grasa:        0,
//    humedad:      0,
//    ingredientes: "",
//    tamano:       "",        ← talla o raza recomendada
//    estrellas:    5,         ← del 1 al 5
//  },
//
// ================================================================
