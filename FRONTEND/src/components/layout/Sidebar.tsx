import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { toggleSidebar, setMobileSidebarOpen } from '../../store/slices/uiSlice';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Wrench,
  DollarSign,
  Calendar,
  Settings,
  Menu,
  X,
  Building2,
  Calculator,
} from 'lucide-react';
import { UserRole } from '../../types';

interface MenuItem {
  title: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
  badge?: string | number;
}

const menuItems: MenuItem[] = [
  {
    title: 'Дашборд',
    path: '/dashboard',
    icon: LayoutDashboard,
    roles: ['owner', 'manager', 'installer'],
  },
  {
    title: 'Клиенты',
    path: '/clients',
    icon: Users,
    roles: ['owner', 'manager', 'installer'],
  },
  {
    title: 'Заказы',
    path: '/orders',
    icon: ShoppingCart,
    roles: ['owner', 'manager', 'installer'],
  },
  {
    title: 'Услуги',
    path: '/services',
    icon: Wrench,
    roles: ['owner', 'manager', 'installer'],
  },
  {
    title: 'Финансы',
    path: '/finance',
    icon: DollarSign,
    roles: ['owner'],
  },
  {
    title: 'Календарь',
    path: '/calendar',
    icon: Calendar,
    roles: ['owner', 'manager', 'installer'],
  },
  {
    title: 'Зарплаты',
    path: '/salary-config',
    icon: Calculator,
    roles: ['owner'],
  },
  {
    title: 'Настройки',
    path: '/settings',
    icon: Settings,
    roles: ['owner'],
  },
];

const Sidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sidebar } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const filteredMenuItems = menuItems.filter((item) =>
    user ? item.roles.includes(user.role) : false
  );

  const handleItemClick = () => {
    if (sidebar.isMobileOpen) {
      dispatch(setMobileSidebarOpen(false));
    }
  };

  const sidebarVariants = {
    expanded: { width: '16rem' },
    collapsed: { width: '4rem' },
  };

  const mobileVariants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.div
        className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 z-40"
        variants={sidebarVariants}
        animate={sidebar.isCollapsed ? 'collapsed' : 'expanded'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200 shadow-lg">
          {/* Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary-600">
            <Building2 className="h-8 w-8 text-white" />
            {!sidebar.isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="ml-3 text-lg font-semibold text-white"
              >
                CRM Климат
              </motion.span>
            )}
          </div>

          {/* Toggle button */}
          <div className="flex justify-end p-2 border-b border-gray-200">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleItemClick}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-100 text-primary-900 border-r-4 border-primary-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon
                    className={`flex-shrink-0 h-6 w-6 ${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {!sidebar.isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                      className="ml-3"
                    >
                      {item.title}
                    </motion.span>
                  )}
                  {!sidebar.isCollapsed && item.badge && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {item.badge}
                    </motion.span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User info */}
          {!sidebar.isCollapsed && user && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex-shrink-0 flex border-t border-gray-200 p-4"
            >
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user.first_name?.charAt(0) || user.username.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user.full_name || user.username}
                  </p>
                  <p className="text-xs text-gray-500">{user.role_display}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      <motion.div
        className="lg:hidden fixed inset-y-0 left-0 z-50 w-64"
        variants={mobileVariants}
        animate={sidebar.isMobileOpen ? 'open' : 'closed'}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-xl">
          {/* Logo and close button */}
          <div className="flex items-center justify-between h-16 px-4 bg-primary-600">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-white" />
              <span className="ml-3 text-lg font-semibold text-white">
                CRM Климат
              </span>
            </div>
            <button
              onClick={() => dispatch(setMobileSidebarOpen(false))}
              className="p-2 rounded-md text-white hover:bg-primary-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {filteredMenuItems.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={handleItemClick}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-100 text-primary-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon
                    className={`mr-3 flex-shrink-0 h-6 w-6 ${
                      isActive ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.title}
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User info */}
          {user && (
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user.first_name?.charAt(0) || user.username.charAt(0)}
                  </span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {user.full_name || user.username}
                  </p>
                  <p className="text-xs text-gray-500">{user.role_display}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;