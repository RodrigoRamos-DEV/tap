import React, { useState, useEffect } from 'react';
import { loginUser, registerUser, validateRegistrationCode } from '../services/authService';
import './LoginForm.css';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    code: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [codeValid, setCodeValid] = useState(null);
  const [codeChecking, setCodeChecking] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }
    
    if (!isLogin) {
      if (!formData.code) {
        newErrors.code = 'Código de cadastro é obrigatório';
      } else if (codeValid === false) {
        newErrors.code = 'Código inválido ou já utilizado';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const checkCodeValidity = async (code) => {
    if (!code) return;
    
    setCodeChecking(true);
    try {
      const response = await validateRegistrationCode(code);
      setCodeValid(response.isValid);
      if (!response.isValid) {
        setErrors(prev => ({ ...prev, code: 'Código inválido ou já utilizado' }));
      } else {
        setErrors(prev => ({ ...prev, code: undefined }));
      }
    } catch (error) {
      setCodeValid(false);
      setErrors(prev => ({ ...prev, code: 'Erro ao verificar código' }));
    } finally {
      setCodeChecking(false);
    }
  };

  useEffect(() => {
    if (!isLogin && formData.code) {
      const timer = setTimeout(() => {
        checkCodeValidity(formData.code);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [formData.code, isLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      let response;
      if (isLogin) {
        response = await loginUser(formData.email, formData.password);
        // Redireciona para o dashboard após login
        navigate('/dashboard');
      } else {
        response = await registerUser(formData.email, formData.password, formData.code);
        // Redireciona para o formulário de perfil após registro
        navigate('/profile-setup');
      }
      
      setMessage(response.message || (isLogin ? 'Login realizado com sucesso!' : 'Cadastro realizado com sucesso!'));
    } catch (error) {
      setMessage(error.response?.data?.message || 'Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
        
        {message && <div className={`message ${message.includes('sucesso') ? 'success' : 'error'}`}>{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error-input' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error-input' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>
          
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="code">Código de Cadastro</label>
              <div className="code-input-container">
                <input
                  type="text"
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className={errors.code ? 'error-input' : ''}
                />
                {codeChecking && <span className="checking-code">Verificando...</span>}
                {codeValid === true && !codeChecking && (
                  <span className="code-valid">✓ Código válido</span>
                )}
              </div>
              {errors.code && <span className="error-message">{errors.code}</span>}
              <p className="code-help-text">
                Solicite um código ao administrador do sistema
              </p>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isLoading || (!isLogin && codeValid !== true)} 
            className="submit-button"
          >
            {isLoading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>
        
        <div className="toggle-form">
          <button 
            type="button" 
            onClick={() => {
              setIsLogin(!isLogin);
              setCodeValid(null);
              setErrors({});
              setMessage('');
            }}
            className="toggle-button"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;