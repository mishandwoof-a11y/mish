export default function WhatsAppButton({ sesionActual }) {
  function getWhatsAppUrl() {
    const nombre = sesionActual?.nombre ? ` ${sesionActual.nombre}` : ''
    const msg = encodeURIComponent(`Hola! Quiero consultar por un balanceado para mi mascota${nombre}`)
    return `https://wa.me/543516322656?text=${msg}`
  }

  return (
    <a
      href={getWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Consultar por WhatsApp"
      title="Consultar por WhatsApp"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.47.664 4.786 1.822 6.77L2 30l7.418-1.797A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.6a11.55 11.55 0 0 1-5.895-1.612l-.423-.252-4.4 1.066 1.1-4.28-.277-.44A11.56 11.56 0 0 1 4.4 16C4.4 9.59 9.59 4.4 16 4.4S27.6 9.59 27.6 16 22.41 27.6 16 27.6zm6.34-8.64c-.347-.174-2.055-1.013-2.374-1.128-.32-.116-.553-.174-.786.174-.232.347-.9 1.128-1.104 1.36-.203.232-.405.26-.752.087-.347-.174-1.464-.54-2.788-1.72-1.03-.918-1.726-2.052-1.929-2.399-.203-.347-.021-.535.152-.707.157-.156.347-.406.52-.61.174-.203.232-.347.348-.579.116-.232.058-.435-.029-.61-.087-.174-.786-1.896-1.077-2.596-.283-.68-.572-.588-.786-.598l-.67-.012a1.286 1.286 0 0 0-.93.435c-.32.347-1.219 1.19-1.219 2.903s1.248 3.368 1.422 3.6c.174.232 2.454 3.748 5.945 5.255.831.36 1.48.574 1.985.735.834.266 1.594.229 2.194.139.669-.1 2.055-.84 2.345-1.652.29-.813.29-1.51.203-1.654-.086-.145-.319-.232-.666-.406z"/>
      </svg>
    </a>
  )
}
