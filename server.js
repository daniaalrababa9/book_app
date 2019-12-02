'use strict';
require('dotenv').config();
const express = require('express');
const pg = require('pg');
const superagent=require('superagent');
const methodOverride = require('method-override');
const PORT = process.env.PORT;
const client = new pg.Client(process.env.DATABASE_URL);
const app = express();
client.on('error',err=> {throw err;});
app.use(express.json());
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');
app.use(methodOverride((req, res) => {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    let method = req.body._method;
    delete req.body._method;
    return method;
  }
}));


app.put('/update/:book_id',updateBook)
app.delete('/delete/:book_id',deleteBook)
app.get('/',getFromDatabase)
app.get('/searches', showData)
app.post('/searches', getBook)
app.post('/select',showBook)
app.post('/add',addToDatabase)
app.use('*',notFoundHandler);
app.use(errorHandler);



function deleteBook (req,res){
  let SQL ='DElETE FROM book WHERE id=$1'
  let values = [req.params.book_id]
client.query(SQL,values)
.then(res.redirect('/'))
.catch((error)=>errorHandler(error,res))
}

function updateBook (req,res){
  let {title, authors, isbn, description, imgURL } = req.body;
  let SQL = 'UPDATE book SET title=$1, authors=$2, isbn=$3, description=$4,  imgURL=$5 WHERE id=$6';
  let values=[title, authors, isbn,description, imgURL,req.params.book_id];
  client.query(SQL,values)
  .then(res.redirect('/'))
  .catch((error)=>errorHandler(error,res))
}

 function getFromDatabase (req,res) {
    const SQL= 'SELECT * FROM book;'
    client.query(SQL)
      .then(results => {
        console.log('result',results)
        res.render('pages/index',{data:results.rows})
      })
      .catch((error)=>errorHandler(error,res))
  }
  
 function showData(req, res) {
    res.render('pages/form');
   }
 function getBook(req,res) {
     console.log('query',req.body)
    let url = 'https://www.googleapis.com/books/v1/volumes?q=';
    if (req.body.searchResult === 'title') {
        url = url + req.body.text
    }
    else if (req.body.searchResult === 'authors') {
        url = url + req.body.text;
    }
    console.log ('url',url);
    superagent.get(url)
   .then( data => {
       let books = data.body.items
       res.render('pages/show',{books:books})
});
};

 function showBook(req,res){
    let {title, authors, isbn, description, imgURL } = req.body;
    console.log('dania',title, authors, isbn, description, imgURL);
    res.render('pages/selectedBook', {book:req.body})
  };
 function addToDatabase(req,res){
    let {title, authors, isbn,description, imgURL}=req.body;
    console.log('dfgg',req.body)
    let SQL= 'INSERT INTO book (title, authors, isbn,description, imgURL) VALUES ($1,$2,$3,$4,$5);'
    let values=[title, authors, isbn,description, imgURL];
    console.log ('values',values)
    client.query(SQL,values)
    .then(results => {
      res.redirect('/',)
    })
  }

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
    