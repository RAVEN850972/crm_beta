// src/pages/dashboard/DashboardPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../hooks/redux';
import { useQuery } from 'react-query';
import {
  Users,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
  Clock,
  Target,
  Award,
} from 'lucide-react';

// Components
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';

// Charts
import RevenueChart from './components/RevenueChart';
import OrdersChart from './components/OrdersChart';
import SourcesChart from './components/SourcesChart';
import ActivityFeed from './components/ActivityFeed';
import TopPerformers from './components/TopPerformers';

// API
import { dashboardApi } from '../../store/api/dashboardApi';

const DashboardPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [dateRange, setDateRange] = useState('month');

  const { data: stats, isLoading: statsLoading } = dashboardApi.useGetDashboardStatsQuery();
  const { data: recentOrders, isLoading: ordersLoading } = dashboardApi.useGetRecentOrdersQuery({ limit: 5 });
  const { data: upcomingSchedules, isLoading: schedulesLoading } = dashboardApi.useGetUpcomingSchedulesQuery({ limit: 5 });

  if (statsLoading) {
    return (
      <div className="min-h-96 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Загрузка дашборда..." />
      </div>
    );
  }

  const renderOwnerDashboard = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Всего заказов"
          value={stats?.total_orders || 0}
          change={15}
          trend="up"
          icon={<ShoppingCart className="h-6 w-6" />}
        />
        <StatCard
          title="Клиенты"
          value={stats?.total_clients || 0}
          change={8}
          trend="up"
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Выручка"
          value={`${(stats?.income_this_month || 0).toLocaleString()} ₽`}
          change={22}
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Баланс"
          value={`${(stats?.company_balance || 0).toLocaleString()} ₽`}
          change={5}
          trend="up"
          icon={<TrendingUp className="h-6 w-6" />}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Динамика продаж</h3>
            <div className="flex space-x-2">
              {['week', 'month', 'quarter'].map((period) => (
                <button
                  key={period}
                  onClick={() => setDateRange(period)}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    dateRange === period
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {period === 'week' ? 'Неделя' : period === 'month' ? 'Месяц' : 'Квартал'}
                </button>
              ))}
            </div>
          </div>
          <RevenueChart period={dateRange} />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Заказы по статусам</h3>
          <OrdersChart />
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Источники клиентов</h3>
          <SourcesChart />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Топ менеджеры</h3>
          <TopPerformers />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Последние события</h3>
          <ActivityFeed activities={[
            { id: 1, type: 'order_completed', message: 'Заказ #1234 завершен', time: '2 мин назад' },
            { id: 2, type: 'client_added', message: 'Новый клиент Иванов И.И.', time: '15 мин назад' },
            { id: 3, type: 'payment_received', message: 'Получен платеж 45 000 ₽', time: '1 час назад' },
          ]} />
        </Card>
      </div>
    </div>
  );

  const renderManagerDashboard = () => (
    <div className="space-y-6">
      {/* Manager Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Мои заказы"
          value={stats?.total_orders || 0}
          change={12}
          trend="up"
          icon={<ShoppingCart className="h-6 w-6" />}
        />
        <StatCard
          title="Завершено"
          value={stats?.completed_orders || 0}
          change={18}
          trend="up"
          icon={<Award className="h-6 w-6" />}
        />
        <StatCard
          title="Выручка"
          value={`${(stats?.total_revenue || 0).toLocaleString()} ₽`}
          change={25}
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
        />
        <StatCard
          title="Конверсия"
          value="68%"
          change={5}
          trend="up"
          icon={<Target className="h-6 w-6" />}
        />
      </div>

      {/* Manager Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Мои продажи</h3>
          <RevenueChart period={dateRange} />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Активные заказы</h3>
          <div className="space-y-3">
            {recentOrders?.map((order: any) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">#{order.id}</p>
                  <p className="text-sm text-gray-600">{order.client_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{order.total_cost} ₽</p>
                  <p className={`text-xs ${
                    order.status === 'completed' ? 'text-success-600' :
                    order.status === 'in_progress' ? 'text-warning-600' :
                    'text-primary-600'
                  }`}>
                    {order.status_display}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрые действия</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="primary" icon={<Users />}>
            Новый клиент
          </Button>
          <Button variant="secondary" icon={<ShoppingCart />}>
            Создать заказ
          </Button>
          <Button variant="ghost" icon={<Calendar />}>
            Календарь
          </Button>
          <Button variant="ghost" icon={<DollarSign />}>
            Расчет зарплаты
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderInstallerDashboard = () => (
    <div className="space-y-6">
      {/* Installer Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Сегодня монтажей"
          value={3}
          icon={<Calendar className="h-6 w-6" />}
        />
        <StatCard
          title="Завершено"
          value={stats?.completed_orders || 0}
          change={15}
          trend="up"
          icon={<Award className="h-6 w-6" />}
        />
        <StatCard
          title="В процессе"
          value={stats?.in_progress_orders || 0}
          icon={<Clock className="h-6 w-6" />}
        />
        <StatCard
          title="Заработано"
          value="45 000 ₽"
          change={12}
          trend="up"
          icon={<DollarSign className="h-6 w-6" />}
        />
      </div>

      {/* Today's Schedule */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Расписание на сегодня</h3>
          <Button size="sm" variant="secondary">
            Показать маршрут
          </Button>
        </div>
        
        <div className="space-y-4">
          {upcomingSchedules?.map((schedule: any, index: number) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      schedule.status === 'completed' ? 'bg-success-500' :
                      schedule.status === 'in_progress' ? 'bg-warning-500' :
                      'bg-primary-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">
                        {schedule.start_time} - {schedule.end_time}
                      </p>
                      <p className="text-sm text-gray-600">
                        {schedule.client_name}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    📍 {schedule.client_address}
                  </p>
                  <p className="text-sm text-gray-500">
                    📞 {schedule.client_phone}
                  </p>
                </div>
                
                <div className="flex flex-col space-y-2">
                  {schedule.status === 'scheduled' && (
                    <Button size="sm" variant="primary">
                      Начать работу
                    </Button>
                  )}
                  {schedule.status === 'in_progress' && (
                    <Button size="sm" variant="success">
                      Завершить
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    Позвонить
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Моя статистика</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Среднее время монтажа</span>
              <span className="font-medium">3.2 часа</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Рейтинг качества</span>
              <span className="font-medium text-success-600">4.8/5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Выполнено в срок</span>
              <span className="font-medium">95%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Жалобы</span>
              <span className="font-medium text-success-600">0</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Цели месяца</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Количество монтажей</span>
                <span>15/20</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Доп. услуги</span>
                <span>8/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-success-600 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Качество работ</span>
                <span>4.8/5.0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-success-600 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Добро пожаловать, {user?.first_name || user?.username}!
            </h1>
            <p className="text-primary-100 mt-1">
              {new Date().toLocaleDateString('ru-RU', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4 text-primary-100">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {new Date().toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                <p className="text-sm">Текущее время</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Role-based Dashboard Content */}
      {user?.role === 'owner' && renderOwnerDashboard()}
      {user?.role === 'manager' && renderManagerDashboard()}
      {user?.role === 'installer' && renderInstallerDashboard()}
    </div>
  );
};

export default DashboardPage;