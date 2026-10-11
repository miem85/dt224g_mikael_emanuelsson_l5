"use strict";
/*
 * Laboration 5 - Studentkortsgenerator
 * Namn: Mikael Emanuelsson
 */

// Hämta element från DOM
const form = document.querySelector("#studentform");
const clearButton = document.querySelector("#clear");

const fullnameInput = document.querySelector("#fullname");
const emailInput = document.querySelector("#email");
const phoneInput = document.querySelector("#phone");
const fontSelect = document.querySelector("#font");

const previewFullname = document.querySelector("#previewfullname");
const previewEmail = document.querySelector("#previewemail");
const previewPhone = document.querySelector("#previewphone");

const errorList = document.querySelector("#errorlist");
const historySection = document.querySelector("#history");
const deleteHistoryButton = document.querySelector("#delete");


// Array som används för felmeddelanden
let errors = [];

// Array som innehåller sparade studentkort
let history = [];

/**
 * Validerar formulärets inmatning.
 * @returns {boolean}
 */
function validateForm() {
    // Töm tidigare felmeddelanden
    errors = [];

    // Hämta formulärvärden och ta bort överflödiga mellanslag
    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();

    // Kontrollera om namnfältet är tomt
    if (fullname === "") {
        errors.push("Du måste ange ett namn.");
    }

    // Kontrollera om e-postfältet är tomt
    if (email === "") {
        errors.push("Du måste ange en e-postadress.");
    }

    // Kontrollera om telefonfältet är tomt
    if (phone === "") {
        errors.push("Du måste ange ett telefonnummer.");
    }

    // Returnera true om inga fel hittades, annars false
    displayErrors();
    return errors.length === 0;
}


/**
 * Visar felmeddelanden på sidan.
 */
function displayErrors() {
    // Rensa tidigare felmeddelanden
    errorList.innerHTML = "";

    // Skriv ut aktuella felmeddelanden till DOM
    errors.forEach(function(error) {
        const li = document.createElement("li");
        li.textContent = error;
        errorList.appendChild(li);
    });
}


/**
 * Skapar ett studentkort och visar det på sidan.
 */
function createStudentCard() {
    // Hämta information från formuläret
    const fullname = fullnameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const font = fontSelect.value;

    // Uppdatera studentkortet
    previewFullname.textContent = fullname;
    previewEmail.textContent = email;
    previewPhone.textContent = phone;

    // Ändra typsnitt på studentkortets uppgifter
    previewFullname.style.fontFamily = font;
    previewEmail.style.fontFamily = font;
    previewPhone.style.fontFamily = font;

    // Lägg till studentkortet i historiken
    const student = {
        fullname: fullname,
        email: email,
        phone: phone,
        font: font
    };

    // Lägg det senaste studentkortet först i historiken
    history.unshift(student);

    // Spara och uppdatera historiken
    saveHistory();
    renderHistory();
}


/**
 * Sparar historiken i localStorage.
 */
function saveHistory() {
    // Spara history i localStorage
    localStorage.setItem("studentHistory", JSON.stringify(history));
}


/**
 * Läser in tidigare historik från localStorage.
 */
function loadHistory() {
    // Hämta eventuell sparad historik
    const savedHistory = localStorage.getItem("studentHistory");

    // Om historik finns, omvandla JSON-texten till en array
    if (savedHistory !== null) {
    history = JSON.parse(savedHistory);
}
}


/**
 * Visar historiken på sidan.
 */
function renderHistory() {
    // Rensa tidigare visad historik
    historySection.innerHTML = "";

    // Skriv ut innehållet i history till DOM
    history.forEach(function(student) {
        const card = document.createElement("div");

        const fullname = document.createElement("p");
        fullname.textContent = student.fullname;

        const email = document.createElement("p");
        email.textContent = student.email;

        const phone = document.createElement("p");
        phone.textContent = student.phone;

        card.style.fontFamily = student.font;

        card.appendChild(fullname);
        card.appendChild(email);
        card.appendChild(phone);

        historySection.appendChild(card);
    });
}


/**
 * Rensar formulär, aktuellt studentkort och felmeddelanden.
 */
function clearForm() {
    // Återställ formulär och studentkort
    form.reset();

    previewFullname.textContent = "";
    previewEmail.textContent = "";
    previewPhone.textContent = "";

    // Rensa eventuella felmeddelanden
    errors = [];
    displayErrors();
}


/**
 * Raderar hela historiken.
 */
function deleteHistory() {
    // Radera sparad historik
    localStorage.removeItem("studentHistory");

    // Uppdatera history och visningen på sidan
    history = [];
    renderHistory();
}


// Eventlyssnare

// När formuläret skickas:
// - validera inmatningen
// - skapa studentkort om valideringen lyckas
form.addEventListener("submit", function(event) {
    // Förhindra att sidan laddas om när formuläret skickas
    event.preventDefault();

    // Kontrollera formulärets inmatning
    // Skapa studentkort endast om valideringen lyckas
    if (validateForm()) {
        createStudentCard();
    }
});

// När användaren klickar på "Rensa"
clearButton.addEventListener("click", function() {
    clearForm();
});

// När användaren klickar på "Radera historik"
deleteHistoryButton.addEventListener("click", function() {
    deleteHistory();
});

// När sidan laddas:
// - läs in och visa eventuell tidigare historik
loadHistory();
renderHistory();