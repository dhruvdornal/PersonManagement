# Person Management System

A responsive single-page Progressive Web Application built with React for managing person records with CRUD operations and interactive animations.

Live Demo: https://person-management--jet.vercel.app/

## Features

Progressive Web App (PWA) - Installable, works offline, and provides app-like experience
CRUD Operations - Create, read, update, and delete person records
Responsive Design - Fully responsive tables and forms that work on all device sizes
Form Validation - Client-side validation for all input fields
Interactive Animations - Smooth animations and transitions on the home page
State Management - Efficient and scalable state management
Clean Architecture - Well-organized, maintainable, and scalable code structure

## Tech Stack

Frontend Framework: React.js with React Router for navigation
Styling: Tailwind CSS
Animation Libraries: GSAP/React Three Fiber
Form Handling: React Hook Form with validation
State Management: React Context API/Redux
Deployment: Vercel

## Components

Person-home - Landing page with interactive animations
Person-list - Displays all person records with options to edit and delete
Person-add - Form to add new person records with validation

## Form Validation Rules

First Name & Last Name: No special characters allowed
Email: Standard email validation
Phone: Masked input with 10-digit format
State & City: Cascading dropdown (city options based on state selection)
