import api from './api';

export const eventService = {
  // Buscar todos os eventos
  getEvents: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status && filters.status !== 'all') {
        params.append('status', filters.status);
      }
      
      if (filters.startDate) {
        params.append('startDate', filters.startDate);
      }
      
      if (filters.endDate) {
        params.append('endDate', filters.endDate);
      }
      
      const response = await api.get(`/events?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Buscar evento específico
  getEvent: async (id) => {
    try {
      const response = await api.get(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Criar novo evento
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar evento
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Deletar evento
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Atualizar status do evento
  updateEventStatus: async (id, status) => {
    try {
      const response = await api.patch(`/events/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
