
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


let searchbar = document.getElementById('searchbar');

console.log(searchbar);


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
    }, 100);


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


// Event listener for the search bar
searchbar.addEventListener('keyup', (e) => {
    // update the library display with the search results
    updateLibraryDisplay(myLibrary, e.target.value);
});

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
        let bookHTML = e.target.parentElement.parentElement;
        // get the book id
        let bookID = e.target.parentElement.parentElement.getAttribute('data-id'); 
        // find the index of the book in the library
        let bookIndex = myLibrary.findIndex((book) => book.id === parseInt(bookID)); 
        // remove book from library
        myLibrary.splice(bookIndex, 1);

        bookHTML.classList.remove('visible'); // Remove the visible class
        bookHTML.classList.remove('fade-in');
        // Remove the book from the display after the animation is completed
        bookHTML.classList.add('fade-out-collapse'); // Add the fade-out class 
        setTimeout(() => {
            bookHTML.remove(); // Remove the book from the display
            // Update the library array
            myLibrary = myLibrary.filter((book) => book.id !== parseInt(bookID));
        }, 500); // The duration should match the transition duration in the CSS
    }   
    // otherwise display the edit form modal, and allow the user to edit the book
    else if (e.target.classList.contains('btn-secondary')) {  
        // get the book id
         currentBookID = e.target.parentElement.parentElement.getAttribute('data-id');
        // find the index of the book in the library
        let bookIndex = myLibrary.findIndex((book) => book.id === parseInt(currentBookID)); 
        // get the book object
        let book = myLibrary[bookIndex];
        // add the book values to the edit form
        editTitle.value = book.title;
        editAuthor.value = book.author;
        editPages.value = book.pages;   
        // ternary operator to set the read value 
        book.read === 'Yes' ? editRead.selectedIndex = 0 : editRead.selectedIndex = 1;
    }
})


// change library order based on the select value(title, author, pages)
orderSelect.addEventListener('click', (e) => {
    // get the data-value of the selected option
    let order = e.target.getAttribute('data-value');
    console.log(order); 
    // sort the library array based on the order value
    myLibrary.sort((a, b) => {
        if (a[order] < b[order]) {
            return -1;
        }
        else if (a[order] > b[order]) {
            return 1;
        }
        else {
            return 0;
        }
    }) 
    // clear the library display
    libraryDisplay.innerHTML = '';
    // add the books to the display
    myLibrary.forEach((book) => {
        book.addBookToDisplay();
    }
    )
});

// Move the editSubmit event listener outside the libraryDisplay event listener

editSubmit.addEventListener('click', () => {
    if (currentBookID !== undefined) {
        let bookHTML = libraryDisplay.querySelector(`tr[data-id='${currentBookID}']`);
        let currentBookIndex = myLibrary.findIndex((book) => book.id === parseInt(currentBookID));
        bookHTML.children[0].textContent = editTitle.value;
        bookHTML.children[1].textContent = editAuthor.value;
        bookHTML.children[2].textContent = editPages.value; 
        // ternary operator to set the read value 
        editRead.selectedIndex === 0 ? bookHTML.children[3].textContent = 'Yes' : bookHTML.children[3].textContent = 'No';


        myLibrary[currentBookIndex].title = editTitle.value;
        myLibrary[currentBookIndex].author = editAuthor.value;
        myLibrary[currentBookIndex].pages = editPages.value;
        // ternary operator to set the read value
        editRead.selectedIndex === 0 ? myLibrary[currentBookIndex].read = 'Yes' : myLibrary[currentBookIndex].read = 'No';
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



function updateLibraryDisplay(library, search) { 
    // clear the library display
    libraryDisplay.innerHTML = '';

    // if the search value is empty then add all the books to the display
    if (search === '') {
        library.forEach((book) => {
            book.addBookToDisplay();
        })
        return;
    }  
    // if a string is entered in the search bar then filter the library based on the title or author
    if (isNaN(search)) {
        let filteredLibrary = library.filter((book) => book.title.toLowerCase().includes(search.toLowerCase()) || book.author.toLowerCase().includes(search.toLowerCase()));
        // add the books to the display
        filteredLibrary.forEach((book) => {
            book.addBookToDisplay();
            console.log("string");
        }
        )
        return;
    } 

    // if a number is entered in the search bar then filter the library based on the pages - the pages are strings
    if (!isNaN(search)) {
        let filteredLibrary = library.filter((book) => book.pages.includes(search));
        // add the books to the display
        filteredLibrary.forEach((book) => {
            book.addBookToDisplay();
            console.log("number");
        }
        )
        return;
    }
}


