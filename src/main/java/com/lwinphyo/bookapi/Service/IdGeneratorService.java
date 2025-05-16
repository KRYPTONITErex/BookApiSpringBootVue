package com.lwinphyo.bookapi.Service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lwinphyo.bookapi.Model.Book;
import com.lwinphyo.bookapi.Repository.BookRepository;

@Service
public class IdGeneratorService {

    @Autowired
    private BookRepository bookRepository;

    /**
     * Find the next available ID starting from 1
     * @return The next available ID
     */
    public Long getNextAvailableId() {
        List<Book> books = bookRepository.findAll();
        
        if (books.isEmpty()) {
            return 1L;
        }
        
        // Get all existing IDs
        List<Long> existingIds = books.stream()
                .map(Book::getId)
                .sorted()
                .collect(Collectors.toList());
        
        // Find the first gap or return next ID after the highest
        Long nextId = 1L;
        for (Long id : existingIds) {
            if (id.equals(nextId)) {
                nextId++;
            } else if (id > nextId) {
                break;
            }
        }
        
        return nextId;
    }
}