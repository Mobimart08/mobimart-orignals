/* ==========================================================================
   src/utils/ApiResponse.js
   Standardized success response builder.

   Every successful API response has the same predictable shape:
   {
     success: true,
     statusCode: 200,
     message: "...",
     data: {...},
     pagination: {...} // only when returning paginated lists
   }

   Controllers call ApiResponse.success() or ApiResponse.paginated()
   instead of building JSON shapes manually.
   ========================================================================== */

class ApiResponse {
  /**
   * Standard success response — single resource or simple data.
   *
   * @param {Object} res         - Express response object
   * @param {number} statusCode  - HTTP status code (200, 201, etc.)
   * @param {string} message     - Human-readable success message
   * @param {*}      data        - Response payload (object, array, null)
   */
  static success(res, statusCode, message, data = null) {
    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data,
    });
  }

  /**
   * Paginated list response — includes pagination metadata.
   *
   * @param {Object} res          - Express response object
   * @param {string} message      - Human-readable success message
   * @param {Array}  data         - Array of documents
   * @param {Object} pagination   - Pagination metadata object
   */
  static paginated(res, message, data, pagination) {
    return res.status(200).json({
      success: true,
      statusCode: 200,
      message,
      data,
      pagination,
    });
  }
}

export default ApiResponse;
