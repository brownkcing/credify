export const financeValidation = {
    bankAccount: {
      number: (value: string) => {
        if (!value) return 'Account number is required';
        if (!/^\d+$/.test(value)) return 'Account number must contain only digits';
        if (value.length < 10 || value.length > 14) return 'Account number must be between 10-14 digits';
        return true;
      }
    },
    creditCard: {
      number: (value: string) => {
        const digitsOnly = value.replace(/\s/g, '');
        if (!digitsOnly) return 'Card number is required';
        if (!/^\d{16}$/.test(digitsOnly)) return 'Card number must be 16 digits';
        // Basic Luhn algorithm check could be added here
        return true;
      },
      expiry: (value: string) => {
        if (!value) return 'Expiry date is required';
        if (!/^\d{2}\/\d{2}$/.test(value)) return 'Invalid format (MM/YY)';
        
        const [month, year] = value.split('/').map(Number);
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
  
        if (month < 1 || month > 12) return 'Invalid month';
        if (year < currentYear) return 'Card has expired';
        if (year === currentYear && month < currentMonth) return 'Card has expired';
        
        return true;
      },
      cvv: (value: string) => {
        if (!value) return 'CVV is required';
        if (!/^\d{3,4}$/.test(value)) return 'CVV must be 3 or 4 digits';
        return true;
      }
    }
  };

  export const formatters = {
    creditCard: {
      number: (value: string) => {
        const digitsOnly = value.replace(/\s/g, '');
        const groups = digitsOnly.match(/.{1,4}/g) || [];
        return groups.join(' ');
      },
      expiry: (value: string) => {
        const digitsOnly = value.replace(/\D/g, '');
        if (digitsOnly.length >= 2) {
          return `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}`;
        }
        return digitsOnly;
      }
    }
  };