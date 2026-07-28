import React, { useEffect } from 'react';

/* ==========================================================================
   SEO Component
   - Lightweight SEO head manager for Single Page Applications
   - Updates document title and index descriptions dynamically
   - Renders OpenGraph / Twitter Cards meta attributes
   - Appends canonical URLs and dynamic JSON-LD structured schema script blocks
   ========================================================================== */

export const SEO = ({ 
  title, 
  description = 'MobiMart: Premium certified pre-owned and refurbished smartphones. Original Apple, Samsung, Google Pixel devices checked for quality.', 
  path = '', 
  type = 'website',
  schema = null 
}) => {
  const siteUrl = 'https://www.mobimart.in';
  const fullTitle = `${title} | MobiMart Premium`;
  const canonicalUrl = `${siteUrl}${path}`;

  useEffect(() => {
    // 1. Update page title
    document.title = fullTitle;

    // Helper to sync meta tags
    const setMeta = (name, content, isProperty = false) => {
      if (!content) return;
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (isProperty) {
          el.setAttribute('property', name);
        } else {
          el.setAttribute('name', name);
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 2. Set description
    setMeta('description', description);

    // 3. Set OpenGraph tags
    setMeta('og:title', fullTitle, true);
    setMeta('og:description', description, true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('og:type', type, true);
    setMeta('og:site_name', 'MobiMart Premium', true);

    // 4. Set Twitter tags
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description);

    // 5. Update Canonical link
    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.setAttribute('href', canonicalUrl);

    // 6. Manage JSON-LD Schema
    const scriptId = 'mobimart-json-ld';
    let scriptEl = document.getElementById(scriptId);
    
    if (schema) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = scriptId;
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(schema);
    } else if (scriptEl) {
      scriptEl.remove(); // clear if page has no page-level schemas
    }

  }, [fullTitle, description, canonicalUrl, type, schema]);

  return null; // pure side-effect head manager
};

export default SEO;
