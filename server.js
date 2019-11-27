'use strict';
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL);
const superagent=require('superagent');
const app = express();
client.on('error',err=> {throw err;});
app.use(express.json());
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

app.get('/', (req,res) => {
 

    const SQL= 'SELECT * FROM book;'
    client.query(SQL)
      .then(results => {
        console.log('result',results)
        res.render('pages/index',{data:results.rows})
      })
  
      .catch((error)=>errorHandler(error))
  
  });
  
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
    else if (req.body.searchResult === 'authors') {
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
app.post('/select',showBook);

function showBook(req,res){
    let {title, authors, isbn, description, imgURL } = req.body;
    console.log('dania',title, authors, isbn, description, imgURL);
    res.render('pages/selectedBook', {book:req.body})
  };
  app.post('/add',(req,res)=>{
    let {title, authors, isbn,description, imgURL}=req.body;
    console.log('dfgg',req.body)
    let SQL= 'INSERT INTO book (title, authors, isbn,description, imgURL) VALUES ($1,$2,$3,$4,$5);'
    let values=[title, authors, isbn,description, imgURL];
    console.log ('values',values)
    client.query(SQL,values)
    .then(results => {
      res.redirect('/',)
      // .catch(err => errorHandler(err,res));
    })
  });
  
  // function Book(data) {
  //     this.title= data.volumeInfo.title
  //     this.author = data.volumeInfo.authors[0];
  //     this.description = data.volumeInfo.description;
  //     this.imageLinks = data.volumeInfo.imageLinks.thumbnail;
  //     this.isbn=data.volumeInfo.industryIdentifiers&&data.volumeInfo.industryIdentifiers[0].identifier;  
  //   };
    
    app.use('*',notFoundHandler);
app.use(errorHandler);

    function notFoundHandler(req,res){
        res.status(404).send('Oh No!');
    };
    function errorHandler(error,req,res){
res.status(500).send(error);
    };
    client.connect()
    .then (()=>{
        app.listen(PORT, () => console.log(`Up on port${PORT}`)
        );
    })
    .catch(err => {
        throw `PG Startup Error: ${err.message}`;
      });
    