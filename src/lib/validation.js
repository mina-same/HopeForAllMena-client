// Validation utility functions for client-side error handling

/**
 * Format validation error messages for display
 * @param {Object} error - Error object from API response
 * @returns {string} Formatted error message
 */
export const formatValidationError = (error) => {
  if (!error) return 'An unknown error occurred';
  
  // If it's a simple string error
  if (typeof error === 'string') {
    return error;
  }
  
  // If it's an object with a message
  if (error.message) {
    return error.message;
  }
  
  // If it's an array of errors (from validation)
  if (Array.isArray(error)) {
    return error.map(err => err.message).join(', ');
  }
  
  // If it's an object with errors array
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors.map(err => err.message).join(', ');
  }
  
  return 'An error occurred. Please try again.';
};

/**
 * Get field-specific error message
 * @param {string} fieldName - Name of the field
 * @param {Array} errors - Array of validation errors
 * @returns {string|null} Error message for the field or null
 */
export const getFieldError = (fieldName, errors) => {
  if (!errors || !Array.isArray(errors)) return null;
  
  const fieldError = errors.find(error => error.field === fieldName);
  return fieldError ? fieldError.message : null;
};

/**
 * Get suggestion for a field error
 * @param {string} fieldName - Name of the field
 * @param {Array} errors - Array of validation errors
 * @returns {string|null} Suggestion for the field or null
 */
export const getFieldSuggestion = (fieldName, errors) => {
  if (!errors || !Array.isArray(errors)) return null;
  
  const fieldError = errors.find(error => error.field === fieldName);
  return fieldError ? fieldError.suggestion : null;
};

/**
 * Check if a field has an error
 * @param {string} fieldName - Name of the field
 * @param {Array} errors - Array of validation errors
 * @returns {boolean} True if field has error
 */
export const hasFieldError = (fieldName, errors) => {
  if (!errors || !Array.isArray(errors)) return false;
  return errors.some(error => error.field === fieldName);
};

/**
 * Get common validation messages for specific fields
 */
export const VALIDATION_MESSAGES = {
  name: {
    required: 'Name is required. Please enter your full name.',
    minLength: 'Name must be at least 2 characters long.',
    maxLength: 'Name cannot exceed 100 characters. Please use a shorter name.',
    pattern: 'Name can only contain letters, spaces, hyphens, and apostrophes. Special characters and numbers are not allowed.'
  },
  email: {
    required: 'Email address is required. Please enter a valid email address.',
    invalid: 'Please enter a valid email address (e.g., user@example.com).',
    maxLength: 'Email address is too long. Please use a shorter email address.',
    taken: 'This email address is already taken. Please use a different email address.'
  },
  username: {
    required: 'Username is required. Please choose a unique username.',
    minLength: 'Username must be at least 3 characters long.',
    maxLength: 'Username cannot exceed 30 characters. Please use a shorter username.',
    pattern: 'Username can only contain letters, numbers, dots, underscores, and hyphens. No spaces or special characters allowed.',
    taken: 'This username is already taken. Try adding numbers or changing the username.'
  },
  password: {
    required: 'Password is required. Please enter a secure password.',
    minLength: 'Password must be at least 6 characters long.',
    pattern: 'Password must contain at least one lowercase letter, one uppercase letter, and one number.',
    mismatch: 'Password confirmation does not match. Please make sure both passwords are identical.'
  },
  confirmPassword: {
    required: 'Please confirm your new password by entering it again.',
    mismatch: 'Password confirmation does not match your new password. Please make sure both passwords are identical.'
  },
  role: {
    required: 'Role is required. Please select a role for this user.',
    maxLength: 'Role cannot exceed 50 characters. Please use a shorter role name.'
  },
  permissions: {
    invalid: 'Invalid permissions selected. Please check your selections.',
    required: 'Permissions must be provided as a list.'
  },
  status: {
    invalid: 'Status must be one of: active, inactive, or suspended.'
  }
};

/**
 * Get appropriate error message for a field
 * @param {string} fieldName - Name of the field
 * @param {string} errorType - Type of error (required, minLength, etc.)
 * @returns {string} Error message
 */
export const getValidationMessage = (fieldName, errorType) => {
  const fieldMessages = VALIDATION_MESSAGES[fieldName];
  if (!fieldMessages) return 'Invalid field value';
  
  return fieldMessages[errorType] || fieldMessages.required || 'Invalid field value';
};

/**
 * Format API error response for display
 * @param {Object} response - API response object
 * @returns {Object} Formatted error object
 */
export const formatApiError = (response) => {
  if (!response) {
    return {
      message: 'Network error. Please check your connection and try again.',
      type: 'network'
    };
  }
  
  // Handle different response formats
  if (response.status === 'error') {
    return {
      message: response.message || 'An error occurred',
      errors: response.errors || [],
      type: 'validation'
    };
  }
  
  if (response.error) {
    return {
      message: response.error,
      type: 'api'
    };
  }
  
  return {
    message: 'An unexpected error occurred. Please try again.',
    type: 'unknown'
  };
};
