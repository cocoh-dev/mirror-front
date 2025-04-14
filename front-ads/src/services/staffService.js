import api from '@/lib/api';

const staffService = {
  async getStaffBySalon(salonId) {
    try {
      const response = await api.get(`/api/staff/${salonId}`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching staff:', error);
      return [];
    }
  },

  async createStaff(salonId, staffData) {
    try {
      const response = await api.post(`/api/staff/${salonId}`, staffData);
      return response.data;
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  },

  async updateStaff(salonId, staffId, staffData) {
    try {
      const response = await api.put(`/api/staff/${salonId}/${staffId}`, staffData);
      return response.data;
    } catch (error) {
      console.error('Error updating staff:', error);
      throw error;
    }
  },

  async deleteStaff(salonId, staffId) {
    try {
      await api.delete(`/api/staff/${salonId}/${staffId}`);
    } catch (error) {
      console.error('Error deleting staff:', error);
      throw error;
    }
  }
};

export default staffService;