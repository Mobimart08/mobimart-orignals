import { useState, useEffect, useCallback, useRef } from 'react';
import { addressProvider } from '../services/addressProvider';

export const useAddressAutocomplete = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef(null);

  // Clear debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const fetchSuggestions = useCallback((searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 3) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setShowDropdown(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await addressProvider.getSuggestions(searchQuery);
        setSuggestions(results || []);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 600); // 600ms debounce to respect Nominatim limits
  }, []);

  const fetchPincodeDetails = useCallback(async (pincode) => {
    if (!pincode || !/^\d{6}$/.test(pincode)) return null;
    return await addressProvider.getPincodeDetails(pincode);
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    setShowDropdown(false);
  }, []);

  return {
    query,
    setQuery,
    suggestions,
    loading,
    showDropdown,
    setShowDropdown,
    fetchSuggestions,
    fetchPincodeDetails,
    clearSuggestions,
  };
};
