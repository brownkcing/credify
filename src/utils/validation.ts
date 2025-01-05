export const validation = {
  name: {
    required: (value: string) => !!value.trim() || 'Name is required',
    length: (value: string) => 
      value.trim().length >= 2 || 'Name must be at least 2 characters'
  },
  phoneNumber: {
    format: (value: string) => {
      if (!value) return true; // Optional field
      // Basic Japanese phone format: +81 XX-XXXX-XXXX
      const phoneRegex = /^\+81\s\d{2}-\d{4}-\d{4}$/;
      return phoneRegex.test(value) || 'Invalid phone format (e.g., +81 90-1234-5678)';
    }
  }
};