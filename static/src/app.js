
// Constructor Function(s)
function Book(title, author, pages, hasRead, id) {
    // the constructor 
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.hasRead = hasRead;
    id == null ? this.id = this.createID() : this.id = id;
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

const orderSelect = document.getElementById("order-select");
const searchForm = document.getElementById("searchbar");
const clearBtn = document.getElementById("clear-btn");

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
        // add book to local storage 
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
    } else {
        let book = lib.findBookById(modalBody.getAttribute('id'));
        book.edit(editTitle.value, editAuthor.value, editPages.value, editRead.value);
        lib.render()
    }
    lib.addErrorClass('edit-book');
})

searchForm.addEventListener('input', function (e) {
    let input = e.target.value;
    lib.libArr.forEach(book => {
        const isVisible = book.title.includes(input) || book.pages.toString().includes(input) || book.author.includes(input);
        book.element.classList.toggle("hide", !isVisible);
    })
})

orderSelect.addEventListener("click", function (e) {
    if (e.target.id == 'order-title') {
        lib.sortLibraryByTitle();
    } else if (e.target.id == 'order-author') {
        lib.sortLibraryByAuthor();
    } else {
        lib.sortLibraryByPages();
    }
    lib.render();
})

clearBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.clear();
    lib.libArr = [];
    lib.render();

})

// Class Method(s)
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
    this.setBookEl(bookEl);
    return bookEl;
}

Book.prototype.setBookEl = function (el) {
    this.element = el;
}

Book.prototype.getBookEl = function () {
    return this.element;
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
        addBookToStorage(book);
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
    //after 2 seconds remove error/success class;
    setTimeout(() => {
        for (let i = 0; i < forms.length; i++) {
            forms[i].classList.remove("success");
            forms[i].classList.remove("error");
        }
    }, "2000");

}

Library.prototype.render = function () {
    //clear the current library elements
    while (this.libDisplay.firstChild) this.libDisplay.removeChild(this.libDisplay.lastChild);
    //loop through library array and create book html for each book 

    for (let i = 0; i < this.libArr.length; i++) {
        this.addBookToDisplay(this.libArr[i]);
    }
}

Library.prototype.findBookById = function (id) {
    return this.libArr.find(book => book.id == id);
}

Library.prototype.sortLibraryByTitle = function () {
    this.libArr.sort(compareTitles);
    this.render();
}

Library.prototype.sortLibraryByAuthor = function () {
    this.libArr.sort(compareAuthor);
}

Library.prototype.sortLibraryByPages = function () {
    this.libArr.sort(comparePages);

}

function compareTitles(a, b) {
    return (a.title < b.title) ? -1 : (a.title > b.title) ? 1 : 0;
}

function compareAuthor(a, b) {
    return (a.author < b.author) ? -1 : (a.author > b.author) ? 1 : 0;
}

function comparePages(a, b) {
    return (a.pages < b.pages) ? -1 : (a.pages > b.pages) ? 1 : 0;
}
// Instantition of Library
let lib = new Library();

if (localStorage !== null) {
    addToLibraryFromStorage()
}
lib.render();

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
    let book = lib.findBookById(id);
    lib.libArr = lib.libArr.filter((element => element.title != book.title))
    deleteBookFromStorage(book);
    lib.render();
}

function addBookToStorage(book) {
    let existingBooks = JSON.parse(localStorage.getItem("library"));
    if (existingBooks == null) existingBooks = [];
    if (existingBooks.find((search) => search.title == book.title)) return;
    existingBooks.push(book);
    localStorage.setItem("library", JSON.stringify(existingBooks));
}

function deleteBookFromStorage(book) {
    let existingBooks = JSON.parse(localStorage.getItem("library"));
    existingBooks = existingBooks.filter((element => element.title != book.title));
    localStorage.setItem("library", JSON.stringify(existingBooks));
}

function addToLibraryFromStorage() {
    let existingBooks = JSON.parse(localStorage.getItem("library"));
    if (existingBooks == null) return;
    for (let i = 0; i < existingBooks.length; i++) {
        let book = new Book(existingBooks[i].title, existingBooks[i].author, existingBooks[i].pages, existingBooks[i].hasRead, existingBooks[i].id);
        lib.addBookToArr(book);
        addBookToStorage(book);
    }
}

function storageHasBook(book) {
    storageLib = JSON.parse(localStorage.getItem("library"));
    return storageLib.find((search) => search.title == book.title) ? true : false;
}