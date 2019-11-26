'use strict';
require('dotenv').config();
const express = require('express');
const PORT = process.env.PORT;
const superagent=require('superagent');
const app = express();
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.get('/searches', (req, res) => {
    res.render('pages/form');
});
app.post('/searches', getBook);
 function getBook(req,res) {
     console.log('query',req.body)
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';
    if (req.body.searchResult === 'title') {
        url = url + req.body.text
    }
    else if (req.body.searchResult === 'author') {
        url = url + req.body.text;
        // console.log(url)
    }
    console.log ('url',url);
    superagent.get(url)
   .then( data => {
       let books = data.body.items
       res.render('pages/show',{books:books})
    // return data.body.items.map( (one) => {
    //     return new Book(one);
    // });
});
};
    // function Book(data) {
    //     this.title= data.volumeInfo.title
    //     this.author = data.volumeInfo.authors[0];
    //     this.description = data.volumeInfo.description;
    //     this.imageLinks = data.volumeInfo.imageLinks.thumbnail;
    // }
    app.listen(PORT, () => console.log(`Up on port${PORT}`))
    // // res.json(data.body);
    //     res.render('pages/show', { show:data.body.items});
    //     // res.status(200).send(data.body);
    // });
