import { useState, useEffect } from 'react';
import { Upload, Button, Card, Row, Col, Avatar, Typography, message, Spin } from 'antd';
import { UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';
import { useThemeAntd } from '../../contexts/ThemeProviderAntd';
import { useTranslation } from 'react-i18next';
import { fetchFotoDePerfil, actualizarFotoDePerfil } from '../../api';

const { Title, Text } = Typography;

const Profile = () => {
  const { themeMode } = useThemeAntd();
  const { t } = useTranslation();
  const { user, isLoading } = useAuth();
  const [imagenPerfil, setImagenPerfil] = useState(null);
  const [cargandoImagen, setCargandoImagen] = useState(false);

  const isDarkMode = themeMode === 'dark';

  const cargarFotoDePerfil = async () => {
    try {
      const { url } = await fetchFotoDePerfil();
      setImagenPerfil(url);
    } catch (error) {
      console.warn('No hay foto de perfil:', error.message);
      setImagenPerfil(null);
    }
  };

  const subirImagen = async (file) => {
    const formData = new FormData();
    formData.append('archivo', file);
  
    setCargandoImagen(true);
  
    try {
      await actualizarFotoDePerfil(formData);
      message.success(t('profile_upload_success') || 'Imagen actualizada');
      await cargarFotoDePerfil();
    } catch (err) {
      console.error(err);
      message.error(t('profile_upload_error') || 'Error al subir imagen');
    } finally {
      setCargandoImagen(false);
    }
  };

  const propsUpload = {
    name: 'archivo',
    maxCount: 1,
    accept: 'image/*',
    beforeUpload: (file) => {
      subirImagen(file);
      return false;
    },
    showUploadList: false,
  };

  useEffect(() => {
    if (!isLoading) {
      cargarFotoDePerfil();
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Spin size="large" tip={t('profile_loading')} />
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '2rem',
        background: isDarkMode ? '#000' : '#f0f2f5',
      }}
    >
      {/* Info del perfil */}
      <Card
        style={{
          maxWidth: 600,
          margin: '0 auto 2rem',
          padding: '2rem',
          borderRadius: '12px',
          boxShadow: isDarkMode
            ? '0 4px 12px rgba(255,255,255,0.1)'
            : '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Row gutter={[16, 16]} justify="center" align="middle">
          <Col xs={24} sm={8} style={{ textAlign: 'center' }}>
            <Avatar
              size={120}
              src={imagenPerfil}
              icon={<UserOutlined />}
              style={{
                backgroundColor: isDarkMode ? '#1c1c1c' : '#d9d9d9',
              }}
            />
            <Upload {...propsUpload}>
              <Button
                icon={<UploadOutlined />}
                style={{ marginTop: '1rem' }}
                loading={cargandoImagen}
              >
                {t('profile_upload_button')}
              </Button>
            </Upload>
          </Col>

          <Col xs={24} sm={16}>
            <Title level={3} style={{ marginBottom: '1rem' }}>
              {t('profile_title')}
            </Title>

            <div style={{ marginBottom: '1rem' }}>
              <Text strong>{t('profile_email')}:</Text>
              <br />
              <Text>{user?.email}</Text>
            </div>

          </Col>
        </Row>
      </Card>

      {/* Secciones del perfil */}
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8}>
          <Card title={t('profile_fav_movies')} bordered={false} style={{ height: '100%', textAlign: 'center', borderRadius: '12px' }}>
            <p>{t('profile_empty_movies')}</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card title={t('profile_watchlist')} bordered={false} style={{ height: '100%', textAlign: 'center', borderRadius: '12px' }}>
            <p>{t('profile_empty_watchlist')}</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card title={t('profile_fav_actors')} bordered={false} style={{ height: '100%', textAlign: 'center', borderRadius: '12px' }}>
            <p>{t('profile_empty_actors')}</p>
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card title={t('profile_settings')} bordered={false} style={{ height: '100%', textAlign: 'center', borderRadius: '12px' }}>
            <p>{t('profile_empty_settings')}</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
