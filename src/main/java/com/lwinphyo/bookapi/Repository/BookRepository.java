package com.lwinphyo.bookapi.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.lwinphyo.bookapi.Model.Book;

import jakarta.transaction.Transactional;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    Book findByTitle(String title);

    boolean existsByTitle(String title);

    @Transactional
    @Modifying
    @Query("DELETE FROM Book b WHERE b.title = :title")
    int deleteByTitle(@Param("title") String title);

    // int deleteByTitle(String title);
}
