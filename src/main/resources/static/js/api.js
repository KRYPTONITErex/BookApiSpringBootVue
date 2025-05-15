/**
 * API service for book operations
 */
const BookAPI = {
    /**
     * Get all books
     * @returns {Promise} Promise object with books data
     */
    getAllBooks() {
        return axios.get('/books');
    },

    /**
     * Add a new book
     * @param {Object} book - Book object with title and author
     * @returns {Promise} Promise object with the created book
     */
    addBook(book) {
        return axios.post('/books/add', book);
    },

    /**
     * Delete a book by ID
     * @param {number} id - Book ID
     * @returns {Promise} Promise object with deletion result
     */
    deleteBook(id) {
        return axios.delete(`/books/delete/${id}`);
    },

    /**
     * Delete a book by title
     * @param {string} title - Book title
     * @returns {Promise} Promise object with deletion result
     */
    deleteBookByTitle(title) {
        return axios.delete(`/books/delete/title/${encodeURIComponent(title)}`);
    },

    /**
     * Get a book by ID
     * @param {number} id - Book ID
     * @returns {Promise} Promise object with book data
     */
    getBookById(id) {
        return axios.get(`/books/${id}`);
    },

    /**
     * Get a book by title
     * @param {string} title - Book title
     * @returns {Promise} Promise object with book data
     */
    getBookByTitle(title) {
        return axios.get(`/books/title/${encodeURIComponent(title)}`);
    },

    /**
     * Get books by author
     * @param {string} author - Author name
     * @returns {Promise} Promise object with books data
     */
    getBooksByAuthor(author) {
        return axios.get(`/books/author/${encodeURIComponent(author)}`);
    },

    /**
     * Update a book by ID
     * @param {number} id - Book ID
     * @param {Object} book - Updated book data
     * @returns {Promise} Promise object with updated book
     */
    updateBook(id, book) {
        return axios.put(`/books/update/${id}`, book);
    },

    /**
     * Update a book by title
     * @param {string} title - Original book title
     * @param {Object} book - Updated book data
     * @returns {Promise} Promise object with updated book
     */
    updateBookByTitle(title, book) {
        return axios.put(`/books/update/title/${encodeURIComponent(title)}`, book);
    }
};