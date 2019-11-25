'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT;
const superagent=require('superagent');
const app = express();
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    
    let url = 'https://www.googleapis.com/books/v1/volumes?q=peanuts';
    superagent.get(url)
    .then(data => {
    // res.json(data.body);
        res.render('pages/index', { show:data.body.items});
        // res.status(200).send(data.body);
    });
    res.render('pages/index');
});

app.get('/show', bookHandler);
function bookHandler(req,res) {
    getBook(req.query.data)
      .then( (bookData) => res.status(200).json(bookData) );
  }


 function getBook(query) {
    let url = 'https://www.googleapis.com/books/v1/volumes?q=peanuts';
   return superagent.get(url)
   .then( data => {
    return data.body.items.map( (one) => {
        return new Book(one);
    });
});
}        
    
    function Book(data) {
        this.title= data.volumeInfo.title
        this.author = data.volumeInfo.authors[0];
        this.description = data.volumeInfo.description;
        this.imageLinks = data.volumeInfo.imageLinks.thumbnail;
    }
    
    app.listen(PORT, () => console.log(`Up on port${PORT}`))
    
    // // res.json(data.body);
    //     res.render('pages/show', { show:data.body.items});
    //     // res.status(200).send(data.body);
    // });