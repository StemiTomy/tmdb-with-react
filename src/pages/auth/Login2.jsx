import React from 'react';
import { Card, Form, Input, Button, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import { useAuth } from '../../contexts/AuthContext';

const Login2 = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      message.success('Inicio de sesión exitoso');
      login(data.key, data.api_key || ''); // Ajusta si usas otro campo
      navigate('/profile');
    },
    onError: (error) => {
      const detail = error.response?.data?.non_field_errors?.[0] || 'Error al iniciar sesión';
      message.error(detail);
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
      background: '#f0f2f5',
      padding: '2rem'
    }}>
      <Card title="Iniciar sesión" style={{ width: 400 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
        >
          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[
              { required: true, message: 'Introduce tu correo' },
              { type: 'email', message: 'Correo no válido' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: 'Introduce tu contraseña' }]}
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
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login2;
