import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <img src={logo} alt="Логотип" />
      </div>
      <nav className="header-nav">
        <Link to="/">Главная</Link>
        <Link to="/calculator">Калькулятор</Link>
        <Link to="/services">Услуги</Link>
        <Link to="/about">О нас</Link>
        <Link to="/contact">Контакты</Link>
      </nav>
    </header>
  );
};

export default Header;
