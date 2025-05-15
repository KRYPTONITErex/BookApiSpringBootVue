/**
 * API service for book operations with advanced error handling and caching
 */
class BookAPIService {
    constructor() {
        this.baseURL = '/books';
        this.cache = new Map();
        this.cacheTimeout = 60000; // 1 minute cache
        this.pendingRequests = new Map();
    }

    /**
     * Get all books with caching
     * @returns {Promise} Promise object with books data
     */
    async getAllBooks() {
        const cacheKey = 'all-books';
        
        // Check if we have a valid cached response
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
                console.log('Using cached books data');
                return Promise.resolve(cachedData.data);
            }
        }
        
        // Check if there's already a pending request for this resource
        if (this.pendingRequests.has(cacheKey)) {
            return this.pendingRequests.get(cacheKey);
        }
        
        // Make the request and store it as pending
        const request = axios.get(this.baseURL)
            .then(response => {
                // Cache the successful response
                this.cache.set(cacheKey, {
                    data: response,
                    timestamp: Date.now()
                });
                this.pendingRequests.delete(cacheKey);
                return response;
            })
            .catch(error => {
                this.pendingRequests.delete(cacheKey);
                return this._handleError(error);
            });
            
        this.pendingRequests.set(cacheKey, request);
        return request;
    }

    /**
     * Add a new book
     * @param {Object} book - Book object with title and author
     * @returns {Promise} Promise object with the created book
     */
    async addBook(book) {
        try {
            const response = await axios.post(`${this.baseURL}/add`, book);
            this._invalidateCache('all-books');
            return response;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Delete a book by ID
     * @param {number} id - Book ID
     * @returns {Promise} Promise object with deletion result
     */
    async deleteBook(id) {
        try {
            const response = await axios.delete(`${this.baseURL}/delete/${id}`);
            this._invalidateCache('all-books');
            this._invalidateCache(`book-${id}`);
            return response;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Delete a book by title
     * @param {string} title - Book title
     * @returns {Promise} Promise object with deletion result
     */
    async deleteBookByTitle(title) {
        try {
            const response = await axios.delete(`${this.baseURL}/delete/title/${encodeURIComponent(title)}`);
            this._invalidateCache('all-books');
            this._invalidateCache(`book-title-${title}`);
            return response;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Get a book by ID with caching
     * @param {number} id - Book ID
     * @returns {Promise} Promise object with book data
     */
    async getBookById(id) {
        const cacheKey = `book-${id}`;
        
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
                return Promise.resolve(cachedData.data);
            }
        }
        
        try {
            const response = await axios.get(`${this.baseURL}/${id}`);
            this.cache.set(cacheKey, {
                data: response,
                timestamp: Date.now()
            });
            return response;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Get a book by title with caching
     * @param {string} title - Book title
     * @returns {Promise} Promise object with book data
     */
    async getBookByTitle(title) {
        const cacheKey = `book-title-${title}`;
        
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
                return Promise.resolve(cachedData.data);
            }
        }
        
        try {
            const response = await axios.get(`${this.baseURL}/title/${encodeURIComponent(title)}`);
            this.cache.set(cacheKey, {
                data: response,
                timestamp: Date.now()
            });
            return response;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Get books by author with caching
     * @param {string} author - Author name
     * @returns {Promise} Promise object with books data
     */
    async getBooksByAuthor(author) {
        const cacheKey = `books-author-${author}`;
        
        if (this.cache.has(cacheKey)) {
            const cachedData = this.cache.get(cacheKey);
            if (Date.now() - cachedData.timestamp < this.cacheTimeout) {
                return Promise.resolve(cachedData.data);
            }
        }
        
        try {
            const response = await axios.get(`${this.baseURL}/author/${encodeURIComponent(author)}`);
            this.cache.set(cacheKey, {
                data: response,
                timestamp: Date.now()
            });
            return response;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Update a book by ID
     * @param {number} id - Book ID
     * @param {Object} book - Updated book data
     * @returns {Promise} Promise object with updated book
     */
    async updateBook(id, book) {
        try {
            const response = await axios.put(`${this.baseURL}/update/${id}`, book);
            this._invalidateCache('all-books');
            this._invalidateCache(`book-${id}`);
            return response;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Update a book by title
     * @param {string} title - Original book title
     * @param {Object} book - Updated book data
     * @returns {Promise} Promise object with updated book
     */
    async updateBookByTitle(title, book) {
        try {
            const response = await axios.put(`${this.baseURL}/update/title/${encodeURIComponent(title)}`, book);
            this._invalidateCache('all-books');
            this._invalidateCache(`book-title-${title}`);
            if (title !== book.title) {
                this._invalidateCache(`book-title-${book.title}`);
            }
            return response;
        } catch (error) {
            return this._handleError(error);
        }
    }

    /**
     * Clear all cached data
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Invalidate specific cache entry
     * @param {string} key - Cache key to invalidate
     */
    _invalidateCache(key) {
        this.cache.delete(key);
    }

    /**
     * Handle API errors
     * @param {Error} error - Error object
     * @returns {Promise} Rejected promise with error details
     */
    _handleError(error) {
        let errorMessage = 'An unexpected error occurred';
        
        if (error.response) {
            // Server responded with an error status
            const status = error.response.status;
            
            switch (status) {
                case 400:
                    errorMessage = 'Invalid request. Please check your data.';
                    break;
                case 404:
                    errorMessage = 'Resource not found.';
                    break;
                case 500:
                    errorMessage = 'Server error. Please try again later.';
                    break;
                default:
                    errorMessage = `Error: ${error.response.data.message || 'Unknown error'}`;
            }
        } else if (error.request) {
            // Request was made but no response received
            errorMessage = 'No response from server. Please check your connection.';
        }
        
        console.error('API Error:', errorMessage, error);
        return Promise.reject({ message: errorMessage, originalError: error });
    }
}

// Create and export a singleton instance
const BookAPI = new BookAPIService();