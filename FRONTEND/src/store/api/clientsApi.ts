import { api } from './index';
import { Client, ClientForm, ClientsFilter, PaginatedResponse } from '../../types';

export const clientsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query({
      query: (filters) => ({
        url: '/clients/',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Client' as const, id })),
              { type: 'Client', id: 'LIST' },
            ]
          : [{ type: 'Client', id: 'LIST' }],
    }),
    getClient: builder.query({
      query: (id) => `/clients/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Client', id }],
    }),
    createClient: builder.mutation({
      query: (client) => ({
        url: '/clients/',
        method: 'POST',
        body: client,
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
    updateClient: builder.mutation({
      query: ({ id, data }) => ({
        url: `/clients/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Client', id }],
    }),
    deleteClient: builder.mutation({
      query: (id) => ({
        url: `/clients/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Client', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
