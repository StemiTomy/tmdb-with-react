import React from 'react';
import { Card, Form, Input, Button, message, theme as antdTheme } from 'antd'; // 👈 añadimos theme
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeAntd } from '../../contexts/ThemeProviderAntd'; 
import { useTranslation } from 'react-i18next';

const Login2 = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const { themeMode } = useThemeAntd();
  const isDarkMode = themeMode === 'dark';

  // 🧠 Accedemos a todos los tokens (colores, tamaños, radios, etc.)
  const { token } = antdTheme.useToken();
  
  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      message.success(t('login_success'));
      login(data);
      navigate('/profile');
    },
    onError: (error) => {
      const detail = error.response?.data?.non_field_errors?.[0] || t('login_error');
      message.error(detail);
    }
  });

  const handleFinish = (values) => {
    mutation.mutate(values);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        backgroundColor: token.colorBgBase, // 🎯 Aquí aplicamos el color base oficial
      }}
    >
      <Card
        title={t('login_title')}
        variant="borderless"
        style={{
          width: 400,
          borderRadius: token.borderRadiusLG,
          boxShadow: isDarkMode
            ? '0 4px 12px rgba(0, 0, 0, 0.7)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: token.colorBgContainer, // 🎯 Fondo de la Card correcto
        }}
        styles={{
          header: {
            borderBottom: isDarkMode
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.06)',
            color: token.colorTextBase,
          },
          body: {
            color: token.colorTextBase,
          }
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            name="email"
            label={t('login_email_label')}
            rules={[
              { required: true, message: t('login_email_required') },
              { type: 'email', message: t('login_email_invalid') },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label={t('login_password_label')}
            rules={[{ required: true, message: t('login_password_required') }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={mutation.isLoading}
            >
              {t('login')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login2;
