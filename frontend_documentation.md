# Документация для Frontend разработчиков
## CRM система для установки кондиционеров

### Содержание
- [Обзор системы](#обзор-системы)
- [Архитектура API](#архитектура-api)
- [Аутентификация](#аутентификация)
- [Ролевая модель](#ролевая-модель)
- [API Endpoints](#api-endpoints)
- [Модели данных](#модели-данных)
- [Примеры использования](#примеры-использования)
- [Обработка ошибок](#обработка-ошибок)
- [WebSocket события](#websocket-события)

---

## Обзор системы

CRM система предназначена для управления бизнес-процессами компании по установке кондиционеров. Система включает:

- **Управление клиентами** - ведение базы клиентов с источниками привлечения
- **Система заказов** - полный цикл от создания до выполнения
- **Управление услугами** - каталог с себестоимостью и ценами продажи
- **Финансовый учет** - доходы, расходы, расчет прибыли
- **Расчет зарплат** - гибкая система с процентами от прибыли
- **Календарь монтажей** - планирование работ и оптимизация маршрутов
- **Аналитика** - дашборды и отчеты

### Технический стек Backend
- Django 5.2.1 + Django REST Framework
- PostgreSQL / SQLite
- Поддержка CORS для SPA

---

## Архитектура API

### Base URL
```
https://your-domain.com/api/
```

### Формат ответов
Все API возвращают JSON в едином формате:

**Успешный ответ:**
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "count": 100,
    "next": "https://api.example.com/users/?page=2",
    "previous": null
  }
}
```

**Ошибка:**
```json
{
  "success": false,
  "error": "Описание ошибки",
  "errors": {
    "field_name": ["Конкретная ошибка поля"]
  }
}
```

### Пагинация
Используется стандартная пагинация DRF:
- `page` - номер страницы
- `page_size` - размер страницы (по умолчанию 20)

---

## Аутентификация

### Session Authentication (рекомендуется для SPA)
```javascript
// Логин
const login = async (username, password) => {
  const response = await fetch('/user_accounts/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCsrfToken(),
    },
    credentials: 'include',
    body: JSON.stringify({ username, password })
  });
  
  const data = await response.json();
  return data;
};

// Получение CSRF токена
const getCsrfToken = () => {
  return document.querySelector('[name=csrfmiddlewaretoken]')?.value ||
         document.cookie.match(/csrftoken=([^;]*)/)?.[1];
};
```

### Проверка авторизации
```javascript
const checkAuth = async () => {
  const response = await fetch('/api/users/me/', {
    credentials: 'include'
  });
  
  if (response.ok) {
    return await response.json();
  }
  throw new Error('Not authenticated');
};
```

---

## Ролевая модель

### Роли пользователей
1. **owner** - Владелец (полный доступ)
2. **manager** - Менеджер (работа с клиентами и заказами)
3. **installer** - Монтажник (просмотр назначенных заказов)

### Права доступа по модулям

| Модуль | Owner | Manager | Installer |
|--------|-------|---------|-----------|
| Пользователи | CRUD | Read (монтажники) | Read (себя) |
| Клиенты | CRUD | CRUD | Read (свои заказы) |
| Услуги | CRUD | Read | Read |
| Заказы | CRUD | CRUD (свои) | Read (назначенные) |
| Финансы | CRUD | - | Read (своя зарплата) |
| Настройки зарплат | CRUD | - | - |
| Календарь | CRUD | CRUD (свои) | Read/Update (свои) |

---

## API Endpoints

### Пользователи (`/api/users/`)

**GET** `/api/users/` - Список пользователей
```javascript
// Фильтры
const params = new URLSearchParams({
  role: 'manager',           // owner, manager, installer
  search: 'Иван',           // поиск по ФИО
  page: 1
});

const response = await fetch(`/api/users/?${params}`);
```

**GET** `/api/users/me/` - Текущий пользователь
```javascript
const currentUser = await fetch('/api/users/me/').then(r => r.json());
```

**POST** `/api/users/` - Создание пользователя (только owner)
```javascript
const userData = {
  username: 'ivan_petrov',
  first_name: 'Иван',
  last_name: 'Петров',
  email: 'ivan@example.com',
  role: 'manager',
  phone: '+79991234567',
  password: 'secure_password'
};
```

### Клиенты (`/api/clients/`)

**GET** `/api/clients/` - Список клиентов
```javascript
const params = new URLSearchParams({
  source: 'avito',          // avito, vk, website, recommendations, other
  search: 'Иванов',         // поиск по имени/телефону/адресу
  page: 1
});
```

**Модель клиента:**
```typescript
interface Client {
  id: number;
  name: string;
  address: string;
  phone: string;
  source: 'avito' | 'vk' | 'website' | 'recommendations' | 'other';
  source_display: string;
  created_at: string;
}
```

**POST** `/api/clients/` - Создание клиента
```javascript
const clientData = {
  name: 'Иван Иванов',
  address: 'г. Москва, ул. Ленина, д. 1',
  phone: '+79991234567',
  source: 'avito'
};
```

### Услуги (`/api/services/`)

**GET** `/api/services/` - Каталог услуг
```javascript
const params = new URLSearchParams({
  category: 'conditioner',   // conditioner, installation, dismantling, maintenance, additional
  search: 'Samsung',         // поиск по названию
});
```

**Модель услуги:**
```typescript
interface Service {
  id: number;
  name: string;
  cost_price: string;        // Decimal as string
  selling_price: string;     // Decimal as string
  category: 'conditioner' | 'installation' | 'dismantling' | 'maintenance' | 'additional';
  category_display: string;
  profit_margin: number;     // Процент прибыли
  created_at: string;
}
```

### Заказы (`/api/orders/`)

**GET** `/api/orders/` - Список заказов
```javascript
const params = new URLSearchParams({
  status: 'new',            // new, in_progress, completed
  manager: 1,               // ID менеджера
  search: 'Иванов',         // поиск по клиенту
});
```

**Модель заказа:**
```typescript
interface Order {
  id: number;
  client: number;
  client_name: string;
  client_phone: string;
  client_address: string;
  manager: number;
  manager_name: string;
  status: 'new' | 'in_progress' | 'completed';
  status_display: string;
  installers: number[];
  installers_names: Array<{id: number, name: string}>;
  total_cost: string;
  items: OrderItem[];
  items_count: number;
  total_profit: number;
  created_at: string;
  completed_at: string | null;
}

interface OrderItem {
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
```

**POST** `/api/orders/` - Создание заказа
```javascript
const orderData = {
  client: 1,
  manager: 2,
  installers: [3, 4],
  status: 'new',
  items: [
    {
      service: 1,
      price: '45000.00',
      seller: 2
    }
  ]
};
```

### Финансы (`/api/transactions/`, `/api/finance/`)

**GET** `/api/finance/balance/` - Баланс компании (только owner)
```javascript
const balanceData = await fetch('/api/finance/balance/').then(r => r.json());
// Возвращает: { balance: 150000.50, monthly_stats: [...] }
```

**GET** `/api/transactions/` - Финансовые транзакции
```javascript
const params = new URLSearchParams({
  type: 'income',           // income, expense
  search: 'зарплата',       // поиск по описанию
});
```

**Модель транзакции:**
```typescript
interface Transaction {
  id: number;
  type: 'income' | 'expense';
  type_display: string;
  amount: string;
  description: string;
  order: number | null;
  order_display: string;
  created_at: string;
}
```

### Аналитика и статистика

**GET** `/api/dashboard/stats/` - Статистика дашборда
```javascript
// Возвращает разные данные в зависимости от роли пользователя
const stats = await fetch('/api/dashboard/stats/').then(r => r.json());

// Для owner:
interface OwnerStats {
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

// Для manager:
interface ManagerStats {
  total_orders: number;
  completed_orders: number;
  orders_this_month: number;
  total_revenue: number;
  role: 'manager';
}

// Для installer:
interface InstallerStats {
  total_orders: number;
  completed_orders: number;
  in_progress_orders: number;
  orders_this_month: number;
  role: 'installer';
}
```

### Календарь и планирование (`/api/calendar/`)

**GET** `/api/calendar/` - Календарь монтажей
```javascript
const params = new URLSearchParams({
  start_date: '2024-01-01',
  end_date: '2024-01-31',
  installer_id: 3           // Опционально для конкретного монтажника
});

const calendar = await fetch(`/api/calendar/?${params}`).then(r => r.json());
```

**Модель расписания:**
```typescript
interface InstallationSchedule {
  id: number;
  order_id: number;
  client_name: string;
  client_address: string;
  client_phone: string;
  manager: string;
  start_time: string;       // HH:MM
  end_time: string;         // HH:MM
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  status_display: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  priority_display: string;
  installers: Array<{id: number, name: string}>;
  notes: string;
  is_overdue: boolean;
  estimated_duration: string; // Duration format
}

interface CalendarResponse {
  calendar: {
    [date: string]: InstallationSchedule[];
  };
  total_schedules: number;
}
```

**POST** `/api/calendar/` - Создание расписания
```javascript
const scheduleData = {
  order_id: 1,
  scheduled_date: '2024-01-15',
  start_time: '10:00',
  end_time: '14:00',
  installer_ids: [3, 4],
  priority: 'normal',
  notes: 'Особые требования клиента'
};
```

---

## Модальные API

Для быстрого редактирования доступны специальные API endpoints:

### Клиенты
```javascript
// Получение данных для создания
GET /api/modal/client/
// Возвращает: { sources: [{value: 'avito', label: 'Авито'}] }

// Получение данных для редактирования
GET /api/modal/client/123/
// Возвращает данные клиента

// Создание
POST /api/modal/client/
// Отправка данных клиента

// Обновление
PUT /api/modal/client/123/
// Отправка обновленных данных
```

### Заказы
```javascript
// Получение данных для формы заказа
GET /api/modal/order/
// Возвращает: { clients: [...], managers: [...], installers: [...], statuses: [...] }

// Добавление позиции в заказ
POST /api/modal/order/123/items/
{
  service: 1,
  price: '25000.00',
  seller: 2
}

// Удаление позиции
DELETE /api/modal/order/123/items/456/
```

---

## Экспорт данных

**GET** `/api/export/clients/` - Экспорт клиентов в Excel
**GET** `/api/export/orders/` - Экспорт заказов в Excel  
**GET** `/api/export/finance/` - Экспорт финансов в Excel

```javascript
const downloadExcel = async (type) => {
  const response = await fetch(`/api/export/${type}/`, {
    credentials: 'include'
  });
  
  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${type}_${new Date().toISOString().split('T')[0]}.xlsx`;
  a.click();
  window.URL.revokeObjectURL(url);
};
```

---

## Примеры использования

### React Hook для API
```typescript
import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    count: number;
    next: string | null;
    previous: string | null;
  };
}

const useApi = <T>(url: string, options?: RequestInit) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          credentials: 'include',
          ...options
        });
        
        const result: ApiResponse<T> = await response.json();
        
        if (result.success) {
          setData(result.data!);
        } else {
          setError(result.error || 'Unknown error');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Network error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

// Использование
const OrdersList = () => {
  const { data: orders, loading, error } = useApi<Order[]>('/api/orders/');
  
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  
  return (
    <div>
      {orders?.map(order => (
        <div key={order.id}>{order.client_name}</div>
      ))}
    </div>
  );
};
```

### Создание заказа с позициями
```typescript
const createOrder = async (orderData: any) => {
  try {
    // 1. Создаем заказ
    const orderResponse = await fetch('/api/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCsrfToken(),
      },
      credentials: 'include',
      body: JSON.stringify({
        client: orderData.clientId,
        manager: orderData.managerId,
        installers: orderData.installerIds,
        status: 'new'
      })
    });
    
    const order = await orderResponse.json();
    
    // 2. Добавляем позиции через модальный API
    for (const item of orderData.items) {
      await fetch(`/api/modal/order/${order.data.id}/items/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCsrfToken(),
        },
        credentials: 'include',
        body: JSON.stringify(item)
      });
    }
    
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
```

### Работа с календарем
```typescript
const CalendarComponent = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [schedules, setSchedules] = useState<{[key: string]: InstallationSchedule[]}>({});
  
  useEffect(() => {
    loadSchedules();
  }, [selectedDate]);
  
  const loadSchedules = async () => {
    const startDate = format(startOfMonth(selectedDate), 'yyyy-MM-dd');
    const endDate = format(endOfMonth(selectedDate), 'yyyy-MM-dd');
    
    const response = await fetch(
      `/api/calendar/?start_date=${startDate}&end_date=${endDate}`,
      { credentials: 'include' }
    );
    
    const data = await response.json();
    setSchedules(data.calendar);
  };
  
  const startWork = async (scheduleId: number) => {
    await fetch(`/api/calendar/schedule/${scheduleId}/start/`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-CSRFToken': getCsrfToken() }
    });
    
    loadSchedules(); // Перезагружаем данные
  };
  
  return (
    <div>
      {Object.entries(schedules).map(([date, daySchedules]) => (
        <div key={date}>
          <h3>{date}</h3>
          {daySchedules.map(schedule => (
            <div key={schedule.id}>
              <span>{schedule.client_name}</span>
              <span>{schedule.start_time} - {schedule.end_time}</span>
              {schedule.status === 'scheduled' && (
                <button onClick={() => startWork(schedule.id)}>
                  Начать работу
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
```

---

## Обработка ошибок

### Стандартные HTTP коды
- `200` - Успех
- `201` - Создано
- `400` - Неверный запрос (ошибки валидации)
- `401` - Не авторизован
- `403` - Доступ запрещен (недостаточно прав)
- `404` - Не найдено
- `500` - Внутренняя ошибка сервера

### Обработчик ошибок
```typescript
const handleApiError = (error: any) => {
  if (error.status === 401) {
    // Перенаправляем на страницу входа
    window.location.href = '/user_accounts/login/';
  } else if (error.status === 403) {
    alert('У вас недостаточно прав для выполнения этого действия');
  } else if (error.status === 400 && error.errors) {
    // Показываем ошибки валидации
    Object.entries(error.errors).forEach(([field, messages]) => {
      console.error(`${field}: ${messages.join(', ')}`);
    });
  } else {
    alert('Произошла ошибка. Попробуйте позже.');
  }
};
```

---

## Рекомендации по разработке

### 1. Структура проекта
```
src/
  components/
    common/          # Общие компоненты
    clients/         # Компоненты для работы с клиентами
    orders/          # Компоненты заказов
    calendar/        # Календарь
  hooks/
    useApi.ts        # Хук для API запросов
    useAuth.ts       # Хук авторизации
  services/
    api.ts           # API клиент
    auth.ts          # Сервис авторизации
  types/
    index.ts         # TypeScript типы
  utils/
    formatters.ts    # Утилиты форматирования
```

### 2. Кэширование
Рекомендуется использовать React Query или SWR для кэширования API запросов:

```typescript
import { useQuery } from 'react-query';

const useOrders = (filters: any) => {
  return useQuery(
    ['orders', filters],
    () => fetchOrders(filters),
    {
      staleTime: 5 * 60 * 1000, // 5 минут
      refetchOnWindowFocus: false
    }
  );
};
```

### 3. Обновление в реальном времени
Для критически важных данных рекомендуется polling:

```typescript
const useRealTimeOrders = () => {
  return useQuery(
    'orders',
    fetchOrders,
    {
      refetchInterval: 30000, // Обновление каждые 30 секунд
      refetchIntervalInBackground: true
    }
  );
};
```

### 4. Оптимистичные обновления
```typescript
const useUpdateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation(updateOrder, {
    onMutate: async (newOrder) => {
      // Отменяем существующие запросы
      await queryClient.cancelQueries(['orders']);
      
      // Сохраняем предыдущее состояние
      const previousOrders = queryClient.getQueryData(['orders']);
      
      // Оптимистично обновляем данные
      queryClient.setQueryData(['orders'], (old: any) => {
        return old.map((order: any) => 
          order.id === newOrder.id ? newOrder : order
        );
      });
      
      return { previousOrders };
    },
    onError: (err, newOrder, context) => {
      // Откатываем изменения при ошибке
      queryClient.setQueryData(['orders'], context?.previousOrders);
    },
    onSettled: () => {
      // Перезапрашиваем данные в любом случае
      queryClient.invalidateQueries(['orders']);
    }
  });
};
```

---

## Заключение

Данная документация покрывает основные аспекты работы с API CRM системы. Для получения актуальной информации рекомендуется также использовать:

1. **Django Admin** (`/admin/`) - для просмотра структуры данных
2. **DRF Browsable API** (`/api/`) - для интерактивного тестирования API
3. **OpenAPI Schema** (`/api/schema/`) - для автогенерации типов

При возникновении вопросов обращайтесь к backend команде для уточнения деталей реализации.