import React, { useState } from 'react';
import './Contact.css';
import mapImage from '../assets/map.png';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Форма отправлена:', formData);
    alert('Ваше сообщение успешно отправлено!');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <div className="contact-container">
      <h2>Свяжитесь с нами</h2>
      <form className="contact-form" onSubmit={handleSubmit}>
        <label>
          Имя:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Сообщение:
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Отправить</button>
      </form>

      <h3>Контактная информация</h3>
      <div className="contact-details">
        <p>
          <strong>Адрес:</strong> г. Москва, ул. Примерная д. 10
        </p>
        <p>
          <strong>Телефон:</strong> <a href="tel:+79991771717">8 (999) 177-17-17</a>
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:info@architecturecomfort.ru">info@architecturecomfort.ru</a>
        </p>
        <p>
          <strong>Часы работы:</strong>
          <br />
          Пн - Пт: 10:00 - 19:00
          <br />
          Сб: 10:00 - 16:00
          <br />
          Вс: выходной
        </p>
      </div>

      <h3>Местоположение офиса</h3>
      <div className="contact-map">
        <img src={mapImage} alt="Карта местоположения офиса" className="map-image" />
      </div>
    </div>
  );
};

export default Contact;
