/**
 * Centralized API Error Parser
 * Converts raw backend, Axios, and Network errors into human-friendly strings.
 */

export const parseApiError = (error) => {
  // If it's a string, return as is (could be manually thrown friendly error)
  if (typeof error === 'string') return error;

  // Handle Network/Axios Errors
  if (error.isAxiosError) {
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to connect to the server. Please check your internet connection.';
    }
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return 'The request timed out. Please try again later.';
    }
  }

  // Extract response data if available
  const response = error.response;
  if (!response) {
    return error.message || 'An unexpected error occurred. Please try again.';
  }

  const { status, data } = response;

  // Handle Mongoose / Backend specific error responses
  if (data?.message) {
    const msg = data.message;
    
    // 1. Validation Errors
    if (msg.toLowerCase().includes('validation failed') || data.error?.name === 'ValidationError') {
      // If there's a specific field error, try to extract it, else fallback
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        return data.errors[0].message; // Send the specific validation message from Express Validator
      }
      if (data.error?.errors) {
        const firstErrorKey = Object.keys(data.error.errors)[0];
        if (firstErrorKey && data.error.errors[firstErrorKey].message) {
          return data.error.errors[firstErrorKey].message; // Send the specific validation message from Mongoose
        }
      }
      return 'Please fill all required fields correctly.';
    }

    // 2. Duplicate Key / MongoServerError (11000)
    if (msg.includes('duplicate key') || msg.includes('E11000')) {
      return 'A record with this information already exists.';
    }

    // 3. Cast Errors
    if (msg.includes('CastError') || msg.includes('Cast to ObjectId failed')) {
      return 'One or more values provided are invalid.';
    }
    
    // 4. JWT / Auth Errors
    if (msg.includes('jwt expired') || msg.includes('token expired')) {
      return 'Your session has expired. Please log in again.';
    }

    // Custom clear backend messages we already sent (if any exist that are friendly)
    // For anything containing "slug validation failed"
    if (msg.toLowerCase().includes('slug')) {
      return 'The name contains invalid characters. Please use standard characters.';
    }

    // If it looks like a raw stack trace or generic backend message, we fall through to the status switch
    if (!msg.includes('Error:') && !msg.includes('Exception') && msg.length < 100) {
       return msg; // It might be a friendly message sent by the backend intentionally
    }
  }

  // Handle by HTTP Status Code Fallbacks
  switch (status) {
    case 400:
      return 'Invalid request. Please check your inputs and try again.';
    case 401:
      return 'Authentication failed. Please log in to continue.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 409:
      return 'A conflict occurred, possibly due to a duplicate entry.';
    case 413:
      return 'The uploaded file is too large. Please try a smaller file.';
    case 422:
      return 'Unable to process the request due to semantic errors.';
    case 429:
      return 'Too many requests. Please slow down and try again later.';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'Something went wrong on the server. Please try again.';
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};
