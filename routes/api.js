/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const mongoose = require('mongoose');
const { Schema} = mongoose;

const BookSchema = new Schema({
  title: { type: String, required: true },
  comments: { type: [String], default: [] },
  commentcount: { type: Number, default: 0 }
});

const Book = mongoose.model('Book', BookSchema);

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      //response will be array of book objects
      const books = await Book.find({}, 'title _id commentcount');
      res.json(books);
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      let title = req.body.title;
      if (!title) {
        return res.json('missing required field title');
      }
      const newBook = new Book({ title });
      await newBook.save();
      res.json({ _id: newBook._id, title: newBook.title });
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      await Book.deleteMany({});
      res.json('complete delete successful');
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      let bookid = req.params.id;
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.json('no book exists');
        }
        res.json(book);
      } catch (err) {
        res.json('no book exists');
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      if (!comment) {
        return res.json('missing required field comment');
      }
      try {
        const book = await Book.findById(bookid);
        if (!book) {
          return res.json('no book exists');
        }
        book.comments.push(comment);
        book.commentcount += 1;
        await book.save();
        res.json(book);
      } catch (err) {
        res.json('no book exists');
      }
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      try {
        const book = await Book.findByIdAndDelete(bookid);
        if (!book) {
          return res.json('no book exists');
        }
        res.json('delete successful');
      } catch (err) {
        res.json('no book exists');
      }
    });
  
};
