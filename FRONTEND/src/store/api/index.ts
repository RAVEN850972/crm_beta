import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';

const getCsrfToken = (): string => {
  const token = document.querySelector('[name=csrfmiddlewaretoken]') as HTMLInputElement;
  return token?.value || document.cookie.match(/csrftoken=([^;]*)/)?.[1] || '';
};

const baseQuery = fetchBaseQuery({
  baseUrl: '/api/',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getCsrfToken();
    if (token) {
      headers.set('X-CSRFToken', token);
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['User', 'Client', 'Service', 'Order', 'Transaction', 'Schedule'],
  endpoints: () => ({}),
});
