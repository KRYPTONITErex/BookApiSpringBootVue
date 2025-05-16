const { createApp, ref, reactive, computed, watch, onMounted } = Vue;

createApp({
    setup() {
        // Reactive state
        const books = ref([]);
        const newBook = reactive({
            title: '',
            author: '',
            link: ''
        });
        const activeTab = ref('all');
        const searchId = ref('');
        const searchTitle = ref('');
        const searchAuthor = ref('');
        const searchResults = ref([]);
        const searchPerformed = ref(false);
        const showEditModal = ref(false);
        const editingBook = reactive({
            id: null,
            title: '',
            author: '',
            link: ''
        });
        const editByTitle = ref(false);
        const originalTitle = ref('');
        const loading = ref(false);
        const toasts = ref([]);
        const isDarkMode = ref(localStorage.getItem('darkMode') === 'true');
        const selectedAuthor = ref('');
        const filteredBooks = ref([]);
        const showScrollTop = ref(false);
        const sortBy = ref('title');
        const sortDirection = ref('asc');
        
        // Computed properties
        const hasBooks = computed(() => books.value.length > 0);
        const hasSearchResults = computed(() => searchResults.value.length > 0);
        
        // Get unique authors for tag cloud
        const uniqueAuthors = computed(() => {
            const authors = books.value.map(book => book.author);
            return [...new Set(authors)].sort();
        });
        
        // Get displayed books based on filters and sorting
        const displayedBooks = computed(() => {
            let result = books.value;
            
            // Apply author filter if selected
            if (selectedAuthor.value) {
                result = result.filter(book => book.author === selectedAuthor.value);
            }
            
            // Apply sorting
            result = [...result].sort((a, b) => {
                let comparison = 0;
                
                if (sortBy.value === 'title') {
                    comparison = a.title.localeCompare(b.title);
                } else if (sortBy.value === 'author') {
                    comparison = a.author.localeCompare(b.author);
                } else if (sortBy.value === 'id') {
                    comparison = a.id - b.id;
                } else if (sortBy.value === 'updatedAt') {
                    // Sort by updatedAt timestamp
                    // Default to 0 if updatedAt is not available
                    const aTime = a.updatedAt || 0;
                    const bTime = b.updatedAt || 0;
                    comparison = aTime - bTime;
                }
                
                // Apply sort direction
                return sortDirection.value === 'asc' ? comparison : -comparison;
            });
            
            return result;
        });
        
        // Watch for changes
        watch(activeTab, (newTab) => {
            if (newTab === 'all') {
                fetchBooks();
            }
        });
        
        // Methods
        const setActiveTab = (tab) => {
            activeTab.value = tab;
        };
        
        const fetchBooks = async () => {
            loading.value = true;
            try {
                const response = await BookAPI.getAllBooks();
                books.value = response.data;
            } catch (error) {
                showToast('error', `Failed to load books: ${error.message}`);
            } finally {
                loading.value = false;
            }
        };
        
        // Filter books by author
        const filterByAuthor = (author) => {
            selectedAuthor.value = author;
            // If we're not on the all books tab, switch to it
            if (activeTab.value !== 'all') {
                setActiveTab('all');
            }
        };
        
        // Clear author filter
        const clearAuthorFilter = () => {
            // Add animation effect when clearing
            const clearBtn = document.querySelector('.clear-tag');
            if (clearBtn) {
                clearBtn.classList.add('clearing');
                setTimeout(() => {
                    selectedAuthor.value = '';
                }, 300);
            } else {
                selectedAuthor.value = '';
            }
        };
        
        const addBook = async () => {
            if (!newBook.title || !newBook.author) {
                showToast('error', 'Please fill in all required fields');
                return;
            }
            
            loading.value = true;
            try {
                // We don't need to set the ID manually - the backend will handle it
                const response = await BookAPI.addBook(newBook);
                books.value.push(response.data);
                newBook.title = '';
                newBook.author = '';
                newBook.link = '';
                showToast('success', 'Book added successfully!');
                setActiveTab('all');
            } catch (error) {
                showToast('error', `Error adding book: ${error.message}`);
            } finally {
                loading.value = false;
            }
        };
        
        const deleteBook = async (id) => {
            if (!confirm('Are you sure you want to delete this book?')) {
                return;
            }
            
            loading.value = true;
            try {
                await BookAPI.deleteBook(id);
                books.value = books.value.filter(book => book.id !== id);
                searchResults.value = searchResults.value.filter(book => book.id !== id);
                showToast('success', 'Book deleted successfully!');
            } catch (error) {
                showToast('error', `Error deleting book: ${error.message}`);
            } finally {
                loading.value = false;
            }
        };
        
        const deleteBookByTitle = async (title) => {
            if (!confirm(`Are you sure you want to delete the book titled "${title}"?`)) {
                return;
            }
            
            loading.value = true;
            try {
                await BookAPI.deleteBookByTitle(title);
                books.value = books.value.filter(book => book.title !== title);
                searchResults.value = searchResults.value.filter(book => book.title !== title);
                showToast('success', 'Book deleted successfully!');
            } catch (error) {
                showToast('error', `Error deleting book: ${error.message}`);
            } finally {
                loading.value = false;
            }
        };
        
        const searchById = async () => {
            if (!searchId.value) {
                showToast('error', 'Please enter an ID to search');
                return;
            }
            
            loading.value = true;
            try {
                const response = await BookAPI.getBookById(searchId.value);
                searchResults.value = response.data ? [response.data] : [];
                searchPerformed.value = true;
            } catch (error) {
                showToast('error', `Error searching book: ${error.message}`);
                searchResults.value = [];
                searchPerformed.value = true;
            } finally {
                loading.value = false;
            }
        };
        
        const searchByTitle = async () => {
            if (!searchTitle.value) {
                showToast('error', 'Please enter a title to search');
                return;
            }
            
            loading.value = true;
            try {
                const response = await BookAPI.getBookByTitle(searchTitle.value);
                searchResults.value = response.data ? [response.data] : [];
                searchPerformed.value = true;
            } catch (error) {
                showToast('error', `Error searching book: ${error.message}`);
                searchResults.value = [];
                searchPerformed.value = true;
            } finally {
                loading.value = false;
            }
        };
        
        const searchByAuthor = async () => {
            if (!searchAuthor.value) {
                showToast('error', 'Please enter an author to search');
                return;
            }
            
            loading.value = true;
            try {
                const response = await BookAPI.getBooksByAuthor(searchAuthor.value);
                searchResults.value = response.data || [];
                searchPerformed.value = true;
            } catch (error) {
                showToast('error', `Error searching books: ${error.message}`);
                searchResults.value = [];
                searchPerformed.value = true;
            } finally {
                loading.value = false;
            }
        };
        
        const resetSearch = () => {
            searchId.value = '';
            searchTitle.value = '';
            searchAuthor.value = '';
            searchResults.value = [];
            searchPerformed.value = false;
        };
        
        const openEditModal = (book) => {
            Object.assign(editingBook, book);
            originalTitle.value = book.title;
            editByTitle.value = false;
            showEditModal.value = true;
        };
        
        const closeEditModal = () => {
            showEditModal.value = false;
        };
        
        const updateBook = async () => {
            if (!editingBook.title || !editingBook.author) {
                showToast('error', 'Please fill in all required fields');
                return;
            }
            
            loading.value = true;
            try {
                let response;
                
                if (editByTitle.value) {
                    // Update by title
                    response = await BookAPI.updateBookByTitle(originalTitle.value, editingBook);
                } else {
                    // Update by ID
                    response = await BookAPI.updateBook(editingBook.id, editingBook);
                }
                
                // Update local data
                const updatedBook = response.data;
                
                // Update in books array
                const bookIndex = books.value.findIndex(book => book.id === updatedBook.id);
                if (bookIndex !== -1) {
                    books.value[bookIndex] = updatedBook;
                }
                
                // Update in search results if present
                const searchIndex = searchResults.value.findIndex(book => book.id === updatedBook.id);
                if (searchIndex !== -1) {
                    searchResults.value[searchIndex] = updatedBook;
                }
                
                closeEditModal();
                showToast('success', 'Book updated successfully!');
            } catch (error) {
                showToast('error', `Error updating book: ${error.message}`);
            } finally {
                loading.value = false;
            }
        };
        
        // Toast notification system
        const showToast = (type, message) => {
            const id = Date.now();
            toasts.value.push({ id, type, message });
            
            // Auto-remove toast after 3 seconds
            setTimeout(() => {
                toasts.value = toasts.value.filter(toast => toast.id !== id);
            }, 3000);
        };
        
        // Keyboard shortcuts
        const setupKeyboardShortcuts = () => {
            document.addEventListener('keydown', (e) => {
                // ESC key closes modal
                if (e.key === 'Escape' && showEditModal.value) {
                    closeEditModal();
                }
                
                // Ctrl+A to add new book
                if (e.ctrlKey && e.key === 'a' && !showEditModal.value) {
                    e.preventDefault();
                    setActiveTab('add');
                }
                
                // Ctrl+S to search
                if (e.ctrlKey && e.key === 's' && !showEditModal.value) {
                    e.preventDefault();
                    setActiveTab('search');
                }
            });
        };
        
        // Theme toggle function
        const toggleTheme = () => {
            isDarkMode.value = !isDarkMode.value;
            localStorage.setItem('darkMode', isDarkMode.value);
            applyTheme();
        };
        
        // Apply theme based on current setting
        const applyTheme = () => {
            // Add transition class
            document.body.classList.add('theme-transition');
            
            // Apply theme
            if (isDarkMode.value) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            
            // Remove transition class after transition completes
            setTimeout(() => {
                document.body.classList.remove('theme-transition');
            }, 300);
        };
        
        // Scroll to top function
        const scrollToTop = () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        };
        
        // Export books to CSV
        const exportBooks = () => {
            if (!books.value.length) {
                showToast('error', 'No books to export');
                return;
            }
            
            // Create CSV content
            const headers = ['ID', 'Title', 'Author', 'Link'];
            const csvContent = [
                headers.join(','),
                ...displayedBooks.value.map(book => 
                    [book.id, `"${book.title.replace(/"/g, '""')}"`, `"${book.author.replace(/"/g, '""')}"`, `"${book.link ? book.link.replace(/"/g, '""') : ''}"`].join(',')
                )
            ].join('\n');
            
            // Create download link
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'books.csv');
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            showToast('success', 'Books exported successfully');
        };
        
        // Print books list
        const printBooks = () => {
            if (!books.value.length) {
                showToast('error', 'No books to print');
                return;
            }
            
            const printWindow = window.open('', '_blank');
            const booksList = displayedBooks.value.map(book => 
                `<div style="margin-bottom: 20px; padding: 10px; border-bottom: 1px solid #eee;">
                    <h3>${book.title}</h3>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>ID:</strong> ${book.id}</p>
                    ${book.link ? `<p><strong>Link:</strong> <a href="${book.link}" target="_blank">${book.link}</a></p>` : ''}
                </div>`
            ).join('');
            
            printWindow.document.write(`
                <html>
                <head>
                    <title>Books List</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { text-align: center; margin-bottom: 30px; }
                    </style>
                </head>
                <body>
                    <h1>Books List</h1>
                    ${booksList}
                </body>
                </html>
            `);
            
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
                printWindow.print();
                printWindow.close();
            }, 250);
        };
        
        // Sort books
        const sortBooks = () => {
            // The actual sorting is handled by the computed property
            showToast('info', `Sorted by ${sortBy.value} (${sortDirection.value === 'asc' ? 'ascending' : 'descending'})`);
        };
        
        // Toggle sort direction
        const toggleSortDirection = () => {
            sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
            sortBooks();
        };
        
        // Handle scroll events for scroll-to-top button, sidebar, header and tabs collapse
        const handleScroll = () => {
            showScrollTop.value = window.scrollY > 300;
            
            // Get the elements
            const sidebar = document.querySelector('.sidebar');
            const header = document.querySelector('.header-container');
            const tabs = document.querySelector('.tabs');
            const mainContent = document.querySelector('.main-content');
            
            // Determine scroll direction
            const scrollingDown = window.scrollY > lastScrollPosition;
            
            // Handle collapse behavior
            if (window.scrollY > 100) {
                if (scrollingDown) {
                    // Scrolling down - hide elements
                    sidebar?.classList.add('collapsed');
                    sidebar?.classList.remove('visible');
                    
                    if (header) {
                        header.classList.add('collapsed');
                        header.classList.remove('visible');
                    }
                } else {
                    // Scrolling up - show elements
                    sidebar?.classList.remove('collapsed');
                    sidebar?.classList.add('visible');
                    
                    if (header) {
                        header.classList.remove('collapsed');
                        header.classList.add('visible');
                    }
                }
                
                // Make tabs sticky when scrolling down
                if (tabs) {
                    tabs.classList.add('sticky');
                    
                    // Adjust top position based on whether header is visible
                    if (header && !header.classList.contains('collapsed')) {
                        tabs.style.top = header.offsetHeight + 'px';
                    } else {
                        tabs.style.top = '0';
                    }
                }
            } else {
                // At the top - always show elements and remove sticky tabs
                sidebar?.classList.remove('collapsed');
                sidebar?.classList.remove('visible');
                
                if (header) {
                    header.classList.remove('collapsed');
                    header.classList.remove('visible');
                }
                
                if (tabs) {
                    tabs.classList.remove('sticky');
                    tabs.style.top = '';
                }
            }
            
            // Update last scroll position
            lastScrollPosition = window.scrollY;
        };
        
        // Track last scroll position to determine scroll direction
        let lastScrollPosition = 0;
        
        // Lifecycle hooks
        onMounted(() => {
            fetchBooks();
            setupKeyboardShortcuts();
            applyTheme();
            
            // Add scroll event listener with throttling for better performance
            let ticking = false;
            window.addEventListener('scroll', () => {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        handleScroll();
                        ticking = false;
                    });
                    ticking = true;
                }
            });
            
            // Initialize UI elements state
            const sidebar = document.querySelector('.sidebar');
            const header = document.querySelector('.header-container');
            
            if (sidebar) {
                sidebar.classList.add('visible');
            }
            
            if (header) {
                header.classList.add('visible');
            }
            
            // Trigger initial scroll handler to set up UI
            handleScroll();
        });
        
        return {
            // State
            books,
            newBook,
            activeTab,
            searchId,
            searchTitle,
            searchAuthor,
            searchResults,
            searchPerformed,
            showEditModal,
            editingBook,
            editByTitle,
            originalTitle,
            loading,
            toasts,
            isDarkMode,
            selectedAuthor,
            uniqueAuthors,
            displayedBooks,
            sortDirection,
            
            // Computed
            hasBooks,
            hasSearchResults,
            
            // Methods
            setActiveTab,
            fetchBooks,
            addBook,
            deleteBook,
            deleteBookByTitle,
            searchById,
            searchByTitle,
            searchByAuthor,
            resetSearch,
            openEditModal,
            closeEditModal,
            updateBook,
            showToast,
            toggleTheme,
            scrollToTop,
            exportBooks,
            printBooks,
            sortBooks,
            showScrollTop,
            sortBy,
            filterByAuthor,
            clearAuthorFilter,
            toggleSortDirection
        };
    }
}).mount('#app');
// Scroll handling for collapsible elements
let lastScrollY = 0;

// Add scroll event listener with throttling
window.addEventListener('scroll', () => {
  // Simple throttling
  if (!window.scrollThrottle) {
    window.scrollThrottle = true;
    
    setTimeout(() => {
      handleScroll();
      window.scrollThrottle = false;
    }, 100);
  }
});

// Handle scroll events
function handleScroll() {
  const currentScrollY = window.scrollY;
  const scrollingDown = currentScrollY > lastScrollY;
  const header = document.querySelector('.header-container');
  const sidebar = document.querySelector('.sidebar');
  const tabs = document.querySelector('.tabs');
  
  // Apply classes based on scroll direction
  if (currentScrollY > 100) {
    if (scrollingDown) {
      header?.classList.add('collapsed');
      sidebar?.classList.add('collapsed');
      if (tabs) tabs.style.top = '0';
    } else {
      header?.classList.remove('collapsed');
      sidebar?.classList.remove('collapsed');
      if (tabs && header) tabs.style.top = header.offsetHeight + 'px';
    }
  } else {
    header?.classList.remove('collapsed');
    sidebar?.classList.remove('collapsed');
  }
  
  // Update last scroll position
  lastScrollY = currentScrollY;
}