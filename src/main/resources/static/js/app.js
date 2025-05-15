const { createApp } = Vue;

createApp({
    data() {
        return {
            books: [],
            newBook: {
                title: '',
                author: ''
            },
            activeTab: 'all',
            searchId: '',
            searchTitle: '',
            searchAuthor: '',
            searchResults: [],
            searchPerformed: false,
            showEditModal: false,
            editingBook: {
                id: null,
                title: '',
                author: ''
            },
            editByTitle: false,
            originalTitle: ''
        }
    },
    mounted() {
        this.fetchBooks();
    },
    methods: {
        setActiveTab(tab) {
            this.activeTab = tab;
            if (tab === 'all') {
                this.fetchBooks();
            }
        },
        fetchBooks() {
            BookAPI.getAllBooks()
                .then(response => {
                    this.books = response.data;
                })
                .catch(error => {
                    console.error('Error fetching books:', error);
                });
        },
        addBook() {
            if (!this.newBook.title || !this.newBook.author) {
                alert('Please fill in all fields');
                return;
            }
            
            BookAPI.addBook(this.newBook)
                .then(response => {
                    this.books.push(response.data);
                    this.newBook = { title: '', author: '' };
                    alert('Book added successfully!');
                    this.setActiveTab('all');
                })
                .catch(error => {
                    console.error('Error adding book:', error);
                    alert('Error adding book. Please try again.');
                });
        },
        deleteBook(id) {
            if (confirm('Are you sure you want to delete this book?')) {
                BookAPI.deleteBook(id)
                    .then(response => {
                        this.books = this.books.filter(book => book.id !== id);
                        this.searchResults = this.searchResults.filter(book => book.id !== id);
                        alert('Book deleted successfully!');
                    })
                    .catch(error => {
                        console.error('Error deleting book:', error);
                        alert('Error deleting book. Please try again.');
                    });
            }
        },
        deleteBookByTitle(title) {
            if (confirm(`Are you sure you want to delete the book titled "${title}"?`)) {
                BookAPI.deleteBookByTitle(title)
                    .then(response => {
                        this.books = this.books.filter(book => book.title !== title);
                        this.searchResults = this.searchResults.filter(book => book.title !== title);
                        alert('Book deleted successfully!');
                    })
                    .catch(error => {
                        console.error('Error deleting book:', error);
                        alert('Error deleting book. Please try again.');
                    });
            }
        },
        searchById() {
            if (!this.searchId) {
                alert('Please enter an ID to search');
                return;
            }
            
            BookAPI.getBookById(this.searchId)
                .then(response => {
                    this.searchResults = response.data ? [response.data] : [];
                    this.searchPerformed = true;
                })
                .catch(error => {
                    console.error('Error searching book by ID:', error);
                    this.searchResults = [];
                    this.searchPerformed = true;
                });
        },
        searchByTitle() {
            if (!this.searchTitle) {
                alert('Please enter a title to search');
                return;
            }
            
            BookAPI.getBookByTitle(this.searchTitle)
                .then(response => {
                    this.searchResults = response.data ? [response.data] : [];
                    this.searchPerformed = true;
                })
                .catch(error => {
                    console.error('Error searching book by title:', error);
                    this.searchResults = [];
                    this.searchPerformed = true;
                });
        },
        searchByAuthor() {
            if (!this.searchAuthor) {
                alert('Please enter an author to search');
                return;
            }
            
            BookAPI.getBooksByAuthor(this.searchAuthor)
                .then(response => {
                    this.searchResults = response.data || [];
                    this.searchPerformed = true;
                })
                .catch(error => {
                    console.error('Error searching books by author:', error);
                    this.searchResults = [];
                    this.searchPerformed = true;
                });
        },
        resetSearch() {
            this.searchId = '';
            this.searchTitle = '';
            this.searchAuthor = '';
            this.searchResults = [];
            this.searchPerformed = false;
        },
        openEditModal(book) {
            this.editingBook = { ...book };
            this.originalTitle = book.title;
            this.editByTitle = false;
            this.showEditModal = true;
        },
        closeEditModal() {
            this.showEditModal = false;
        },
        updateBook() {
            if (!this.editingBook.title || !this.editingBook.author) {
                alert('Please fill in all fields');
                return;
            }
            
            if (this.editByTitle) {
                // Update by title
                BookAPI.updateBookByTitle(this.originalTitle, this.editingBook)
                    .then(response => {
                        const index = this.books.findIndex(book => book.title === this.originalTitle);
                        if (index !== -1) {
                            this.books.splice(index, 1, response.data);
                        }
                        
                        const searchIndex = this.searchResults.findIndex(book => book.title === this.originalTitle);
                        if (searchIndex !== -1) {
                            this.searchResults.splice(searchIndex, 1, response.data);
                        }
                        
                        this.closeEditModal();
                        alert('Book updated successfully!');
                    })
                    .catch(error => {
                        console.error('Error updating book:', error);
                        alert('Error updating book. Please try again.');
                    });
            } else {
                // Update by ID
                BookAPI.updateBook(this.editingBook.id, this.editingBook)
                    .then(response => {
                        const index = this.books.findIndex(book => book.id === this.editingBook.id);
                        if (index !== -1) {
                            this.books.splice(index, 1, response.data);
                        }
                        
                        const searchIndex = this.searchResults.findIndex(book => book.id === this.editingBook.id);
                        if (searchIndex !== -1) {
                            this.searchResults.splice(searchIndex, 1, response.data);
                        }
                        
                        this.closeEditModal();
                        alert('Book updated successfully!');
                    })
                    .catch(error => {
                        console.error('Error updating book:', error);
                        alert('Error updating book. Please try again.');
                    });
            }
        }
    }
}).mount('#app');