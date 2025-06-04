# CRM для установки кондиционеров - API Документация

## Содержание
1. [Общая информация](#общая-информация)
2. [Авторизация](#авторизация)
3. [Пользователи](#пользователи)
4. [Клиенты](#клиенты)
5. [Услуги](#услуги)
6. [Заказы](#заказы)
7. [Финансы](#финансы)
8. [Зарплаты](#зарплаты)
9. [Календарь монтажей](#календарь-монтажей)
10. [Аналитика](#аналитика)
11. [Экспорт данных](#экспорт-данных)
12. [Модальные окна](#модальные-окна)
13. [Коды ошибок](#коды-ошибок)

---

## Общая информация

### Базовый URL
```
http://your-domain.com/api/
```

### Формат данных
Все запросы и ответы используют формат JSON.

### Заголовки
```http
Content-Type: application/json
X-CSRFToken: [csrf_token] // Для POST/PUT/DELETE запросов
```

### Пагинация
Все списковые эндпоинты поддерживают пагинацию:
```json
{
  "count": 25,
  "next": "http://example.com/api/endpoint/?page=2",
  "previous": null,
  "results": [...]
}
```

---

## Авторизация

### Вход в систему
```http
POST /user_accounts/login/
```

**Тело запроса:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Успешный ответ (200):**
```json
{
  "success": true,
  "redirect": "/",
  "user": {
    "id": 1,
    "username": "manager1",
    "full_name": "Иван Петров",
    "role": "manager"
  }
}
```

**Ошибка авторизации (400):**
```json
{
  "success": false,
  "error": "Неверное имя пользователя или пароль"
}
```

### Выход из системы
```http
POST /user_accounts/logout/
```

### Проверка авторизации
Система использует сессионную авторизацию. При успешном входе устанавливается cookie сессии, который автоматически отправляется с каждым запросом.

---

## Пользователи

### Роли пользователей
- **owner** - Владелец (полный доступ)
- **manager** - Менеджер (управление клиентами и заказами)
- **installer** - Монтажник (просмотр назначенных заказов)

### Получить список пользователей
```http
GET /api/users/
```

**Параметры запроса:**
- `role` - фильтр по роли (`owner`, `manager`, `installer`)
- `search` - поиск по имени, username, email
- `page` - номер страницы

**Ответ (200):**
```json
{
  "count": 15,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "admin",
      "first_name": "Александр",
      "last_name": "Иванов",
      "email": "admin@company.com",
      "role": "owner",
      "phone": "+7 (999) 123-45-67",
      "role_display": "Владелец",
      "full_name": "Александр Иванов"
    }
  ]
}
```

### Получить информацию о пользователе
```http
GET /api/users/{id}/
```

**Ответ (200):**
```json
{
  "id": 1,
  "username": "manager1",
  "first_name": "Иван",
  "last_name": "Петров",
  "email": "manager@company.com",
  "role": "manager",
  "phone": "+7 (999) 888-77-66",
  "role_display": "Менеджер",
  "full_name": "Иван Петров"
}
```

### Создать пользователя
```http
POST /api/users/
```

**Только для владельца**

**Тело запроса:**
```json
{
  "username": "new_user",
  "first_name": "Имя",
  "last_name": "Фамилия",
  "email": "user@company.com",
  "role": "manager",
  "phone": "+7 (999) 000-00-00",
  "password": "secure_password"
}
```

### Профиль текущего пользователя
```http
GET /user_accounts/profile/
```

Возвращает HTML страницу профиля с данными о зарплате.

---

## Клиенты

### Получить список клиентов
```http
GET /api/clients/
```

**Параметры запроса:**
- `source` - фильтр по источнику (`avito`, `vk`, `website`, `recommendations`, `other`)
- `search` - поиск по имени, телефону, адресу
- `page` - номер страницы

**Ответ (200):**
```json
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "name": "Мария Смирнова",
      "address": "г. Москва, ул. Ленина, д. 10, кв. 5",
      "phone": "+7 (999) 111-22-33",
      "source": "avito",
      "source_display": "Авито",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Получить информацию о клиенте
```http
GET /api/clients/{id}/
```

### Создать клиента
```http
POST /api/clients/
```

**Доступно для: владелец, менеджер**

**Тело запроса:**
```json
{
  "name": "Новый Клиент",
  "address": "Адрес клиента",
  "phone": "+7 (999) 000-00-00",
  "source": "website"
}
```

### Источники клиентов
- `avito` - Авито
- `vk` - ВК
- `website` - Сайт
- `recommendations` - Рекомендации
- `other` - Другое

---

## Услуги

### Получить список услуг
```http
GET /api/services/
```

**Параметры запроса:**
- `category` - фильтр по категории
- `search` - поиск по названию

**Ответ (200):**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Установка кондиционера 12000 BTU",
      "cost_price": "15000.00",
      "selling_price": "25000.00",
      "category": "installation",
      "category_display": "Монтаж",
      "profit_margin": 40.0,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Категории услуг
- `conditioner` - Кондиционер
- `installation` - Монтаж
- `dismantling` - Демонтаж
- `maintenance` - Обслуживание
- `additional` - Доп услуга

### Создать услугу
```http
POST /api/services/
```

**Только для владельца**

**Тело запроса:**
```json
{
  "name": "Название услуги",
  "cost_price": "10000.00",
  "selling_price": "15000.00",
  "category": "installation"
}
```

---

## Заказы

### Получить список заказов
```http
GET /api/orders/
```

**Параметры запроса:**
- `status` - фильтр по статусу (`new`, `in_progress`, `completed`)
- `manager` - ID менеджера
- `search` - поиск по клиенту

**Ответ (200):**
```json
{
  "results": [
    {
      "id": 1,
      "client": 1,
      "client_name": "Мария Смирнова",
      "client_phone": "+7 (999) 111-22-33",
      "client_address": "г. Москва, ул. Ленина, д. 10",
      "manager": 2,
      "manager_name": "Иван Петров",
      "status": "new",
      "status_display": "Новый",
      "installers": [3, 4],
      "installers_names": [
        {"id": 3, "name": "Сергей Козлов"},
        {"id": 4, "name": "Андрей Сидоров"}
      ],
      "total_cost": "35000.00",
      "items_count": 2,
      "total_profit": 15000.0,
      "created_at": "2024-01-15T10:30:00Z",
      "completed_at": null,
      "items": [
        {
          "id": 1,
          "service": 1,
          "service_name": "Установка кондиционера",
          "service_category": "installation",
          "service_category_display": "Монтаж",
          "service_cost_price": "15000.00",
          "price": "25000.00",
          "seller": 2,
          "seller_name": "Иван Петров",
          "profit": 10000.0,
          "created_at": "2024-01-15T10:35:00Z"
        }
      ]
    }
  ]
}
```

### Статусы заказов
- `new` - Новый
- `in_progress` - В работе
- `completed` - Завершен

### Создать заказ
```http
POST /api/orders/
```

**Доступно для: владелец, менеджер**

**Тело запроса:**
```json
{
  "client": 1,
  "manager": 2,
  "status": "new",
  "installers": [3, 4]
}
```

### Добавить позицию в заказ
```http
POST /api/modal/order/{order_id}/items/
```

**Тело запроса:**
```json
{
  "service": 1,
  "price": "25000.00",
  "seller": 2
}
```

### Изменить статус заказа
```http
PATCH /api/orders/{id}/
```

**Тело запроса:**
```json
{
  "status": "completed"
}
```

**Права доступа к изменению статуса:**
- **Владелец/Менеджер** - любой статус
- **Монтажник** - только на "completed"

---

## Финансы

### Получить баланс компании
```http
GET /api/finance/balance/
```

**Только для владельца**

**Ответ (200):**
```json
{
  "balance": 250000.50,
  "monthly_stats": [
    {
      "month": "2024-01",
      "income": 500000.0,
      "expense": 300000.0,
      "profit": 200000.0
    }
  ]
}
```

### Получить финансовую статистику
```http
GET /api/finance/stats/
```

**Только для владельца**

**Ответ (200):**
```json
{
  "income_this_month": 150000.0,
  "expense_this_month": 80000.0,
  "profit_this_month": 70000.0,
  "daily_stats": [
    {
      "date": "2024-01-15",
      "income": 25000.0,
      "expense": 5000.0,
      "profit": 20000.0
    }
  ]
}
```

### Транзакции
```http
GET /api/transactions/
```

**Только для владельца**

**Ответ (200):**
```json
{
  "results": [
    {
      "id": 1,
      "type": "income",
      "type_display": "Доход",
      "amount": "25000.00",
      "description": "Доход от завершения заказа #1",
      "order": 1,
      "order_display": "Заказ #1 - Мария Смирнова",
      "created_at": "2024-01-15T15:00:00Z"
    }
  ]
}
```

### Создать транзакцию
```http
POST /api/transactions/
```

**Только для владельца**

**Тело запроса:**
```json
{
  "type": "expense",
  "amount": "5000.00",
  "description": "Покупка материалов",
  "order": null
}
```

---

## Зарплаты

### Конфигурации зарплат
```http
GET /api/salary-configs/
```

**Только для владельца**

**Ответ (200):**
```json
{
  "results": [
    {
      "id": 1,
      "name": "Стандартная конфигурация",
      "description": "Конфигурация зарплат по умолчанию",
      "is_active": true,
      "assignments_count": 5,
      "manager_config": {
        "fixed_salary": "30000.00",
        "bonus_per_completed_order": "250.00",
        "conditioner_profit_percentage": "20.00",
        "additional_services_profit_percentage": "30.00"
      },
      "installer_config": {
        "payment_per_installation": "1500.00",
        "additional_services_profit_percentage": "30.00"
      },
      "owner_config": {
        "payment_per_installation": "1500.00",
        "remaining_profit_percentage": "100.00"
      }
    }
  ]
}
```

### Расчет зарплаты
```http
POST /api/salary/calculate/
```

**Только для владельца**

**Тело запроса:**
```json
{
  "user_id": 2,
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

**Ответ для менеджера (200):**
```json
{
  "success": true,
  "data": {
    "config_name": "Стандартная конфигурация",
    "fixed_salary": 30000.0,
    "orders_bonus": 2500.0,
    "completed_orders_count": 10,
    "sales_bonus": 15000.0,
    "sales_details": {
      "conditioner": {
        "count": 5,
        "bonus": 10000.0,
        "percentage": 20.0
      },
      "additional": {
        "count": 8,
        "bonus": 5000.0,
        "percentage": 30.0
      }
    },
    "adjustments": 1000.0,
    "adjustments_details": [
      {
        "type": "Премия",
        "amount": 1000.0,
        "reason": "За хорошую работу"
      }
    ],
    "total_salary": 48500.0,
    "period": "2024-01-01 - 2024-01-31"
  }
}
```

**Ответ для монтажника (200):**
```json
{
  "success": true,
  "data": {
    "config_name": "Стандартная конфигурация",
    "installation_pay": 15000.0,
    "installation_count": 10,
    "additional_pay": 3000.0,
    "additional_services_count": 3,
    "adjustments": 0.0,
    "adjustments_details": [],
    "total_salary": 18000.0,
    "period": "2024-01-01 - 2024-01-31"
  }
}
```

### Корректировки зарплаты
```http
GET /api/salary-adjustments/
```

**Только для владельца**

```http
POST /api/salary-adjustments/
```

**Тело запроса:**
```json
{
  "user": 2,
  "adjustment_type": "bonus",
  "amount": "5000.00",
  "reason": "Премия за месяц",
  "period_start": "2024-01-01",
  "period_end": "2024-01-31"
}
```

**Типы корректировок:**
- `bonus` - Премия
- `penalty` - Штраф
- `correction` - Корректировка

---

## Календарь монтажей

### Получить календарь
```http
GET /api/calendar/
```

**Параметры запроса:**
- `start_date` - начальная дата (YYYY-MM-DD)
- `end_date` - конечная дата (YYYY-MM-DD)
- `installer_id` - ID монтажника

**Ответ (200):**
```json
{
  "calendar": {
    "2024-01-15": [
      {
        "id": 1,
        "order_id": 1,
        "client_name": "Мария Смирнова",
        "client_address": "г. Москва, ул. Ленина, д. 10",
        "client_phone": "+7 (999) 111-22-33",
        "manager": "Иван Петров",
        "start_time": "10:00",
        "end_time": "14:00",
        "status": "scheduled",
        "status_display": "Запланировано",
        "priority": "normal",
        "priority_display": "Обычный",
        "installers": [
          {"id": 3, "name": "Сергей Козлов"}
        ],
        "notes": "Особые требования",
        "is_overdue": false,
        "estimated_duration": "4:00:00"
      }
    ]
  },
  "total_schedules": 1
}
```

### Статусы расписания
- `scheduled` - Запланировано
- `in_progress` - Выполняется
- `completed` - Завершено
- `cancelled` - Отменено
- `rescheduled` - Перенесено

### Приоритеты
- `low` - Низкий
- `normal` - Обычный
- `high` - Высокий
- `urgent` - Срочно

### Создать расписание
```http
POST /api/calendar/
```

**Доступно для: владелец, менеджер**

**Тело запроса:**
```json
{
  "order_id": 1,
  "scheduled_date": "2024-01-20",
  "start_time": "10:00",
  "end_time": "14:00",
  "installer_ids": [3],
  "priority": "normal",
  "notes": "Особые требования",
  "estimated_duration": "4:00"
}
```

### Начать работу
```http
POST /api/calendar/{schedule_id}/start/
```

**Только для назначенных монтажников**

### Завершить работу
```http
POST /api/calendar/{schedule_id}/complete/
```

**Только для назначенных монтажников**

### Оптимизация маршрута
```http
POST /api/calendar/route-optimization/
```

**Доступно для: владелец, менеджер**

**Тело запроса:**
```json
{
  "installer_id": 3,
  "date": "2024-01-20"
}
```

**Ответ (201):**
```json
{
  "message": "Маршрут успешно оптимизирован",
  "route": {
    "route_id": 1,
    "installer": "Сергей Козлов",
    "date": "2024-01-20",
    "total_distance": 45.2,
    "total_travel_time": "02:30:00",
    "is_optimized": true,
    "start_location": "Склад компании",
    "points": [
      {
        "sequence": 1,
        "arrival_time": "09:00",
        "departure_time": "13:00",
        "client_name": "Мария Смирнова",
        "client_address": "г. Москва, ул. Ленина, д. 10",
        "order_id": 1,
        "travel_distance": 15.5,
        "travel_time": "00:45:00"
      }
    ]
  }
}
```

---

## Аналитика

### Статистика дашборда
```http
GET /api/dashboard/stats/
```

**Ответ зависит от роли пользователя:**

**Для владельца (200):**
```json
{
  "total_orders": 150,
  "completed_orders": 120,
  "orders_this_month": 25,
  "total_clients": 80,
  "clients_this_month": 12,
  "company_balance": 250000.50,
  "income_this_month": 150000.0,
  "expense_this_month": 80000.0,
  "role": "owner"
}
```

**Для менеджера (200):**
```json
{
  "total_orders": 45,
  "completed_orders": 38,
  "orders_this_month": 8,
  "total_revenue": 950000.0,
  "role": "manager"
}
```

**Для монтажника (200):**
```json
{
  "total_orders": 65,
  "completed_orders": 58,
  "in_progress_orders": 3,
  "orders_this_month": 12,
  "role": "installer"
}
```

---

## Экспорт данных

### Экспорт клиентов
```http
GET /api/export/clients/
```

**Только для владельца**

Возвращает Excel файл с данными клиентов.

### Экспорт заказов
```http
GET /api/export/orders/
```

**Только для владельца**

Возвращает Excel файл с данными заказов и позиций.

### Экспорт финансов
```http
GET /api/export/finance/
```

**Только для владельца**

Возвращает Excel файл с финансовыми транзакциями.

---

## Модальные окна

Для работы с модальными окнами есть специальные эндпоинты, которые возвращают данные, оптимизированные для форм.

### Модальное окно клиента

**Получить данные для создания:**
```http
GET /api/modal/client/
```

**Ответ (200):**
```json
{
  "sources": [
    {"value": "avito", "label": "Авито"},
    {"value": "vk", "label": "ВК"}
  ]
}
```

**Получить данные для редактирования:**
```http
GET /api/modal/client/{client_id}/
```

**Создать клиента:**
```http
POST /api/modal/client/
```

**Обновить клиента:**
```http
PUT /api/modal/client/{client_id}/
```

### Модальное окно заказа

**Получить данные для создания/редактирования:**
```http
GET /api/modal/order/
GET /api/modal/order/{order_id}/
```

**Ответ (200):**
```json
{
  "clients": [
    {"id": 1, "name": "Мария Смирнова", "phone": "+7 (999) 111-22-33"}
  ],
  "managers": [
    {"id": 2, "first_name": "Иван", "last_name": "Петров"}
  ],
  "installers": [
    {"id": 3, "first_name": "Сергей", "last_name": "Козлов"}
  ],
  "statuses": [
    {"value": "new", "label": "Новый"}
  ],
  "order": {...}, // Если редактирование
  "items": [...] // Если редактирование
}
```

### Модальное окно позиций заказа

**Получить данные для добавления позиции:**
```http
GET /api/modal/order/{order_id}/items/
```

**Добавить позицию:**
```http
POST /api/modal/order/{order_id}/items/
```

**Удалить позицию:**
```http
DELETE /api/modal/order/{order_id}/items/{item_id}/
```

### Модальное окно выплаты зарплаты

**Получить расчет зарплаты:**
```http
GET /api/modal/salary-payment/{user_id}/
```

**Создать выплату:**
```http
POST /api/modal/salary-payment/{user_id}/
```

---

## Коды ошибок

### HTTP статус коды
- **200** - Успешный запрос
- **201** - Успешное создание
- **204** - Успешное удаление (нет содержимого)
- **400** - Ошибка валидации данных
- **401** - Не авторизован
- **403** - Нет прав доступа
- **404** - Ресурс не найден
- **500** - Внутренняя ошибка сервера

### Формат ошибок
```json
{
  "error": "Описание ошибки",
  "details": {
    "field_name": ["Список ошибок поля"]
  }
}
```

### Типичные ошибки

**403 Forbidden:**
```json
{
  "error": "У вас нет прав для выполнения этого действия"
}
```

**400 Bad Request:**
```json
{
  "error": "Ошибка валидации",
  "details": {
    "name": ["Обязательное поле."],
    "phone": ["Введите корректный номер телефона."]
  }
}
```

**401 Unauthorized:**
```json
{
  "error": "Требуется авторизация"
}
```

---

## Примеры использования

### Создание заказа с позициями

1. **Создать заказ:**
```javascript
const order = await fetch('/api/orders/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken
  },
  body: JSON.stringify({
    client: 1,
    manager: 2,
    installers: [3]
  })
});
```

2. **Добавить позицию:**
```javascript
const item = await fetch(`/api/modal/order/${order.id}/items/`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken
  },
  body: JSON.stringify({
    service: 1,
    price: "25000.00",
    seller: 2
  })
});
```

### Работа с календарем

1. **Получить календарь на неделю:**
```javascript
const calendar = await fetch('/api/calendar/?start_date=2024-01-15&end_date=2024-01-21');
```

2. **Создать расписание:**
```javascript
const schedule = await fetch('/api/calendar/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken
  },
  body: JSON.stringify({
    order_id: 1,
    scheduled_date: "2024-01-20",
    start_time: "10:00",
    end_time: "14:00",
    installer_ids: [3],
    priority: "normal"
  })
});
```

### Расчет зарплаты

```javascript
const salary = await fetch('/api/salary/calculate/', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRFToken': csrfToken
  },
  body: JSON.stringify({
    user_id: 2,
    start_date: "2024-01-01",
    end_date: "2024-01-31"
  })
});
```

---

## Заключение

Данная документация покрывает все основные API эндпоинты системы. Для каждого эндпоинта указаны:
- Метод HTTP и URL
- Права доступа
- Параметры запроса
- Формат тела запроса
- Формат ответа
- Возможные ошибки

Система поддерживает полный CRUD для всех сущностей с учетом ролевой модели доступа. Все данные возвращаются в JSON формате, что делает интеграцию с любым фронтенд фреймворком простой и понятной.
