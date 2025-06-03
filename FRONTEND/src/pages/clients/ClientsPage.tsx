// src/pages/clients/ClientsPage.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Phone,
  MapPin,
  Eye,
  Edit,
  Trash2,
  Users,
} from 'lucide-react';

// Hooks and Store
import { useAppDispatch } from '../../hooks/redux';
import { useGetClientsQuery, useDeleteClientMutation } from '../../store/api/clientsApi';
import { addNotification } from '../../store/slices/notificationSlice';
import { openModal } from '../../store/slices/uiSlice';

// Components
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Table, { Column, Action } from '../../components/common/Table';
import StatCard from '../../components/common/StatCard';
import Modal from '../../components/common/Modal';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Types
import { Client, ClientSource, ClientsFilter } from '../../types';

const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Local state
  const [filters, setFilters] = useState<ClientsFilter>({
    search: '',
    source: undefined,
    page: 1,
  });
  const [selectedClients, setSelectedClients] = useState<number[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [sortBy, setSortBy] = useState<string>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // API calls
  const { data: clientsResponse, isLoading, error } = useGetClientsQuery(filters);
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();

  const clients = clientsResponse?.results || [];
  const totalClients = clientsResponse?.count || 0;

  // Computed values
  const clientStats = useMemo(() => {
    const stats = {
      total: totalClients,
      thisMonth: 0,
      bySource: {} as Record<ClientSource, number>,
    };

    clients.forEach((client) => {
      const createdAt = new Date(client.created_at);
      const now = new Date();
      const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
      
      if (createdAt >= monthAgo) {
        stats.thisMonth++;
      }

      stats.bySource[client.source] = (stats.bySource[client.source] || 0) + 1;
    });

    return stats;
  }, [clients, totalClients]);

  // Handlers
  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key: keyof ClientsFilter, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSort = (key: string, order: 'asc' | 'desc') => {
    setSortBy(key);
    setSortOrder(order);
  };

  const handleDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      await deleteClient(clientToDelete.id).unwrap();
      dispatch(addNotification({
        type: 'success',
        title: 'Клиент удален',
        message: `Клиент ${clientToDelete.name} был успешно удален`,
      }));
      setShowDeleteModal(false);
      setClientToDelete(null);
    } catch (error) {
      dispatch(addNotification({
        type: 'error',
        title: 'Ошибка удаления',
        message: 'Не удалось удалить клиента. Попробуйте еще раз.',
      }));
    }
  };

  const handleBulkDelete = async () => {
    // Implementation for bulk delete
    console.log('Bulk delete:', selectedClients);
  };

  const exportClients = () => {
    // Implementation for export
    window.open('/api/export/clients/', '_blank');
  };

  // Table configuration
  const columns: Column<Client>[] = [
    {
      key: 'id',
      title: 'ID',
      width: '80px',
      sortable: true,
    },
    {
      key: 'name',
      title: 'Имя клиента',
      sortable: true,
      render: (_, client) => (
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
            <span className="text-sm font-medium text-primary-700">
              {client.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{client.name}</p>
            <p className="text-sm text-gray-500 flex items-center">
              <Phone className="h-3 w-3 mr-1" />
              {client.phone}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'address',
      title: 'Адрес',
      render: (address) => (
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          <span className="truncate max-w-xs" title={address}>
            {address}
          </span>
        </div>
      ),
    },
    {
      key: 'source',
      title: 'Источник',
      sortable: true,
      render: (_, client) => {
        const sourceColors = {
          avito: 'bg-blue-100 text-blue-800',
          vk: 'bg-purple-100 text-purple-800',
          website: 'bg-green-100 text-green-800',
          recommendations: 'bg-yellow-100 text-yellow-800',
          other: 'bg-gray-100 text-gray-800',
        };
        
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            sourceColors[client.source]
          }`}>
            {client.source_display}
          </span>
        );
      },
    },
    {
      key: 'created_at',
      title: 'Дата создания',
      sortable: true,
      render: (date) => (
        <span className="text-sm text-gray-600">
          {new Date(date).toLocaleDateString('ru-RU')}
        </span>
      ),
    },
  ];

  const actions: Action<Client>[] = [
    {
      label: 'Просмотр',
      icon: <Eye className="h-4 w-4" />,
      onClick: (client) => navigate(`/clients/${client.id}`),
    },
    {
      label: 'Редактировать',
      icon: <Edit className="h-4 w-4" />,
      onClick: (client) => dispatch(openModal({ type: 'client', data: client })),
    },
    {
      label: 'Удалить',
      icon: <Trash2 className="h-4 w-4" />,
      variant: 'danger',
      onClick: (client) => {
        setClientToDelete(client);
        setShowDeleteModal(true);
      },
    },
  ];

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-danger-600">Ошибка загрузки клиентов</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Попробовать еще раз
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-primary-600" />
            Клиенты
          </h1>
          <p className="text-gray-600 mt-1">
            Управление базой клиентов и их контактной информацией
          </p>
        </div>
        
        <div className="mt-4 lg:mt-0 flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            icon={<Upload className="h-4 w-4" />}
            onClick={() => document.getElementById('import-input')?.click()}
          >
            Импорт
          </Button>
          <Button
            variant="secondary"
            icon={<Download className="h-4 w-4" />}
            onClick={exportClients}
          >
            Экспорт
          </Button>
          <Button
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            onClick={() => dispatch(openModal({ type: 'client' }))}
          >
            Добавить клиента
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
      >
        <StatCard
          title="Всего клиентов"
          value={clientStats.total}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Новые за месяц"
          value={clientStats.thisMonth}
          change={15}
          trend="up"
          icon={<Plus className="h-6 w-6" />}
        />
        <StatCard
          title="Авито"
          value={clientStats.bySource.avito || 0}
          icon={<span className="text-blue-600 font-bold">A</span>}
        />
        <StatCard
          title="ВК"
          value={clientStats.bySource.vk || 0}
          icon={<span className="text-purple-600 font-bold">VK</span>}
        />
        <StatCard
          title="Сайт"
          value={clientStats.bySource.website || 0}
          icon={<span className="text-green-600 font-bold">W</span>}
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск по имени, телефону или адресу..."
                  value={filters.search || ''}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                />
              </div>
            </div>

            {/* Source Filter */}
            <div className="lg:w-48">
              <select
                value={filters.source || ''}
                onChange={(e) => handleFilterChange('source', e.target.value || undefined)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
              >
                <option value="">Все источники</option>
                <option value="avito">Авито</option>
                <option value="vk">ВК</option>
                <option value="website">Сайт</option>
                <option value="recommendations">Рекомендации</option>
                <option value="other">Другое</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(filters.search || filters.source) && (
              <Button
                variant="ghost"
                onClick={() => setFilters({ search: '', source: undefined, page: 1 })}
              >
                Сбросить
              </Button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedClients.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-primary-200 bg-primary-50">
              <div className="flex items-center justify-between">
                <span className="text-primary-700 font-medium">
                  Выбрано клиентов: {selectedClients.length}
                </span>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={exportClients}>
                    Экспорт выбранных
                  </Button>
                  <Button size="sm" variant="danger" onClick={handleBulkDelete}>
                    Удалить выбранных
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Table
          data={clients}
          columns={columns}
          actions={actions}
          loading={isLoading}
          onRowClick={(client) => navigate(`/clients/${client.id}`)}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
        />
      </motion.div>

      {/* Pagination */}
      {clientsResponse && clientsResponse.count > 20 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center"
        >
          <div className="flex items-center space-x-2">
            {/* Pagination controls would go here */}
            <span className="text-sm text-gray-600">
              Показано {clients.length} из {totalClients}
            </span>
          </div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Подтверждение удаления"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Отмена
            </Button>
            <Button
              variant="danger"
              loading={isDeleting}
              onClick={handleDeleteClient}
            >
              Удалить
            </Button>
          </>
        }
      >
        <p className="text-gray-600">
          Вы уверены, что хотите удалить клиента{' '}
          <strong>{clientToDelete?.name}</strong>?
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Это действие нельзя отменить. Все связанные заказы останутся в системе.
        </p>
      </Modal>

      {/* Hidden file input for import */}
      <input
        id="import-input"
        type="file"
        accept=".csv,.xlsx"
        className="hidden"
        onChange={(e) => {
          // Handle file import
          console.log('Import file:', e.target.files?.[0]);
        }}
      />
    </div>
  );
};

export default ClientsPage;