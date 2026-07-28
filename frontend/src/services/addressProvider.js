/* ==========================================================================
   src/services/addressProvider.js
   - Abstract interface for Address Autocomplete and Pincode Lookups
   - Implements OpenStreetMap (Nominatim) for autocomplete
   - Implements PostalPincode.in for Indian PIN lookup
   - Includes in-memory caching to reduce duplicate network requests
   ========================================================================== */

const cache = new Map();

/**
 * Helper to get/set cache
 */
const withCache = async (key, fetcher) => {
  if (cache.has(key)) return cache.get(key);
  try {
    const result = await fetcher();
    if (result) {
      cache.set(key, result);
      // Keep cache size reasonable
      if (cache.size > 100) {
        const firstKey = cache.keys().next().value;
        cache.delete(firstKey);
      }
    }
    return result;
  } catch (err) {
    console.error('AddressProvider Error:', err);
    return null;
  }
};

export const addressProvider = {
  /**
   * Fetch address suggestions using OpenStreetMap Nominatim
   * @param {string} query Search string
   * @returns {Promise<Array>} List of mapped suggestions
   */
  getSuggestions: async (query) => {
    if (!query || query.trim().length < 3) return [];
    
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&countrycodes=in&limit=5`;
    
    return withCache(`osm_${query.trim().toLowerCase()}`, async () => {
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'MobiMartEcommerce/1.0 (contact@mobimart.local)'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      
      return data.map((item) => {
        const addr = item.address || {};
        const city = addr.city || addr.town || addr.village || addr.state_district || '';
        const state = addr.state || '';
        const country = addr.country || 'India';
        const postalCode = addr.postcode || '';
        
        // Build a readable label
        const parts = [];
        if (addr.road) parts.push(addr.road);
        if (addr.suburb) parts.push(addr.suburb);
        if (city) parts.push(city);
        if (state) parts.push(state);
        
        return {
          id: item.place_id,
          label: parts.join(', ') || item.display_name,
          city,
          state,
          country,
          postalCode,
          raw: item
        };
      });
    });
  },

  /**
   * Fetch details for an Indian PIN code
   * @param {string} pincode 6-digit PIN code
   */
  getPincodeDetails: async (pincode) => {
    if (!pincode || !/^\d{6}$/.test(pincode)) return null;

    const url = `https://api.postalpincode.in/pincode/${pincode}`;

    return withCache(`pin_${pincode}`, async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch pincode');
      
      const data = await response.json();
      
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
        const po = data[0].PostOffice[0];
        return {
          city: po.District || po.Region,
          state: po.State,
          country: po.Country,
        };
      }
      return null;
    });
  }
};
