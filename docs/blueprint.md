# **App Name**: SpiceHub Automation Demo

## Core Features:

- Menu Display: Display menu items fetched from hardcoded JSON with filtering by category.
- Add to Cart: Enable users to add items to the cart and update the floating cart counter.
- Cart Management: Manage cart items, quantities, and calculate subtotal and total amount.
- Order Placement: Save order details (table number, items, total amount, status, timestamp) to localStorage.
- Order Confirmation: Display order confirmation with order details and a button to start a new order.
- Admin Dashboard: Display all orders fetched from localStorage in a table view with auto-refresh every 2 seconds.
- Order Status Update: Enable the admin to mark orders as 'Served' and update the status in localStorage.

## Style Guidelines:

- Primary color: Vibrant orange (#FF8C00) for key elements and accents to align with the restaurant theme.
- Background color: Light gray (#F5F5F5) for a clean and modern look with good contrast.
- Accent color: A slightly darker shade of orange (#E67700) for hover states and highlights.
- Body and headline font: 'PT Sans' for a modern, readable style suitable for both headings and body text.
- Use simple, clean icons for categories, cart actions, and status indicators.
- Implement a responsive grid layout using Tailwind CSS for menu items and admin dashboard.
- Add subtle hover animations to buttons (scale or shadow) and smooth transitions between pages using React Router.