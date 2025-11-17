

/**
 * Calculates the size of an object's serialized JSON string in bytes.
 * @param {object} payload The request or response body object.
 * @returns {number} The size in bytes, or 0 if invalid.
 */
export const getPayloadSize = (payload) => {
  if (!payload || typeof payload !== 'object') {
    return 0;
  }
  try {
    const serialized = JSON.stringify(payload);
    return Buffer.byteLength(serialized, 'utf8');
  } catch (error) {
    console.error('Failed to stringify payload for size calculation:', error);
    return 0;
  }
};

