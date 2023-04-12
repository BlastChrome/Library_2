
// Global variables

let title = document.getElementById('title');
let author = document.getElementById('author');
let pages = document.getElementById('pages');
let read = document.getElementById('read'); 
let submit = document.getElementById('submit'); 

let editTitle = document.getElementById('edit-title');
let editAuthor = document.getElementById('edit-author');
let editPages = document.getElementById('edit-pages');
let editRead = document.getElementById('edit-read');
let editSubmit = document.getElementById('edit-submit');

const libraryDisplay = document.getElementById('library-display'); 
const orderSelect = document.getElementById('order-select');  
const titleOrder = document.getElementById('order-title');
const authorOrder = document.getElementById('order-author'); 
const pagesOrder = document.getElementById('order-pages');



// Global variables for stats
let totalPages = 0; 
let totalBooks = 0; 
let totalRead = 0; 
let totalUnread = 0;

// global variable for current book to be edited 
let currentBookID = null;

// Obect constructor function for Book

function Book(title, author, pages, read) { 
    this.id = generateID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

// Adds the book to the library and calls the addBookToDisplay function
Book.prototype.addBookToLibraryDisplay = function (book) {
    myLibrary.push(book); 
    this.addBookToDisplay(book,myLibrary);
};
// Adds the book to the display
Book.prototype.addBookToDisplay = function () { 
    let bookHTML = document.createElement('tr');
    bookHTML.classList.add('book');  
    bookHTML.setAttribute('data-id', this.id);
    bookHTML.innerHTML = `<td class="book-title">${this.title}</td>
                          <td class="book-author">${this.author}</td>
                          <td class="book-pages">${this.pages}</td>
                          <td class="book-read">${this.read}</td>
                          <td>
                                        <a type="button" class="btn btn-secondary" data-toggle="modal" data-target="#editModal">
                                            Update
                                        </a>
                                        <a href="#" class="btn btn-danger">
                                            <i class="fas fa-angle-double-right"></i> Delete
                                        </a> 
                                       
                                    </td>`;
    libraryDisplay.appendChild(bookHTML); 
    // Add the fade-in effect
    bookHTML.classList.add('fade-in');
    setTimeout(() => {
        bookHTML.classList.add('visible');
    }, 10);


    // Clears the form
    [title, author, pages].forEach((input) => {input.value = '';})

}



// starting books 
let book1 = new Book('Hunter x Hunter', 'Yoshihiro Togashi', '366', 'Yes');
let book2 = new Book('The Shining', 'Stephen King', '447', 'No');
let book3 = new Book('A Clockwork Orange', 'Anthony Burgess', '288', 'Yes');
let book4 = new Book('The Hellbound Heart', 'Clive Barker', '288', 'Yes');

// Library array
let myLibrary = [book1, book2, book3, book4]; 





/* Event listeners */

// Submit new book
submit.addEventListener('click', (e) => {
    // Error handling
    if (title.value === '' || author.value === '' || pages.value === '') {
        //  add class .error to empty fields  and success to filled fields
        [title, author, pages].forEach((input) => { 
                if (input.value === '') {
                    input.classList.add('error'); 
                }
                else {
                    input.classList.remove('error'); 
                    input.classList.add('success');
                }
        }
        )
    }
    else{
    // Stops page from reloading
    e.preventDefault(); 
    // create book object 
    let book = new Book(title.value, author.value, pages.value, read.value);

    console.log(book);
    // Gets Values from forms and passes them to the addBookToLibraryDisplay function
    book.addBookToLibraryDisplay(book); 
}
    
}); 

// Event delegation for the delete and update buttons
libraryDisplay.addEventListener('click', (e) => {
    // if the delete button is clicked then delete the book from the library and the display
    if (e.target.classList.contains('btn-danger')) { 
        // bookhtml 
        
        // get the book id
        let bookID = e.target.parentElement.parentElement.getAttribute('data-id'); 
        // find the index of the book in the library
        let bookIndex = myLibrary.findIndex((book) => book.id === parseInt(bookID)); 
        // remove book from library
        myLibrary.splice(bookIndex, 1);

        bookHTML.classList.add('fade-out'); // Add the fade-out class

        // Remove the book from the display after the animation is completed
        setTimeout(() => {
            bookHTML.remove();
        }, 500); // The duration should match the transition duration in the CSS
    }   
    // otherwise display the edit form modal, and allow the user to edit the book
    else if (e.target.classList.contains('btn-secondary')) {  
        // get the book id
         currentBookID = e.target.parentElement.parentElement.getAttribute('data-id');
         console.log(currentBookID);
        // find the index of the book in the library
        let bookIndex = myLibrary.findIndex((book) => book.id === parseInt(currentBookID)); 
        console.log(bookIndex);
        // get the book object
        let book = myLibrary[bookIndex];
        // add the book values to the edit form
        editTitle.value = book.title;
        editAuthor.value = book.author;
        editPages.value = book.pages; 
    }
})


// change library order based on the select value(title, author, pages)
orderSelect.addEventListener('click', (e) => {
    let order = e.target.getAttribute('value');
});

// Move the editSubmit event listener outside the libraryDisplay event listener


editSubmit.addEventListener('click', () => {
    if (currentBookID !== undefined) {
        let bookHTML = libraryDisplay.querySelector(`tr[data-id='${currentBookID}']`);
        let currentBookIndex = myLibrary.findIndex((book) => book.id === parseInt(currentBookID));
        console.log(bookHTML);
        bookHTML.children[0].textContent = editTitle.value;
        bookHTML.children[1].textContent = editAuthor.value;
        bookHTML.children[2].textContent = editPages.value;

        myLibrary[currentBookIndex].title = editTitle.value;
        myLibrary[currentBookIndex].author = editAuthor.value;
        myLibrary[currentBookIndex].pages = editPages.value;

        console.log(myLibrary);
    }
});


// onload add the starting books to the display
window.onload = function () {
    myLibrary.forEach((book) => {
        book.addBookToDisplay();
    })  
}

// functions 
function generateID() {
    return Math.floor(Math.random() * 100000000);
}






