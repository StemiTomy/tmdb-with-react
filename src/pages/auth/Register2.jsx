import React from 'react';
import { Card, Form, Input, Button, Alert, message } from 'antd';
import { useMutation } from '@tanstack/react-query';
import { registerUser, loginUser } from '../../api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Register2 = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (data, variables) => {
      message.success('¡Registro exitoso! Iniciando sesión...');
      try {
        const loginResponse = await loginUser({
          email: variables.email,
          password: variables.password1,
        });
        // Puedes ajustar esto si devuelves "token" y "api_key" por separado
        login(loginResponse.key, loginResponse.api_key || ''); 
        navigate('/profile');
      } catch (loginError) {
        message.error('El registro fue exitoso pero hubo un error al iniciar sesión.');
      }
    },
    onError: (error) => {
      message.error(error.response?.data?.detail || 'Error al registrar');
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
      background: '#f5f5f5',
      padding: '2rem',
    }}>
      <Card title="Crear una cuenta" style={{ width: 400 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          autoComplete="off"
        >
          <Form.Item
            name="email"
            label="Correo electrónico"
            rules={[
              { required: true, message: 'Introduce tu correo' },
              { type: 'email', message: 'Correo no válido' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password1"
            label="Contraseña"
            rules={[{ required: true, message: 'Introduce tu contraseña' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="password2"
            label="Repetir contraseña"
            dependencies={['password1']}
            rules={[
              { required: true, message: 'Repite tu contraseña' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password1') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Las contraseñas no coinciden'));
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
              Registrarse
            </Button>
          </Form.Item>
        </Form>

      </Card>
    </div>
  );
};

export default Register2;
