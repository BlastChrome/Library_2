
// Constructor Function(s)
function Book(title, author, pages, hasRead) {
    // the constructor 
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
    this.id = this.createID();
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

//edit modal DOM Elements 
const editTitle = document.getElementById("edit-title");
const editAuthor = document.getElementById("edit-author");
const editPages = document.getElementById("edit-pages");
const editRead = document.getElementById("edit-read");
const editSubmit = document.getElementById("edit-submit");

const modalTitle = document.querySelector(".modal-title");
const modalBody = document.querySelector(".modal-body");
//event listeners 
submitBtn.addEventListener('click', function (e) {
    //logic for adding book to library  
    e.preventDefault();
    if (titleForm.value == '' || authorForm.value == '' || pagesForm.value == '') {
        lib.addErrorClass('new-book');
        return;
    } else if (lib.hasBook(titleForm.value)) {
        return;
    } else {
        let book = new Book(titleForm.value, authorForm.value, pagesForm.value, readSelect.value);
        lib.addBookToArr(book);
        lib.render()
    }
    lib.addErrorClass('new-book');
})
editSubmit.addEventListener('click', function (e) {
    e.preventDefault();
    if (editTitle.value == '' || editAuthor.value == '' || editPages.value == '') {
        lib.addErrorClass('edit-book');
        return;
    } else if (lib.hasBook(editTitle.value)) {
        return;
    } else {
        let book = lib.findBookById(modalBody.getAttribute('id'));
        book.edit(editTitle.value, editAuthor.value, editPages.value, editRead.value);
        lib.render()
    }
    lib.addErrorClass('edit-book');
})

// Class Method
Book.prototype.updateBook = function () { }
Book.prototype.createBookElement = function () {
    let bookEl = document.createElement('tr');
    bookEl.setAttribute('id', this.id);
    bookEl.innerHTML =
        ` 
    <td>${this.title}</td>
    <td>${this.author}</td>
    <td>${this.pages}</td>
    <td>${this.hasRead == true ? 'Yes' : 'No'}</td>
    <td class="button-box">
        <button data-toggle="modal" data-target="#editModal" class='btn btn-primary'onclick="initEditForm(${this.id})">Edit</button>
         <button class='btn btn-danger'onclick="deleteBook(${this.id})">Delete</button>
    </td>
    `
    return bookEl;
}
Book.prototype.createID = function () {
    // Generate a random number between 100 and 999 (inclusive)
    const id = Math.floor(Math.random() * (999 - 100 + 1)) + 100;
    return id;
}
Book.prototype.edit = function (title, author, pages, hasRead) {
    this.title = title
    this.author = author
    this.pages = pages
    this.hasRead = hasRead
}

Library.prototype.addBookToArr = function (book) {
    //if the book is in the lib, dont add
    if (this.hasBook(book)) {
        return;
    } else {
        //book added to internal lib array
        this.libArr.push(book);
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
Library.prototype.addErrorClass = function (form) {
    let forms = [];
    if (form == 'new-book') {
        forms = [titleForm, authorForm, pagesForm];
    } else if (form == 'edit-book') {
        forms = [editTitle, editAuthor, editPages];
    }
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
Library.prototype.render = function () {
    //clear the current library element 
    while (this.libDisplay.firstChild) this.libDisplay.removeChild(this.libDisplay.lastChild);
    //loop through library array and create book html for each book
    for (let i = 0; i < this.libArr.length; i++) {
        this.addBookToDisplay(this.libArr[i]);
    }
}
Library.prototype.findBookById = function (id) {
    return this.libArr.find(book => book.id == id);
}

// Instantition of Library
let lib = new Library();

//test values 
let book1 = new Book("Hunter x Hunter", "Yoshihiro Togashi", 400, true);
let book2 = new Book("Jujustu Kaisen", "Gege Akutami", 200, true);
let book3 = new Book("One Piece", "Eiichiro Oda", 1000, true);
let book4 = new Book("Berserk", "Kentaro Miura", 500, true);
lib.addBookToArr(book1);
lib.addBookToArr(book2);
lib.addBookToArr(book3);
lib.addBookToArr(book4);
lib.render()

//public functions
function initEditForm(id) {
    modalTitle.innerHTML = 'Edit Book: ';
    let book = lib.findBookById(id);
    // sets the forms default values to that of the book of the same id 
    editTitle.value = book.title;
    editAuthor.value = book.author;
    editPages.value = book.pages;
    modalTitle.innerHTML += book.title;
    //gives the modal body the same id as the book
    modalBody.setAttribute('id', book.id);
}
function deleteBook(id) {
    for (let i = 0; i < lib.libArr.length; i++) {
        if (lib.libArr[i].id == id) {
            lib.libArr.splice(i, 1);
            lib.render();
        }
    }
}
