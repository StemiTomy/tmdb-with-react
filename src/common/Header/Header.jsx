import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import {
  GlobalOutlined,
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  HomeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import Search from "../Search/Search";
import { useThemeAntd } from '../../contexts/ThemeProviderAntd'; // Nuevo ThemeProviderAntd

const { Header: AntHeader } = Layout;

export const Header = () => {
  const { isAuthenticated, apiKey, logout } = useAuth();
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { themeMode, toggleTheme } = useThemeAntd();
  const isDarkMode = themeMode === 'dark';

  useEffect(() => {
    if (themeMode === 'light') {
      document.getElementsByClassName("moon")[0]?.classList.add("sun");
      document.getElementsByClassName("tdnn")[0]?.classList.add("day");
    } else {
      document.getElementsByClassName("moon")[0]?.classList.remove("sun");
      document.getElementsByClassName("tdnn")[0]?.classList.remove("day");
    }
  }, [themeMode]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleLanguageChange = ({ key }) => {
    i18n.changeLanguage(key);
  };

  const languageMenu = {
    items: [
      { label: t('language.english'), key: 'en' },
      { label: t('language.spanish'), key: 'es' },
    ],
    onClick: handleLanguageChange,
  };

  return (
    <AntHeader
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 2rem',
        background: isDarkMode ? '#040e1b' : '#ffffff', // Puedes usar un token si quieres
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link to="/" style={{ color: 'inherit', fontWeight: 'bold', fontSize: '1.2rem' }}>
          🎬 StelutFlix
        </Link>

        {isAuthenticated && (
          <Menu
            theme={isDarkMode ? 'dark' : 'light'}
            mode="horizontal"
            selectable={false}
          >
            <Menu.Item key="home" icon={<HomeOutlined />}>
              <Link to="/">{t('home')}</Link>
            </Menu.Item>
            <Menu.Item key="profile" icon={<UserOutlined />}>
              <Link to="/profile">{t('profile')}</Link>
            </Menu.Item>
          </Menu>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {isAuthenticated && apiKey && (
          <Search apiKey={apiKey} />
        )}

        <Dropdown menu={languageMenu}>
          <Button
            icon={<GlobalOutlined />}
            type="primary"
          >
            {i18n.language.toUpperCase()}
          </Button>
        </Dropdown>

        {/* Botón Moon/Sun */}
        <div className="tdnn" onClick={toggleTheme}>
          <div className="moon"></div>
        </div>

        {isAuthenticated ? (
          <Button
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            type="primary"
          >
            {t('logout')}
          </Button>
        ) : (
          <>
            <Button icon={<UserAddOutlined />} type="primary">
              <Link to="/register" style={{ color: '#ffffff' }}>{t('register')}</Link>
            </Button>
            <Button icon={<LoginOutlined />} type="primary">
              <Link to="/login" style={{ color: '#ffffff' }}>{t('login')}</Link>
            </Button>
          </>
        )}
      </div>
    </AntHeader>
  );
};
