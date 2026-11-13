function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <a href="#" className="logo-badge">КРАФТ БАРБЕРШОП</a>
        <nav className="top-menu" aria-label="Главное меню">
          <a href="#" className="menu-link">Услуги</a>
          <a href="#" className="menu-link">Мастера</a>
          <a href="#" className="menu-link">Контакты</a>
          <a href="#" className="menu-link">Отзывы</a>
        </nav>
      </div>
    </header>
  );
}

export default Header;
