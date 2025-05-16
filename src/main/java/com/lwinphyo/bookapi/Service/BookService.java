package com.lwinphyo.bookapi.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lwinphyo.bookapi.Model.Book;
import com.lwinphyo.bookapi.Repository.BookRepository;


@Service
public class BookService {

    @Autowired
    private BookRepository bookRepository;
    public BookService(BookRepository bookRepository) {
        this.bookRepository = bookRepository;
    }


    // Read all
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    // Read one
    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    // Read by Author
    public List<Book> getAllBooksByAuthor(String author) {
        return bookRepository.findAll().stream()
                .filter(a -> a.getAuthor().equals(author))
                .toList();
    }

    // Read by Title
    public Book getBookByTitle(String title) {
        return bookRepository.findByTitle(title);
    }

    @Autowired
    private IdGeneratorService idGeneratorService;
    
    // Create one
    public Book addBook(Book bookDTO) {
        // Set the next available ID
        Long nextId = idGeneratorService.getNextAvailableId();
        bookDTO.setId(nextId);
        // Set current timestamp
        bookDTO.setUpdatedAt(System.currentTimeMillis());
        return bookRepository.save(bookDTO);
    }

    // Create many
    public List<Book> addManyBooks(List<Book> books) {
        return bookRepository.saveAll(books);
    }

    // Update one by Id
    public Book updateBook(Long id, Book bookDetail) {
        Book book = bookRepository.findById(id).get();
        if (book != null) {
            book.setTitle(bookDetail.getTitle());
            book.setAuthor(bookDetail.getAuthor());
            book.setLink(bookDetail.getLink());
            // Update timestamp
            book.setUpdatedAt(System.currentTimeMillis());
            return bookRepository.save(book);
        } else {
            return null;
        }
    }

    // Update by title
    public Book updateBookByTitle(String title, Book bookDetail) {
        Book book = bookRepository.findByTitle(title);
        if (book != null) {
            book.setAuthor(bookDetail.getAuthor());
            book.setTitle(bookDetail.getTitle());
            book.setLink(bookDetail.getLink());
            // Update timestamp
            book.setUpdatedAt(System.currentTimeMillis());
            return bookRepository.save(book);
        } else {
            return null;
        }
    }

    // Delete one by Id
    public Boolean deleteBook(Long id) {
        if (bookRepository.existsById(id)) {
            bookRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    // Delete one by Title
    public Boolean deleteBookByTitle(String title) {
        bookRepository.deleteByTitle(title);
        return true;
    }

}
