import React from 'react';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, MoreHorizontal } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

export interface Column<T> {
  key: keyof T | string;
  title: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface Action<T> {
  label: string;
  onClick: (record: T) => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'danger';
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  actions?: Action<T>[];
  rowKey?: keyof T | ((record: T) => string | number);
  onRowClick?: (record: T) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (key: string, order: 'asc' | 'desc') => void;
  className?: string;
}

function Table<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  actions,
  rowKey = 'id',
  onRowClick,
  sortBy,
  sortOrder,
  onSort,
  className = '',
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index;
  };

  const handleSort = (key: string) => {
    if (!onSort) return;
    
    if (sortBy === key) {
      onSort(key, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(key, 'asc');
    }
  };

  const getValue = (record: T, key: string) => {
    return key.split('.').reduce((obj, k) => obj?.[k], record);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <LoadingSpinner text="Загрузка данных..." />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.align === 'center' ? 'text-center' :
                    column.align === 'right' ? 'text-right' : 'text-left'
                  } ${column.sortable ? 'cursor-pointer hover:bg-gray-100 transition-colors' : ''}`}
                  style={{ width: column.width }}
                  onClick={() => column.sortable && handleSort(String(column.key))}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && (
                      <div className="flex flex-col">
                        <ChevronUp
                          className={`h-3 w-3 ${
                            sortBy === column.key && sortOrder === 'asc'
                              ? 'text-primary-600'
                              : 'text-gray-400'
                          }`}
                        />
                        <ChevronDown
                          className={`h-3 w-3 -mt-1 ${
                            sortBy === column.key && sortOrder === 'desc'
                              ? 'text-primary-600'
                              : 'text-gray-400'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {actions && actions.length > 0 && (
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((record, index) => (
              <motion.tr
                key={getRowKey(record, index)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.2 }}
                className={`hover:bg-gray-50 transition-colors ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick?.(record)}
              >
                {columns.map((column) => {
                  const value = getValue(record, String(column.key));
                  const cellContent = column.render
                    ? column.render(value, record, index)
                    : value;

                  return (
                    <td
                      key={String(column.key)}
                      className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${
                        column.align === 'center' ? 'text-center' :
                        column.align === 'right' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {cellContent}
                    </td>
                  );
                })}
                {actions && actions.length > 0 && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {actions.map((action, actionIndex) => (
                        <button
                          key={actionIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            action.onClick(record);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            action.variant === 'danger'
                              ? 'text-danger-600 hover:bg-danger-50'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                          title={action.label}
                        >
                          {action.icon || <MoreHorizontal className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Нет данных для отображения</p>
        </div>
      )}
    </div>
  );
}

export default Table;