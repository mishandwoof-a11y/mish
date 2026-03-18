export default function Header({ sesionActual, esAdmin, onLogin, onAdminLogin, onLogout }) {
  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__logo">
          <div className="logo-text">
            <span className="logo-main">mish<span className="logo-amp">&amp;</span>woof</span>
            <span className="logo-sub">PET SHOP</span>
          </div>
        </div>
        <div className="header__title">
          <h1>Comparador de Balanceados</h1>
          <p>Encontrá el alimento ideal para tu mascota</p>
        </div>
        <div className="header__actions">
          {sesionActual ? (
            sesionActual.rol === 'admin' ? (
              <>
                <span className="header-user__badge">⚙ Admin</span>
                <button className="header-user__logout" onClick={onLogout}>Salir</button>
              </>
            ) : (
              <>
                <span className="header-user__greeting">
                  Hola, <strong>{sesionActual.nombre}</strong>{' '}
                  {sesionActual.mascota === 'gato' ? '🐱' : '🐶'}
                </span>
                <button className="header-user__logout" onClick={onLogout}>Cerrar sesión</button>
              </>
            )
          ) : (
            <>
              <button className="header-user__login" onClick={onLogin}>Ingresar</button>
              <button className="header-user__admin" onClick={onAdminLogin} title="Acceso administrador">⚙</button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
