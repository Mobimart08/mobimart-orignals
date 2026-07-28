import { LEGACY_CONDITION_LABELS } from '../constants/productCatalog.js';

export const deriveProductCondition = (product = {}) => {
  if (product.productCondition) {
    return product.productCondition;
  }

  if (product.condition === 'Open Box') {
    return 'Open Box';
  }

  if (product.conditionType === 'New') {
    return 'New';
  }

  if (product.condition === 'Certified Like New') {
    return 'Refurbished';
  }

  if (product.conditionType === 'Used') {
    return 'Used';
  }

  return 'New';
};

export const deriveConditionType = (productCondition) => {
  return productCondition === 'New' || productCondition === 'Open Box' ? 'New' : 'Used';
};

const normalizeLegacyCondition = (label) => {
  if (!label) return null;
  if (label === 'Brand New - Sealed') return 'New';
  if (label === 'Certified Like New') return 'Refurbished';
  if (label === 'Open Box') return 'Open Box';
  if (['Excellent', 'Very Good', 'Good'].includes(label)) return 'Used';
  return null;
};

export const deriveLegacyConditionLabel = (productCondition, currentLabel = null) => {
  const expected = LEGACY_CONDITION_LABELS[productCondition] || LEGACY_CONDITION_LABELS.New;
  if (!currentLabel) {
    return expected;
  }

  return normalizeLegacyCondition(currentLabel) === productCondition ? currentLabel : expected;
};

export const buildDefaultSku = (product) => {
  const objectId = String(product._id || '').slice(-6).toUpperCase();
  const slugBase = String(product.slug || product.name || 'ITEM')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase()
    .slice(0, 8);

  return `${slugBase || 'ITEM'}-${objectId || '000000'}`;
};


