import React from 'react';
import { Card, Form, Input, Button, message, theme as antdTheme } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { registerUser, loginUser } from '../../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeAntd } from '../../contexts/ThemeProviderAntd';
import { useTranslation } from 'react-i18next';

const Register2 = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { themeMode } = useThemeAntd();
  const isDarkMode = themeMode === 'dark';
  const { token } = antdTheme.useToken();
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data, variables) => {
      message.success(t('register_success'));
      try {
        const loginResponse = await loginUser({
          email: variables.email,
          password: variables.password1,
        });
        login(loginResponse.key, loginResponse.api_key || '');
        navigate('/profile');
      } catch (loginError) {
        message.error(t('register_login_error'));
      }
    },
    onError: (error) => {
      const data = error?.response?.data;

      if (!data) {
        message.error(t('register_error_unknown'));
        return;
      }

      if (typeof data === 'string') {
        message.error(data);
      } else if (Array.isArray(data)) {
        data.forEach((msg) => message.error(msg));
      } else if (typeof data === 'object') {
        Object.entries(data).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((msg) => message.error(`${field}: ${msg}`));
          } else {
            message.error(`${field}: ${messages}`);
          }
        });
      } else {
        message.error(t('register_error_generic'));
      }
    }
  });

  const handleFinish = (values) => {
    mutation.mutate(values);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: token.colorBgBase,
    }}>
      <Card
        title={t('register_title')}
        variant="borderless"
        style={{
          width: 400,
          borderRadius: token.borderRadiusLG,
          boxShadow: isDarkMode
            ? '0 4px 12px rgba(0, 0, 0, 0.7)'
            : '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: token.colorBgContainer,
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
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label={t('register_email_label')}
            rules={[
              { required: true, message: t('register_email_required') },
              { type: 'email', message: t('register_email_invalid') },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password1"
            label={t('register_password_label')}
            rules={[{ required: true, message: t('register_password_required') }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="password2"
            label={t('register_confirm_password_label')}
            dependencies={['password1']}
            rules={[
              { required: true, message: t('register_confirm_password_required') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password1') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t('register_passwords_mismatch')));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={mutation.isLoading}
              block
            >
              {t('register_button')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register2;
