import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from './Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  trend,
  icon,
  onClick,
  loading = false,
}) => {
  const getTrendIcon = () => {
    if (!change || trend === 'neutral') return <Minus className="h-4 w-4" />;
    return trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (!change || trend === 'neutral') return 'text-gray-500';
    return trend === 'up' ? 'text-success-600' : 'text-danger-600';
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="flex items-center">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover={!!onClick} onClick={onClick}>
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-2xl font-bold text-gray-900 mt-1"
          >
            {value}
          </motion.p>
          {change !== undefined && (
            <div className={`flex items-center mt-2 ${getTrendColor()}`}>
              {getTrendIcon()}
              <span className="text-sm font-medium ml-1">
                {Math.abs(change)}%
              </span>
              <span className="text-xs text-gray-500 ml-1">
                vs прошлый период
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;