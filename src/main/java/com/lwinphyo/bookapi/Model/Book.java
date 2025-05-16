package com.lwinphyo.bookapi.Model;

import jakarta.persistence.Entity;
// import jakarta.persistence.GeneratedValue;
// import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Book {

    @Id
    // We're manually managing IDs now
    private Long id;

    private String title;
    private String author;
    private String link;
    private Long updatedAt;

    public Book() {}

    public Book(String title, String author, String link) {
        this.title = title;
        this.author = author;
        this.link = link;
        this.updatedAt = System.currentTimeMillis();
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getLink() {
        return link;
    }

    public void setLink(String link) {
        this.link = link;
    }
    
    public Long getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(Long updatedAt) {
        this.updatedAt = updatedAt;
    }
}
