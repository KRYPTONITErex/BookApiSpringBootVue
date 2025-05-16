/**
 * ID Manager for handling book IDs
 * Ensures new books get the next available ID starting from 1
 */
class IDManager {
  /**
   * Find the next available ID starting from 1
   * @param {Array} books - Array of book objects with IDs
   * @returns {number} - The next available ID
   */
  static getNextAvailableId(books) {
    if (!books || books.length === 0) {
      return 1;
    }
    
    // Create a set of existing IDs for O(1) lookup
    const existingIds = new Set(books.map(book => book.id));
    
    // Find the first available ID starting from 1
    let nextId = 1;
    while (existingIds.has(nextId)) {
      nextId++;
    }
    
    return nextId;
  }
}