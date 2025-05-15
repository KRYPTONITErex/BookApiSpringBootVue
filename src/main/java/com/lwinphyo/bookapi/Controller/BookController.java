package com.lwinphyo.bookapi.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lwinphyo.bookapi.Model.Book;
import com.lwinphyo.bookapi.Service.BookService;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "*")
public class BookController {

    @Autowired
    private BookService bookService;
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // Read all
    @GetMapping
     public ResponseEntity<List<Book>> getAllBooks() {
         System.out.println("Controller: Get all books");
         List<Book> books = bookService.getAllBooks();
         return new ResponseEntity<>(books, HttpStatus.OK);
    }

    // Read one
    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id){
        System.out.println("Controller: Get book by id + " + id);
        if(id == null){
            System.out.println("No Book with your requested id");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Book book = bookService.getBookById(id);
        return new ResponseEntity<>(book, HttpStatus.OK);
    }

    // Read by Author
    @GetMapping("/author/{author}")
    public ResponseEntity<List<Book>> getAllBooksByAuthor(@PathVariable String author){
        System.out.println("Controller: Get all books by author + " + author);
        List<Book> booksByAuthor = bookService.getAllBooksByAuthor(author);
        return new ResponseEntity<>(booksByAuthor, HttpStatus.OK);
    }

    // Read by Title
    @GetMapping("/title/{title}")
    public ResponseEntity<Book> getBookByTitle(@PathVariable String title){
        System.out.println("Controller: Get book by title + " + title);
        Book bookByTitle = bookService.getBookByTitle(title);
        return new ResponseEntity<>(bookByTitle, HttpStatus.OK);
    }

    // Create one
    @PostMapping("/add")
    public ResponseEntity<Book> addBook(@RequestBody Book book){
        System.out.println("Controller: Add book");
        Book addedBook = bookService.addBook(book);
        return new ResponseEntity<>(addedBook, HttpStatus.CREATED);
    }

    // Create Many
    @PostMapping("/addMany")
    public ResponseEntity<List<Book>> addMannyBook(@RequestBody List<Book> books){
        System.out.println("Controller: Add many books");
        List<Book> addedManyBooks = bookService.addManyBooks(books);
        return new ResponseEntity<>(addedManyBooks, HttpStatus.CREATED);
    }

    // Update one by Id
    @PutMapping("/update/{id}")
    public ResponseEntity<Book> updateBook(@PathVariable Long id, @RequestBody Book bookDetail){
        System.out.println("Controller: Update book by id + " + id);
        Book updatedBook = bookService.updateBook(id, bookDetail);
        return new ResponseEntity<>(updatedBook, HttpStatus.OK);
    }

    // Update one by title
    @PutMapping("/update/title/{title}")
    public ResponseEntity<Book> updateBookByTitle(@PathVariable String title, @RequestBody Book bookDetails){
        System.out.println("Controller: Update book by title + " + title);
        Book updatedBookByTitle = bookService.updateBookByTitle(title, bookDetails);
        return new ResponseEntity<>(updatedBookByTitle, HttpStatus.OK);
    }

    // Delete one by Id
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Boolean> deleteBookById(@PathVariable Long id){
        System.out.println("Controller: Delete book by id + " + id);
        Boolean deletedBook = bookService.deleteBook(id);
        return new ResponseEntity<>(deletedBook, HttpStatus.OK);
    }

    // Delete one by Title
    @DeleteMapping("/delete/title/{title}")
    public ResponseEntity<String> deleteBookByTitle(@PathVariable String title){
        System.out.println("Controller: Delete book by title + " + title);
        Boolean deletedBookByTitle = bookService.deleteBookByTitle(title);
        return new ResponseEntity<>(deletedBookByTitle.toString(), HttpStatus.OK);
    }


   
}
 