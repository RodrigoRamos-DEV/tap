import React, { useEffect, useRef, useState, useMemo } from 'react';

// Importando as logos
import instagramLogo from '../assets/images/instagram.png';
import facebookLogo from '../assets/images/facebook.png';
import whatsappLogo from '../assets/images/whatsapp.png';
import linkedinLogo from '../assets/images/linkedin.png';
import youtubeLogo from '../assets/images/youtube.png';
import tiktokLogo from '../assets/images/tiktok.png';
import kwayLogo from '../assets/images/kway.png';
import xLogo from '../assets/images/x.png';
import twitchLogo from '../assets/images/twitch.png';


const CardPreview = ({ cardData }) => {
  const {
    name,
    instagram,
    facebook,
    whatsapp,
    phone,
    address,
    logo,
    pixKey,
    website,
    about,
    bgColor,
    labelBgColor,
    fontColor,
    bgImage,
    carouselImages,
    linkedin,
    youtube,
    tiktok,
    kway,
    x,
    twitch,
    selectedFont
  } = cardData;

  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselIntervalRef = useRef(null);
  const [logoUrl, setLogoUrl] = useState(null);
  const [bgImageUrl, setBgImageUrl] = useState(null);
  const [carouselUrls, setCarouselUrls] = useState([]);

  // Estilos para o carrossel com tamanhos fixos
  const carouselContainerStyle = useMemo(() => ({
    width: '100%',
    height: '300px', // Altura fixa para o carrossel
    position: 'relative',
    overflow: 'hidden',
    margin: '20px 0'
  }), []);

  const carouselItemStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Cor de fundo para imagens pequenas
    transition: 'opacity 0.5s ease-in-out'
  }), []);

  const carouselImageStyle = useMemo(() => ({
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Mantém proporção e cobre todo o espaço
    objectPosition: 'center' // Centraliza a imagem
  }), []);

  // Criar URLs apenas uma vez quando as imagens mudarem
  useEffect(() => {
    if (logo) {
      const url = URL.createObjectURL(logo);
      setLogoUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setLogoUrl(null);
    }
  }, [logo]);

  useEffect(() => {
    if (bgImage) {
      const url = URL.createObjectURL(bgImage);
      setBgImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setBgImageUrl(null);
    }
  }, [bgImage]);

  useEffect(() => {
    const urls = carouselImages
      .filter(img => img)
      .map(img => URL.createObjectURL(img));
    setCarouselUrls(urls);

    return () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [carouselImages]);

  const backgroundStyle = useMemo(() => ({
    backgroundColor: bgColor,
    backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '20px',
    textAlign: 'left',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
    borderRadius: '10px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxSizing: 'border-box',
  }), [bgColor, bgImageUrl]);

  const labelStyle = useMemo(() => ({
    backgroundColor: labelBgColor || '#f0f0f0',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '5px',
    margin: '5px 0',
    display: 'flex',
    alignItems: 'center',
    maxWidth: '300px',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    fontFamily: selectedFont || 'Arial',
  }), [labelBgColor, selectedFont]);

  const nameStyle = useMemo(() => ({
    textAlign: 'center',
    textShadow: '5px 3px 4px rgba(0, 0, 0, 0.5)',     margin: '20px 0',
    padding: '10px',
    color: fontColor || '#000000',
    fontFamily: selectedFont || 'Arial',
  }), [fontColor, selectedFont]);

  const logoStyle = useMemo(() => ({
    marginTop: '20%',
    width: '200px',
    height: '200px',
    borderRadius: '80%',
    objectFit: 'contain',
  }), []);

  const renderPlatformLink = (url, logo, platformName) => (
    <div style={labelStyle}>
      <a 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ 
          textDecoration: 'none', 
          color: fontColor || '#000000',
          fontFamily: selectedFont || 'Arial'
        }}
      >
        {logo && <img src={logo} alt={platformName} style={{ width: '30px', margin: '0 5px' }} />}
        {platformName}
      </a>
    </div>
  );

  const renderCarousel = useMemo(() => {
    return (
      <div style={carouselContainerStyle}>
        {carouselUrls.map((url, index) => (
          <div
            key={index}
            style={{
              ...carouselItemStyle,
              opacity: index === currentIndex ? 1 : 0,
              zIndex: index === currentIndex ? 1 : 0
            }}
          >
            <img
              src={url}
              alt={`carousel-image-${index}`}
              style={carouselImageStyle}
            />
          </div>
        ))}
        
        {carouselUrls.length > 1 && (
          <>
            <button
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentIndex(prev => (prev === 0 ? carouselUrls.length - 1 : prev - 1))}
            >
              &lt;
            </button>
            <button
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 2,
                background: 'rgba(0,0,0,0.5)',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer'
              }}
              onClick={() => setCurrentIndex(prev => (prev + 1) % carouselUrls.length)}
            >
              &gt;
            </button>
          </>
        )}
      </div>
    );
  }, [carouselUrls, currentIndex, carouselContainerStyle, carouselItemStyle, carouselImageStyle]);

  useEffect(() => {
    if (carouselUrls.length > 1) {
      carouselIntervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselUrls.length);
      }, 3000);
    }

    return () => {
      if (carouselIntervalRef.current) {
        clearInterval(carouselIntervalRef.current);
      }
    };
  }, [carouselUrls]);

  const handleCopyPixKey = () => {
    if (pixKey) {
      navigator.clipboard.writeText(pixKey).then(() => {
        alert('Chave PIX copiada!');
      }).catch((err) => {
        alert('Erro ao copiar a chave PIX: ', err);
      });
    }
  };

  useEffect(() => {
    if (!selectedFont || !selectedFont.includes(' ')) return;
    
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(/ /g, '+')}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, [selectedFont]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
  
      marginTop: '1%'
    }}>
      {bgImageUrl && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${bgImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(8px)',
            zIndex: -1,
          }}
        />
      )}
      <div style={backgroundStyle}>
        {logoUrl && (
          <img
            src={logoUrl}
            alt="Logo"
            style={logoStyle}
          />
        )}
        <h1 style={nameStyle}>{name || 'Nome não fornecido'}</h1>
        <div style={{ width: '80%', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {instagram && renderPlatformLink(instagram, instagramLogo, 'Instagram')}
          {facebook && renderPlatformLink(facebook, facebookLogo, 'Facebook')}
          {whatsapp && renderPlatformLink(`https://wa.me/${whatsapp}`, whatsappLogo, 'WhatsApp')}
          {linkedin && renderPlatformLink(linkedin, linkedinLogo, 'LinkedIn')}
          {youtube && renderPlatformLink(youtube, youtubeLogo, 'YouTube')}
          {tiktok && renderPlatformLink(tiktok, tiktokLogo, 'TikTok')}
          {kway && renderPlatformLink(kway, kwayLogo, 'Kway')}
          {x && renderPlatformLink(x, xLogo, 'X')}
          {twitch && renderPlatformLink(twitch, twitchLogo, 'Twitch')}
          {phone && (
            <div style={labelStyle}>
              <span style={{ color: fontColor || '#000000', fontFamily: selectedFont || 'Arial' }}>
                Telefone: {phone}
              </span>
            </div>
          )}
          {address && (
            <div style={labelStyle}>
              <span style={{ color: fontColor || '#000000', fontFamily: selectedFont || 'Arial' }}>
                Endereço: {address}
              </span>
            </div>
          )}
          {pixKey && (
            <div style={labelStyle} onClick={handleCopyPixKey}>
              <span style={{ color: fontColor || '#000000', fontFamily: selectedFont || 'Arial' }}>
                Copiar!
              </span>
            </div>
          )}
          {website && renderPlatformLink(website, null, 'Website')}
          {about && (
            <div style={labelStyle}>
              <span style={{ color: fontColor || '#000000', fontFamily: selectedFont || 'Arial' }}>
                {about}
              </span>
            </div>
          )}
        </div>
        {carouselUrls.length > 0 && renderCarousel}
      </div>
    </div>
  );
};

export default CardPreview;