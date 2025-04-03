import React, { useState, useEffect } from 'react';
import { generateCodes, getActiveCodes } from '../services/authService';

const AdminPanel = () => {
  const [codes, setCodes] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const loadCodes = async () => {
    try {
      const data = await getActiveCodes();
      setCodes(data.codes);
    } catch (error) {
      setMessage('Erro ao carregar códigos');
    }
  };

  const handleGenerate = async () => {
    try {
      const data = await generateCodes(quantity);
      setMessage(`${data.count} códigos gerados!`);
      loadCodes();
    } catch (error) {
      setMessage('Erro ao gerar códigos');
    }
  };

  useEffect(() => {
    loadCodes();
  }, []);

  return (
    <div className="admin-container">
      <h2>Painel Administrativo</h2>
      
      <div className="code-generation">
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          min="1" 
          max="100" 
        />
        <button onClick={handleGenerate}>Gerar Códigos</button>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="codes-list">
        <h3>Códigos Ativos</h3>
        <ul>
          {codes.map((code) => (
            <li key={code.code}>
              {code.code} - {code.is_used ? `Usado por ${code.used_by_email}` : 'Disponível'}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminPanel;