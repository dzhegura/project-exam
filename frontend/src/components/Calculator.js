import React, { useState } from 'react';
import './Calculator.css';

const Calculator = () => {
  const [formData, setFormData] = useState({
    area: '',
    floors: '',
    foundation: 'ленточный',
    walls: 'кирпич',
    roof: 'плоская',
    options: [],
  });
  const [userData, setUserData] = useState({
    name: '',
    email: '',
  });
  const [result, setResult] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        options: checked ? [...prev.options, value] : prev.options.filter((opt) => opt !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleCalculate = (e) => {
    e.preventDefault();

    // Example calculation logic
    const foundationCosts = { ленточный: 500, плитный: 800, столбчатый: 300 };
    const wallCosts = { кирпич: 1000, дерево: 800, газобетон: 600 };
    const roofCosts = { плоская: 400, скатная: 700 };
    const optionCosts = { балкон: 500, терраса: 700, гараж: 1000 };

    const foundationCost = foundationCosts[formData.foundation] * formData.area;
    const wallCost = wallCosts[formData.walls] * formData.area;
    const roofCost = roofCosts[formData.roof] * formData.area;
    const optionsCost = formData.options.reduce((total, opt) => total + (optionCosts[opt] || 0), 0);

    const totalCost = foundationCost + wallCost + roofCost + optionsCost;

    setResult({
      foundationCost,
      wallCost,
      roofCost,
      optionsCost,
      totalCost,
    });
  };

  const handleSaveAndSend = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/save-calculation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userData.name,
          email: userData.email,
          calculation: result,
        }),
      });

      const data = await response.json();
      alert(data.message);
      setPreviewUrl(data.previewUrl);
    } catch (error) {
      console.error('Ошибка при сохранении расчета:', error);
      alert('Не удалось сохранить расчет или отправить email.');
    }
  };

  return (
    <div className="calculator-container">
      <h2>Калькулятор стоимости строительства</h2>
      <form onSubmit={handleCalculate} className="calculator-form">
        <label>
          Площадь (кв. м.):
          <input type="number" name="area" value={formData.area} onChange={handleFormChange} required />
        </label>
        <label>
          Количество этажей:
          <input type="number" name="floors" value={formData.floors} onChange={handleFormChange} required />
        </label>
        <label>
          Тип фундамента:
          <select name="foundation" value={formData.foundation} onChange={handleFormChange}>
            <option value="ленточный">Ленточный</option>
            <option value="плитный">Плитный</option>
            <option value="столбчатый">Столбчатый</option>
          </select>
        </label>
        <label>
          Материал стен:
          <select name="walls" value={formData.walls} onChange={handleFormChange}>
            <option value="кирпич">Кирпич</option>
            <option value="дерево">Дерево</option>
            <option value="газобетон">Газобетон</option>
          </select>
        </label>
        <label>
          Тип крыши:
          <select name="roof" value={formData.roof} onChange={handleFormChange}>
            <option value="плоская">Плоская</option>
            <option value="скатная">Скатная</option>
          </select>
        </label>
        <fieldset>
          <legend>Дополнительные опции:</legend>
          <label>
            <input
              type="checkbox"
              value="балкон"
              checked={formData.options.includes('балкон')}
              onChange={handleFormChange}
            />
            Балкон
          </label>
          <label>
            <input
              type="checkbox"
              value="терраса"
              checked={formData.options.includes('терраса')}
              onChange={handleFormChange}
            />
            Терраса
          </label>
          <label>
            <input
              type="checkbox"
              value="гараж"
              checked={formData.options.includes('гараж')}
              onChange={handleFormChange}
            />
            Гараж
          </label>
        </fieldset>
        <button type="submit">Рассчитать стоимость</button>
      </form>

      {result && (
        <div className="calculator-result">
          <h3>Результат расчёта:</h3>
          <p>Фундамент: {result.foundationCost} руб.</p>
          <p>Стены: {result.wallCost} руб.</p>
          <p>Крыша: {result.roofCost} руб.</p>
          <p>Дополнительные опции: {result.optionsCost} руб.</p>
          <h4>Общая стоимость: {result.totalCost} руб.</h4>
          <form onSubmit={handleSaveAndSend} className="user-data-form">
            <label>
              Имя:
              <input type="text" name="name" value={userData.name} onChange={handleUserChange} required />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={userData.email} onChange={handleUserChange} required />
            </label>
            <button type="submit">Сохранить и отправить</button>
          </form>
          {previewUrl && (
            <p>
              <strong>Предварительный просмотр:</strong>{' '}
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                Открыть письмо
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator;
