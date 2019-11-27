DROP TABLE IF EXISTS book;
CREATE TABLE IF NOT EXISTS book (
 id SERIAL PRIMARY KEY,
 title VARCHAR(255),
  authors VARCHAR(255),
  isbn VARCHAR(255),
  description TEXT,
  imgURL VARCHAR(255)
  
);
INSERT INTO book (title, authors,isbn, description ,imgURL )
VALUES('animals','bayan','66','animal is beautiful','image link');