const { nanoid } = require('nanoid');
const books = require('./notes');

const addBookHandler = (request, h) => {

    const {name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    let finished = false;
    
    if(pageCount === readPage){
        finished = true;
    }

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt, 
    };
    if(name == null){
        const response = h.response({
            status : "fail", 
            message : "Gagal menambahkan buku. Mohon isi nama buku",
        });
        response.code(400);
        return response;

    }else if(parseInt(readPage) > parseInt(pageCount)){
        const response = h.response({
            status : "fail",
            message : "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
        });
        response.code(400);
        return response;
    }else{
    books.push(newBook);
    }
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if(isSuccess) {
        const response = h.response({
            status : 'success',
            message : "Buku berhasil ditambahkan",
            data : {
                bookId : id,
            },
        });
        response.code(201);
        return response;
}
        const response = h.response({
            status : 'fail',
            message : "Buku gagal ditambahkan",
        });
        response.code(500);
        return response;
};
/*
const getAllBooksHandler = () => ({ 
    status : 'success',
    data : {
        books : books.map((book) => ({    
            id : book.id,
            name : book.name,
            publisher : book.publisher,
        })),
    },
});
*/
const getAllBooksHandler = (request, h) => {
    let responseBooks = books.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
  
    const { name, reading, finished } = request.query;
    // check if user input reading query
    if (reading === '1' || reading === '0') {
      let isReading = false;
      isReading = reading === '1';
      const booksReading = books.filter((book) => book.reading === isReading);
      responseBooks = booksReading.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    }
  
    // check if user input finished query
    if (finished === '1' || finished === '0') {
      let isFinished = false;
      isFinished = finished === '1';
      const booksfinished = books.filter((book) => book.finished === isFinished);
      responseBooks = booksfinished.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      }));
    }
    // check if user input name query
    if (name !== undefined) {
      responseBooks = responseBooks.filter((book) =>
        book.name.toLowerCase().includes(name.toLowerCase())
      );
    }
  
    const response = h.response({
      status: 'success',
      data: {
        books: responseBooks,
      },
    });
    return response;
  };

const getBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const book = books.filter((n) => n.id === id)[0];
    if (book !== undefined) {
        return {
            status : 'success',
            data : {
                book,
            },
        };
    }

    const response = h.response({
        status :'fail', 
        message: 'Buku tidak ditemukan'
    });
    response.code(404);
    return response;
};

const editBookByIdHandler = (request, h) => {
    const { id } = request.params;

    const {name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = books.findIndex((book) => book.id === id);

    if(index !== -1) {
        if(name == null){
            const response = h.response({
                status : "fail", 
                message : "Gagal memperbarui buku. Mohon isi nama buku",
            });
            response.code(400);
            return response;

        }else if(parseInt(readPage) > parseInt(pageCount)){
            const response = h.response({
                status : "fail",
                message : "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
            });
            response.code(400);
            return response;
        }else {

        books[index] = {
            ...books[index],
            name, 
            year, 
            author, 
            summary, 
            publisher, 
            pageCount,
            readPage, 
            reading, 
            updatedAt,
        };

        const response = h.response ({
            status : 'success', 
            message : "Buku berhasil diperbarui"
        });
        response.code(200);
        return response;
        }
}
    const response = h.response({
        status : 'fail', 
        message : 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

const deleteBooksByIdHandler = (request, h) => {
    const { id } = request.params; 

    const index = books.findIndex((book) => book.id === id);
    if (index !== -1) {
        books.splice(index, 1); 

        const response = h.response({
            status : 'success', 
            message : 'Buku berhasil dihapus',
        });
        response.code(200);
        return response;
    }
    const response = h.response({
        status : 'fail', 
        message : "Buku gagal dihapus. Id tidak ditemukan",
    });
    response.code(404);
    return response;
};


module.exports = { addBookHandler, getAllBooksHandler, getBookByIdHandler, editBookByIdHandler, deleteBooksByIdHandler };