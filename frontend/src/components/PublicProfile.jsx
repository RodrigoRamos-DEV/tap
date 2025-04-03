import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getProfileBySlug } from '../services/authService';
import CardPreview from '../Pages/CardPreview';

const PublicProfile = () => {
  const { slug } = useParams();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfileBySlug(slug);
        setProfileData(data);
      } catch (err) {
        setError('Perfil não encontrado');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [slug]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>{error}</div>;
  if (!profileData) return <div>Perfil não encontrado</div>;

  return (
    <div className="public-profile">
      <CardPreview cardData={profileData} />
    </div>
  );
};

export default PublicProfile;