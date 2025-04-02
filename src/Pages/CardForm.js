import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChromePicker } from 'react-color';
import { createProfile } from '../services/authService';
import logoImage from '../assets/images/logo.jpeg';
import './cardform.css';

const CardForm = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: '',
    instagram: '',
    facebook: '',
    whatsapp: '',
    phone: '',
    address: '',
    logo: null,
    pixKey: '',
    website: '',
    about: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    x: '',
    twitch: '',
    kway: '',
    bgColor: '#ffffff',
    labelBgColor: '#f0f0f0',
    fontColor: '#000000',
    bgImage: null,
    carouselImages: [null, null, null],
    selectedFont: 'Arial'
  });
  const { slug } = useParams();
const [editMode, setEditMode] = useState(props.editMode || false);
  const [error, setError] = useState('');
  const [showPicker, setShowPicker] = useState({ bg: false, label: false, font: false });
  const [currentPicker, setCurrentPicker] = useState(null);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [logoUploaded, setLogoUploaded] = useState(false);
  const [bgImageUploaded, setBgImageUploaded] = useState(false);
  const [carouselUploaded, setCarouselUploaded] = useState([false, false, false]);
  const [markerPosition, setMarkerPosition] = useState([51.505, -0.09]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const pickerRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name) {
      setError('Nome é obrigatório.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Cria um slug único baseado no nome
      const slug = `${formData.name.toLowerCase().replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 5)}`;
      
      // Prepara os dados para enviar
      const cardData = {
        ...formData,
        slug // Adiciona o slug aos dados
      };

      // Chama o serviço para criar o perfil
      await createProfile(cardData);
      
      // Redireciona para a visualização do perfil
      navigate(`/${slug}`);
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao salvar perfil. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      logo: file
    }));
    setLogoUploaded(true);
  };

  const handleBgImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData(prev => ({
      ...prev,
      bgImage: file
    }));
    setBgImageUploaded(true);
  };

  const handleCarouselImageChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const newCarouselImages = [...formData.carouselImages];
    newCarouselImages[index] = file;

    const newCarouselUploaded = [...carouselUploaded];
    newCarouselUploaded[index] = true;

    setFormData(prev => ({
      ...prev,
      carouselImages: newCarouselImages
    }));

    setCarouselUploaded(newCarouselUploaded);
  };

  const handleColorChange = (color, type) => {
    const rgbaColor = `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`;
    if (type === 'label') {
      setFormData(prev => ({
        ...prev,
        labelBgColor: rgbaColor
      }));
    }
    if (type === 'font') {
      setFormData(prev => ({
        ...prev,
        fontColor: rgbaColor
      }));
    }
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
  };

  const closeAllPickers = () => {
    setShowPicker({ bg: false, label: false, font: false });
    setCurrentPicker(null);
  };
  useEffect(() => {
    if (editMode && slug) {
      const fetchProfile = async () => {
        try {
          const data = await getProfileBySlug(slug);
          setFormData(data);
          // Atualize os estados de upload conforme necessário
        } catch (error) {
          navigate('/dashboard');
        }
      };
      fetchProfile();
    }
  }, [editMode, slug]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        closeAllPickers();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!formData.selectedFont.includes(' ')) return;
    
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${formData.selectedFont.replace(/ /g, '+')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [formData.selectedFont]);

  const backgroundStyle = {
    backgroundImage: `url(${logoImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  };

  const containerStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '10px',
    padding: '20px',
    width: '90%',
    maxWidth: '1200px',
    boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)'
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  };

  const tabButtonStyle = (isActive) => ({
    padding: '10px 20px',
    border: 'none',
    borderRadius: '5px',
    backgroundColor: isActive ? '#4a6bff' : '#f0f0f0',
    color: isActive ? 'white' : '#333',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: formData.selectedFont
  });

  const formGroupStyle = {
    marginBottom: '15px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: '500',
    fontFamily: formData.selectedFont
  };

  const inputStyle = {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontFamily: formData.selectedFont
  };

  const fileUploadStyle = (isUploaded) => ({
    display: 'inline-block',
    padding: '10px 15px',
    backgroundColor: isUploaded ? '#e6f7e6' : '#f0f0f0',
    border: isUploaded ? '1px solid #4CAF50' : '1px solid #ddd',
    borderRadius: '5px',
    cursor: 'pointer',
    textAlign: 'center',
    fontFamily: formData.selectedFont,
    margin: '5px 0'
  });

  const colorPickerButtonStyle = {
    padding: '10px 15px',
    backgroundColor: '#f0f0f0',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontFamily: formData.selectedFont,
    margin: '5px'
  };

  const colorPickerPopupStyle = {
    position: 'absolute',
    zIndex: '1000',
    marginTop: '5px'
  };

  const submitButtonStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4a6bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontFamily: formData.selectedFont,
    marginTop: '20px'
  };

  const errorMessageStyle = {
    color: '#dc3545',
    backgroundColor: '#f8d7da',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '15px',
    textAlign: 'center',
    fontFamily: formData.selectedFont
  };

  const socialColumnsStyle = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap'
  };

  const socialColumnStyle = {
    flex: '1',
    minWidth: '250px'
  };

  return (
    <div style={backgroundStyle}>
      <div style={containerStyle}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px', fontFamily: formData.selectedFont }}>
          Crie Seu Cartão Digital
        </h1>
        
        {error && <div style={errorMessageStyle}>{error}</div>}

        <div style={buttonContainerStyle}>
          <button 
            type="button"
            style={tabButtonStyle(activeTab === 'profile')}
            onClick={() => {
              closeAllPickers();
              setActiveTab('profile');
            }}
          >
            Informações de Perfil
          </button>
          <button 
            type="button"
            style={tabButtonStyle(activeTab === 'social')}
            onClick={() => {
              closeAllPickers();
              setActiveTab('social');
            }}
          >
            Redes Sociais
          </button>
          <button 
            type="button"
            style={tabButtonStyle(activeTab === 'slides')}
            onClick={() => {
              closeAllPickers();
              setActiveTab('slides');
            }}
          >
            Personalização
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'profile' && (
            <div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Nome:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                  placeholder="João Silva"
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Telefone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="(99) 99999-9999"
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Endereço:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Rua A, 123"
                />
              </div>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Sobre:</label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  style={{ ...inputStyle, minHeight: '100px' }}
                  placeholder="Fale um pouco sobre você"
                />
              </div>
            </div>
          )}

          {activeTab === 'social' && (
            <div style={socialColumnsStyle}>
              <div style={socialColumnStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Instagram:</label>
                  <input
                    type="url"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="https://instagram.com/seuusuario"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Facebook:</label>
                  <input
                    type="url"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="https://facebook.com/seuusuario"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>WhatsApp:</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="+55 11 98765-4321"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Chave PIX:</label>
                  <input
                    type="text"
                    name="pixKey"
                    value={formData.pixKey}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="chave@pix.com.br"
                  />
                </div>
              </div>

              <div style={socialColumnStyle}>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>Website:</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="https://www.seusite.com.br"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>LinkedIn:</label>
                  <input
                    type="url"
                    name="linkedin"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="https://linkedin.com/in/seunome"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>YouTube:</label>
                  <input
                    type="url"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="https://youtube.com/c/seucanal"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>TikTok:</label>
                  <input
                    type="url"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="https://tiktok.com/@seunome"
                  />
                </div>
                <div style={formGroupStyle}>
                  <label style={labelStyle}>X (antigo Twitter):</label>
                  <input
                    type="url"
                    name="x"
                    value={formData.x}
                    onChange={handleInputChange}
                    style={inputStyle}
                    placeholder="https://x.com/seuusuario"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'slides' && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                <div style={formGroupStyle}>
                  <label 
                    htmlFor="logo-upload"
                    style={fileUploadStyle(logoUploaded)}
                  >
                    {logoUploaded ? "✅ Logo Carregada!" : "Escolher Logo"}
                  </label>
                  <input
                    type="file"
                    id="logo-upload"
                    onChange={handleLogoChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                </div>

                <div style={formGroupStyle}>
                  <label
                    htmlFor="bg-image-upload"
                    style={fileUploadStyle(bgImageUploaded)}
                  >
                    {bgImageUploaded ? "✅ Imagem Carregada!" : "Escolher Imagem de Fundo"}
                  </label>
                  <input
                    type="file"
                    id="bg-image-upload"
                    onChange={handleBgImageChange}
                    style={{ display: 'none' }}
                    accept="image/*"
                  />
                </div>
              </div>

              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '10px',
                marginBottom: '20px'
              }}>
                {[0, 1, 2].map((index) => (
                  <div key={index} style={formGroupStyle}>
                    <label
                      htmlFor={`carousel-upload-${index}`}
                      style={fileUploadStyle(carouselUploaded[index])}
                    >
                      {carouselUploaded[index] ? `✅ Slide ${index + 1}` : `Slide ${index + 1}`}
                    </label>
                    <input
                      type="file"
                      id={`carousel-upload-${index}`}
                      onChange={(e) => handleCarouselImageChange(index, e)}
                      style={{ display: 'none' }}
                      accept="image/*"
                    />
                  </div>
                ))}
              </div>

              <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap',
                gap: '10px',
                justifyContent: 'center'
              }}>
                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    style={colorPickerButtonStyle}
                    onClick={() => {
                      closeAllPickers();
                      setShowPicker({ 
                        ...showPicker,
                        label: !showPicker.label 
                      });
                    }}
                  >
                    Cor dos Botões
                  </button>
                  {showPicker.label && (
                    <div style={colorPickerPopupStyle} ref={pickerRef}>
                      <ChromePicker 
                        color={formData.labelBgColor} 
                        onChange={(color) => handleColorChange(color, 'label')} 
                      />
                    </div>
                  )}
                </div>

                <div style={{ position: 'relative' }}>
                  <button
                    type="button"
                    style={colorPickerButtonStyle}
                    onClick={() => {
                      closeAllPickers();
                      setShowPicker({ 
                        ...showPicker,
                        font: !showPicker.font 
                      });
                    }}
                  >
                    Cor do Texto
                  </button>
                  {showPicker.font && (
                    <div style={colorPickerPopupStyle} ref={pickerRef}>
                      <ChromePicker 
                        color={formData.fontColor} 
                        onChange={(color) => handleColorChange(color, 'font')} 
                      />
                    </div>
                  )}
                </div>

                <div style={formGroupStyle}>
                  <label style={labelStyle}>Fonte:</label>
                  <select
                    name="selectedFont"
                    value={formData.selectedFont}
                    onChange={handleInputChange}
                    style={inputStyle}
                  >
                    <option value="Arial">Arial</option>
                    <option value="Verdana">Verdana</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Times New Roman">Times New Roman</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Courier New">Courier New</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Open Sans">Open Sans</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Poppins">Poppins</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <button 
            type="submit" 
            style={{
              ...submitButtonStyle,
              backgroundColor: isSubmitting ? '#cccccc' : '#4a6bff',
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Cartão Digital'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CardForm;