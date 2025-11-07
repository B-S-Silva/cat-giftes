import api from './api.js';

export const customDatesService = {
  // Listar todas as datas personalizadas
  async getCustomDates() {
    const response = await api.get('/custom-dates');
    return response.data;
  },

  // Criar nova data personalizada
  async createCustomDate(date, name, color = 'bg-pink-500') {
    const response = await api.post('/custom-dates', { date, name, color });
    return response.data;
  },

  // Atualizar data personalizada
  async updateCustomDate(id, name, color) {
    const response = await api.put(`/custom-dates/${id}`, { name, color });
    return response.data;
  },

  // Deletar data personalizada
  async deleteCustomDate(id) {
    const response = await api.delete(`/custom-dates/${id}`);
    return response.data;
  }
};