// src/pages/auth/LoginPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../hooks/redux';
import { useLoginMutation } from '../../store/api/authApi';
import { setUser } from '../../store/slices/authSlice';
import { addNotification } from '../../store/slices/notificationSlice';
import {
  Eye,
  EyeOff,
  Building2,
  Lock,
  User,
  AlertCircle,
} from 'lucide-react';

// Components
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

interface LoginFormData {
  username: string;
  password: string;
}

const loginSchema = yup.object({
  username: yup
    .string()
    .required('Введите имя пользователя')
    .min(3, 'Минимум 3 символа'),
  password: yup
    .string()
    .required('Введите пароль')
    .min(6, 'Минимум 6 символов'),
});

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data).unwrap();
      
      if (result.success && result.user) {
        dispatch(setUser(result.user));
        dispatch(addNotification({
          type: 'success',
          title: 'Добро пожаловать!',
          message: 'Вы успешно вошли в систему',
        }));
        navigate('/dashboard');
      }
    } catch (error: any) {
      if (error.data?.error) {
        setError('root', { message: error.data.error });
      } else {
        dispatch(addNotification({
          type: 'error',
          title: 'Ошибка входа',
          message: 'Проверьте имя пользователя и пароль',
        }));
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-xl mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CRM Климат
          </h1>
          <p className="text-gray-600">
            Система управления монтажными работами
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="shadow-strong">
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Вход в систему
                </h2>
                <p className="text-gray-600">
                  Введите ваши учетные данные для продолжения
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Имя пользователя
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('username')}
                      type="text"
                      placeholder="Введите имя пользователя"
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        errors.username
                          ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                          : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.username && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-danger-600 flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.username.message}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Пароль
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      {...register('password')}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Введите пароль"
                      className={`block w-full pl-10 pr-10 py-3 border rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
                        errors.password
                          ? 'border-danger-300 focus:ring-danger-500 focus:border-danger-500'
                          : 'border-gray-300'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-sm text-danger-600 flex items-center"
                    >
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Error Message */}
                {errors.root && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-danger-50 border border-danger-200 rounded-lg p-3"
                  >
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-danger-600 mr-2" />
                      <p className="text-sm text-danger-700">
                        {errors.root.message}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full py-3 text-base"
                  size="lg"
                >
                  Войти в систему
                </Button>
              </form>

              {/* Demo Accounts */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Демо аккаунты для тестирования:
                </p>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Владелец:</span>
                      <span className="text-gray-600">admin / admin123</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Менеджер:</span>
                      <span className="text-gray-600">manager / manager123</span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">Монтажник:</span>
                      <span className="text-gray-600">installer / installer123</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            © 2024 CRM Климат. Все права защищены.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
