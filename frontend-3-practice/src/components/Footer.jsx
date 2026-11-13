function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-col">
            <span className="footer-logo">КРАФТ БАРБЕРШОП</span>
            <p className="footer-slogan">МУЖСКИЕ СТРИЖКИ И УХОД ЗА БОРОДОЙ С ХАРАКТЕРОМ</p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">КОНТАКТЫ</h3>
            <p className="footer-item">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 21s-6-5.33-6-10a6 6 0 1 1 12 0c0 4.67-6 10-6 10z" />
                <circle cx="12" cy="11" r="2.2" />
              </svg>
              <span>ул. Садовая, 15, Москва</span>
            </p>
            <p className="footer-item footer-phone">
              <svg className="footer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <a href="tel:+74951234567">+7 (495) 123-45-67</a>
            </p>
          </div>

          <div className="footer-col">
            <h3 className="footer-heading">РЕЖИМ РАБОТЫ</h3>
            <p className="footer-item">Пн–Пт: 9:00 – 21:00</p>
            <p className="footer-item">Сб–Вс: 10:00 – 19:00</p>
          </div>
        </div>

        <hr className="footer-divider" />

        <div className="footer-bottom">
          <span>&copy; 2026. Все права защищены.</span>
          <a href="#" className="footer-policy">Политика конфиденциальности</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
