
// Constructor Function(s)
function Book(title, author, pages, hasRead) {
    // the constructor 
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
}
function Library() {
    this.libArr = [];
    this.libDisplay = document.getElementById("library-display");
}

//DOM Elements
const titleForm = document.getElementById("title");
const authorForm = document.getElementById("author");
const pagesForm = document.getElementById("pages");
const readSelect = document.getElementById("read");
const submitBtn = document.getElementById("submit");


//event listeners 
submitBtn.addEventListener('click', function (e) {
    //logic for adding book to library  
    e.preventDefault();
    let book = new Book(titleForm.value, authorForm.value, pagesForm.value, readSelect.value);
    if (lib.hasBook(book.title)) {
        delete book;

    } else if (book.title == '' || book.author == '') {
    } else {
        lib.addBook(book);
    }
    lib.addErrorClass();
    console.log(lib.getInfo())

})

// Class Methods
Book.prototype.updateBook = function () { }
Book.prototype.createBookElement = function () {
    let bookEl = document.createElement('tr');
    bookEl.innerHTML =
        ` 
    <td>${this.title}</td>
    <td>${this.author}</td>
    <td>${this.pages}</td>
    <td>${this.hasRead == true ? 'Yes' : 'No'}</td>
    <td></td>
    `
    return bookEl;
}
Book.prototype.getInfo = function () { }

Library.prototype.addBook = function (book) {
    //if the book is in the lib, dont add
    if (this.hasBook(book)) {
        return;
    } else {
        //book added to internal lib array
        this.libArr.push(book);
        //book added to library display 
        this.addBookToDisplay(book);
    }
}
Library.prototype.removeBookFromLibrary = function (book) { }
Library.prototype.hasBook = function (title) {
    // if the lib arr has the title of the book, return true 
    for (let i = 0; i < this.libArr.length; i++) {
        if (title == this.libArr[i].title) return true;
    }
    return false;
}
Library.prototype.getInfo = function () {
    return this;
}
Library.prototype.addBookToDisplay = function (book) {
    //creates the book html
    let el = book.createBookElement()
    //adds the el as a child node to the lib display
    this.libDisplay.appendChild(el);
}
Library.prototype.addErrorClass = function () {
    let forms = [titleForm, authorForm, pagesForm];
    for (let i = 0; i < forms.length; i++) {
        if (forms[i].value == '') {
            forms[i].classList.add('error');
            forms[i].classList.remove('success');
        } else {
            forms[i].classList.add('success');
            forms[i].classList.remove('error');
        }
    }

}

// Instantition of Library
let lib = new Library();




