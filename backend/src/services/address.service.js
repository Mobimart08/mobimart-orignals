/* ==========================================================================
   src/services/address.service.js
   Address CRUD and default-status state management service.
   Enforces the 5-address cap per customer.
   ========================================================================== */

import Address from '../models/Address.model.js';
import { BadRequestError, NotFoundError } from '../utils/ApiError.js';

/**
 * Retrieves all saved addresses for a specific customer.
 */
export const getAddressesByUserId = async (userId) => {
  return Address.find({ userId }).sort({ createdAt: -1 });
};

/**
 * Creates a new address for a user.
 * Enforces a maximum limit of 5 addresses.
 * Forces the first address to be the default.
 */
export const createAddress = async (userId, addressData) => {
  // 1. Verify limit constraint (Max 5 addresses)
  const count = await Address.countDocuments({ userId });
  if (count >= 5) {
    throw new BadRequestError('Maximum limit of 5 saved addresses reached');
  }

  // 2. Determine default state. If this is the user's first address, force it as default.
  let isDefault = addressData.isDefault || false;
  if (count === 0) {
    isDefault = true;
  }

  // 3. If setting this address as default, unset all other default addresses for the user
  if (isDefault) {
    await Address.updateMany({ userId }, { $set: { isDefault: false } });
  }

  // 4. Create new address document
  const address = await Address.create({
    userId,
    ...addressData,
    isDefault,
  });

  return address;
};

/**
 * Updates an existing address.
 * If set as default, unsets all other defaults.
 */
export const updateAddress = async (userId, addressId, addressData) => {
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) {
    throw new NotFoundError('Address not found');
  }

  // If changing isDefault to true, unset all other defaults
  if (addressData.isDefault === true && !address.isDefault) {
    await Address.updateMany({ userId }, { $set: { isDefault: false } });
    address.isDefault = true;
  } else if (addressData.isDefault === false && address.isDefault) {
    // Cannot unset default if it's the only address or if it's currently the default.
    // Must set another address as default instead.
    throw new BadRequestError('Cannot unset default address. Set another address as default instead.');
  }

  // Update other fields
  const fields = ['label', 'name', 'phone', 'addressLine1', 'addressLine2', 'city', 'state', 'pinCode'];
  fields.forEach((f) => {
    if (addressData[f] !== undefined) {
      address[f] = addressData[f];
    }
  });

  await address.save();
  return address;
};

/**
 * Deletes a saved address.
 * If the deleted address was the default, automatically selects another address as default.
 */
export const deleteAddress = async (userId, addressId) => {
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) {
    throw new NotFoundError('Address not found');
  }

  const wasDefault = address.isDefault;

  // Delete document
  await Address.deleteOne({ _id: addressId });

  // If we deleted the default address, set another address as default (if any exist)
  if (wasDefault) {
    const nextAddress = await Address.findOne({ userId }).sort({ createdAt: -1 });
    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }
};

/**
 * Explicitly sets an address as the default shipping address.
 */
export const setDefaultAddress = async (userId, addressId) => {
  const address = await Address.findOne({ _id: addressId, userId });
  if (!address) {
    throw new NotFoundError('Address not found');
  }

  if (address.isDefault) return address;

  // Unset all other defaults
  await Address.updateMany({ userId }, { $set: { isDefault: false } });

  // Set this one as default
  address.isDefault = true;
  await address.save();

  return address;
};
