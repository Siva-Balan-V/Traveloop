class Validator {
  static isEmail(email) {
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test(email);
  }

  static isStrongPassword(password) {
    if (password.length < 8) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return false;
    return true;
  }

  static isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }

  static isValidDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  }

  static isPositiveNumber(value) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= 0;
  }

  static isValidCurrency(currency) {
    const validCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR', 'MXN'];
    return validCurrencies.includes(currency);
  }

  static sanitizeString(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
  }

  static isValidLength(str, min, max) {
    if (typeof str !== 'string') return false;
    const length = str.trim().length;
    return length >= min && length <= max;
  }

  static isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isValidRating(rating) {
    const num = parseFloat(rating);
    return !isNaN(num) && num >= 0 && num <= 5;
  }

  static validateRegistration(data) {
    const errors = {};

    if (!data.email || !this.isEmail(data.email)) {
      errors.email = 'Valid email is required';
    }

    if (!data.password || !this.isStrongPassword(data.password)) {
      errors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
    }

    if (!data.first_name || !this.isValidLength(data.first_name, 1, 100)) {
      errors.first_name = 'First name is required (1-100 characters)';
    }

    if (!data.last_name || !this.isValidLength(data.last_name, 1, 100)) {
      errors.last_name = 'Last name is required (1-100 characters)';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateLogin(data) {
    const errors = {};

    if (!data.email || !this.isEmail(data.email)) {
      errors.email = 'Valid email is required';
    }

    if (!data.password) {
      errors.password = 'Password is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateTrip(data) {
    const errors = {};

    if (!data.trip_name || !this.isValidLength(data.trip_name, 1, 200)) {
      errors.trip_name = 'Trip name is required (1-200 characters)';
    }

    if (!data.start_date || !this.isValidDate(data.start_date)) {
      errors.start_date = 'Valid start date is required';
    }

    if (!data.end_date || !this.isValidDate(data.end_date)) {
      errors.end_date = 'Valid end date is required';
    }

    if (data.start_date && data.end_date && !this.isValidDateRange(data.start_date, data.end_date)) {
      errors.date_range = 'End date must be after or equal to start date';
    }

    if (data.total_budget && !this.isPositiveNumber(data.total_budget)) {
      errors.total_budget = 'Budget must be a positive number';
    }

    if (data.currency && !this.isValidCurrency(data.currency)) {
      errors.currency = 'Invalid currency code';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateStop(data) {
    const errors = {};

    if (!data.city_id || !Number.isInteger(parseInt(data.city_id))) {
      errors.city_id = 'Valid city ID is required';
    }

    if (!data.arrival_date || !this.isValidDate(data.arrival_date)) {
      errors.arrival_date = 'Valid arrival date is required';
    }

    if (!data.departure_date || !this.isValidDate(data.departure_date)) {
      errors.departure_date = 'Valid departure date is required';
    }

    if (data.arrival_date && data.departure_date && !this.isValidDateRange(data.arrival_date, data.departure_date)) {
      errors.date_range = 'Departure date must be after or equal to arrival date';
    }

    if (data.accommodation_cost && !this.isPositiveNumber(data.accommodation_cost)) {
      errors.accommodation_cost = 'Accommodation cost must be a positive number';
    }

    if (data.transportation_cost && !this.isPositiveNumber(data.transportation_cost)) {
      errors.transportation_cost = 'Transportation cost must be a positive number';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateActivity(data) {
    const errors = {};

    if (!data.activity_id || !Number.isInteger(parseInt(data.activity_id))) {
      errors.activity_id = 'Valid activity ID is required';
    }

    if (data.scheduled_date && !this.isValidDate(data.scheduled_date)) {
      errors.scheduled_date = 'Valid scheduled date is required';
    }

    if (data.actual_cost && !this.isPositiveNumber(data.actual_cost)) {
      errors.actual_cost = 'Cost must be a positive number';
    }

    if (data.duration_minutes && !this.isPositiveNumber(data.duration_minutes)) {
      errors.duration_minutes = 'Duration must be a positive number';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validateNote(data) {
    const errors = {};

    if (!data.note_content || !this.isValidLength(data.note_content, 1, 5000)) {
      errors.note_content = 'Note content is required (1-5000 characters)';
    }

    if (data.note_title && !this.isValidLength(data.note_title, 0, 200)) {
      errors.note_title = 'Note title must be less than 200 characters';
    }

    if (data.note_date && !this.isValidDate(data.note_date)) {
      errors.note_date = 'Valid note date is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  static validatePackingItem(data) {
    const errors = {};

    if (!data.item_name || !this.isValidLength(data.item_name, 1, 200)) {
      errors.item_name = 'Item name is required (1-200 characters)';
    }

    if (data.quantity && !this.isPositiveNumber(data.quantity)) {
      errors.quantity = 'Quantity must be a positive number';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

module.exports = Validator;
