# Online Food Ordering Website

A responsive **frontend demonstration** of an online food ordering website built with **HTML5, CSS3, JavaScript and Browser Local Storage**.

> **Important:** This project is a frontend demonstration only. It has no backend and no database. No real orders are placed and no payments are processed.

Prepared for: *Level 2 – Hackathon: Fundamentals of Web Development*
Student: Santhosh Kumar K | B.Sc. Computer Science, II Year | Government Arts and Science College, Melvenkatapuram | Thiruvalluvar University

## Project Introduction
The website lets a customer browse a menu of Indian food items, search and filter dishes, add them to a cart, manage quantities, review an order summary, enter customer details and submit a demonstration order.

## Problem Statement
Develop an online food ordering website that enables customers to browse food items, search and filter dishes, add products to a cart, manage quantities, and review their order before submission.

## Objectives
- Display food items dynamically from a JavaScript data array.
- Allow searching by name and filtering by category.
- Provide a shopping cart with add, remove, increase and decrease options.
- Calculate item subtotals and the order total dynamically.
- Validate customer details before an order can be submitted.
- Save and restore the cart using Local Storage.
- Provide a responsive layout for mobile and desktop.

## Features
1. Dynamic display of 20 food items (image, name, description, category, price in ₹).
2. Search food items by name (live, as you type).
3. Filter by category (Biryani, South Indian, Fast Food, Meals & Curries, Beverages, Desserts).
4. Add items to the shopping cart.
5. Remove items from the cart (and clear the whole cart).
6. Increase and decrease quantities (maximum 20 per item).
7. Dynamic item subtotals.
8. Dynamic order total (delivery ₹30, free for orders of ₹500 or more).
9. Order summary table with items, quantities and prices.
10. Customer validation (name, mobile, email, address, PIN code, payment method).
11. Cart saved and restored using Local Storage.
12. Empty-cart and no-results messages.
13. Order confirmation dialog after valid submission.
14. Responsive design for mobile and desktop.

## Technologies Used
- **HTML5** – page structure
- **CSS3** – styling, Flexbox, Grid, media queries
- **JavaScript (ES6)** – application logic, DOM manipulation, validation
- **Browser Local Storage** – saving the cart

No frameworks, no paid APIs and no backend are required.

## Project Folder Structure
```
Online-Food-Ordering-Website/
├── index.html          Main page
├── index-standalone.html  Single-file version (CSS, JS and images built in)
├── css/
│   └── style.css       Styles and responsive design
├── js/
│   └── script.js       Application logic
├── images/             20 food illustrations (SVG)
├── screenshots/        Screenshots of the working site
├── README.md
└── .gitignore
```

## Installation Instructions
No installation is needed. You only need a modern web browser (Chrome, Edge, Firefox). Visual Studio Code with the *Live Server* extension is optional.

1. Download `Online-Food-Ordering-Website.zip` (or clone the repository).
2. Right-click the ZIP file and choose **Extract All**.

## How to Run the Project
**Method 1 – Direct:** Open the extracted folder and double-click `index.html`.

**Method 2 – Visual Studio Code:** Open the folder in VS Code (*File → Open Folder*), right-click `index.html` and choose **Open with Live Server** (if the extension is installed).

**Troubleshooting – page looks blank or unstyled:** you probably opened `index.html` from inside the ZIP file. Extract (unzip) the whole folder first and keep the `css`, `js` and `images` folders next to `index.html`. On a phone, or if it still does not open, use `index-standalone.html`, which works as a single file.

## How to Use the Website
1. Browse the menu or type a dish name in the search box.
2. Click a category button to filter dishes.
3. Click **Add to Cart** on any item.
4. Use **+** and **−** in the cart to change quantities, or **Remove** to delete an item.
5. Check the **Order Summary** for subtotals and the total.
6. Fill in the **Customer Details** form and click **Submit Demonstration Order**.
7. Read the confirmation dialog. Refresh the page before submitting to confirm the cart is restored.

## Testing Details
The application was tested in headless Chromium using an automated script (Playwright) plus visual checks of screenshots. 20 checks passed, covering: 20 items displayed and images loading, search, category filter, no-results message, empty-cart message, add/increase/decrease/remove, subtotal and total calculations (including the free-delivery rule), Local Storage restore after refresh, validation of empty and invalid input, order confirmation, cart cleared after submission, no console errors, and no horizontal scrolling at a 390 px mobile width.
Testing on other browsers and real mobile devices has not been done.

## Limitations
- Frontend demonstration only: no real orders or payments.
- No user accounts, backend or database.
- Cart data is stored only in the current browser and can be cleared by the user.
- Food images are simple illustrations, not photographs.
- Order IDs are generated in the browser for demonstration.

## Future Enhancements
- User authentication
- Backend and database integration
- Real restaurant order management
- Secure payment gateway integration
- Order tracking
- Restaurant administration dashboard

## Licence
Created for educational purposes.
