// src/types/index.ts

export interface User {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: UserRole;
    phone: string;
    role_display: string;
    full_name: string;
    is_active: boolean;
  }
  
  export type UserRole = 'owner' | 'manager' | 'installer';
  
  export interface Client {
    id: number;
    name: string;
    address: string;
    phone: string;
    source: ClientSource;
    source_display: string;
    created_at: string;
  }
  
  export type ClientSource = 'avito' | 'vk' | 'website' | 'recommendations' | 'other';
  
  export interface Service {
    id: number;
    name: string;
    cost_price: string;
    selling_price: string;
    category: ServiceCategory;
    category_display: string;
    profit_margin: number;
    created_at: string;
  }
  
  export type ServiceCategory = 'conditioner' | 'installation' | 'dismantling' | 'maintenance' | 'additional';
  
  export interface Order {
    id: number;
    client: number;
    client_name: string;
    client_phone: string;
    client_address: string;
    manager: number;
    manager_name: string;
    status: OrderStatus;
    status_display: string;
    installers: number[];
    installers_names: Array<{ id: number; name: string }>;
    total_cost: string;
    items: OrderItem[];
    items_count: number;
    total_profit: number;
    created_at: string;
    completed_at: string | null;
  }
  
  export type OrderStatus = 'new' | 'in_progress' | 'completed';
  
  export interface OrderItem {
    id: number;
    order: number;
    service: number;
    service_name: string;
    service_category: string;
    service_category_display: string;
    service_cost_price: string;
    price: string;
    seller: number;
    seller_name: string;
    profit: number;
    created_at: string;
  }
  
  export interface Transaction {
    id: number;
    type: TransactionType;
    type_display: string;
    amount: string;
    description: string;
    order: number | null;
    order_display: string;
    created_at: string;
  }
  
  export type TransactionType = 'income' | 'expense';
  
  export interface SalaryPayment {
    id: number;
    user: number;
    user_name: string;
    user_role: string;
    amount: string;
    period_start: string;
    period_end: string;
    period_display: string;
    created_at: string;
  }
  
  export interface InstallationSchedule {
    id: number;
    order_id: number;
    client_name: string;
    client_address: string;
    client_phone: string;
    manager: string;
    start_time: string;
    end_time: string;
    status: ScheduleStatus;
    status_display: string;
    priority: SchedulePriority;
    priority_display: string;
    installers: Array<{ id: number; name: string }>;
    notes: string;
    is_overdue: boolean;
    estimated_duration: string;
  }
  
  export type ScheduleStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  export type SchedulePriority = 'low' | 'normal' | 'high' | 'urgent';
  
  // API Response types
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    errors?: Record<string, string[]>;
    meta?: {
      count: number;
      next: string | null;
      previous: string | null;
    };
  }
  
  export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
  }
  
  // Dashboard Stats
  export interface OwnerStats {
    total_orders: number;
    completed_orders: number;
    orders_this_month: number;
    total_clients: number;
    clients_this_month: number;
    company_balance: number;
    income_this_month: number;
    expense_this_month: number;
    role: 'owner';
  }
  
  export interface ManagerStats {
    total_orders: number;
    completed_orders: number;
    orders_this_month: number;
    total_revenue: number;
    role: 'manager';
  }
  
  export interface InstallerStats {
    total_orders: number;
    completed_orders: number;
    in_progress_orders: number;
    orders_this_month: number;
    role: 'installer';
  }
  
  export type DashboardStats = OwnerStats | ManagerStats | InstallerStats;
  
  // Form types
  export interface LoginForm {
    username: string;
    password: string;
  }
  
  export interface ClientForm {
    name: string;
    address: string;
    phone: string;
    source: ClientSource;
  }
  
  export interface ServiceForm {
    name: string;
    cost_price: number;
    selling_price: number;
    category: ServiceCategory;
  }
  
  export interface OrderForm {
    client: number;
    manager: number;
    installers: number[];
    status: OrderStatus;
  }
  
  export interface OrderItemForm {
    service: number;
    price: number;
    seller: number;
  }
  
  // Filter types
  export interface ClientsFilter {
    source?: ClientSource;
    search?: string;
    page?: number;
  }
  
  export interface OrdersFilter {
    status?: OrderStatus;
    manager?: number;
    search?: string;
    page?: number;
  }
  
  export interface ServicesFilter {
    category?: ServiceCategory;
    search?: string;
    page?: number;
  }
  
  // UI State types
  export interface NotificationState {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
    duration?: number;
  }
  
  export interface ModalState {
    isOpen: boolean;
    type: 'client' | 'order' | 'service' | 'schedule' | null;
    data?: any;
  }
  
  export interface SidebarState {
    isCollapsed: boolean;
    isMobileOpen: boolean;
  }
  
  // Chart data types
  export interface ChartDataPoint {
    label: string;
    value: number;
    color?: string;
  }
  
  export interface TimeSeriesDataPoint {
    date: string;
    value: number;
    label?: string;
  }
  
  export interface TrendData {
    period: string;
    income: number;
    expense: number;
    profit: number;
  }
  
  // Calendar types
  export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    allDay?: boolean;
    resource?: any;
  }
  
  export interface RouteOptimization {
    id: number;
    installer_id: number;
    date: string;
    total_distance: number;
    total_travel_time: string;
    schedules: InstallationSchedule[];
  }
  
  // Permission types
  export interface Permission {
    module: string;
    actions: string[];
  }
  
  export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    owner: [
      { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'clients', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'services', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'orders', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'finance', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'calendar', actions: ['create', 'read', 'update', 'delete'] },
      { module: 'salary', actions: ['create', 'read', 'update', 'delete'] },
    ],
    manager: [
      { module: 'clients', actions: ['create', 'read', 'update'] },
      { module: 'services', actions: ['read'] },
      { module: 'orders', actions: ['create', 'read', 'update'] },
      { module: 'calendar', actions: ['create', 'read', 'update'] },
    ],
    installer: [
      { module: 'clients', actions: ['read'] },
      { module: 'services', actions: ['read'] },
      { module: 'orders', actions: ['read', 'update'] },
      { module: 'calendar', actions: ['read', 'update'] },
    ],
  };
  
  // Utility types
  export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';
  
  export interface AsyncState<T> {
    data: T | null;
    loading: LoadingState;
    error: string | null;
  }
  
  export type Theme = 'light' | 'dark';
  
  export interface AppConfig {
    apiBaseUrl: string;
    theme: Theme;
    language: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  }