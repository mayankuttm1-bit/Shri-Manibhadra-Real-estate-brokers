# Shri Manibhadra Real Estate Brokers - Luxury Multipage Platform

A premium, full-stack multipage real estate consultancy portal for **Shri Manibhadra Real Estate Brokers**, Ujjain's trusted property advisory firm. Built following the design standard of [TRS Property Mall](https://www.trspropertymall.com/) with a rich brand aesthetic (Midnight Navy, Brass Gold, Limestone, and Plus Jakarta Sans / Playfair Display typography).

---

## 🌟 Key Features

- **Multipage Architecture**:
  - **Home (`/`)**: Hero section with dynamic Buy & Sell tabs, real-time property search, stats proof, handpicked featured listings, why choose us, client reviews, FAQ accordion, and floating WhatsApp & Call actions.
  - **Properties (`/properties`)**: Comprehensive listing catalog with multi-criteria filters (keyword, category, property type, budget ranges, sorting), live counter, interactive Leaflet map, and direct inquiry triggers.
  - **Services (`/services`)**: Detailed showcase of 19 specialized property services across residential, commercial, plots, and advisory; MP stamp duty & registration calculator, 4-step methodology, and consultation booking modal.
  - **About Us (`/about`)**: Company story, mission/vision/values, locality expertise across 8 key Ujjain areas, achievements, team introduction, and office location map.
  - **Contact (`/contact`)**: Instant WhatsApp & Call action cards, consultation booking form, office directions, interactive map, and FAQ accordion.
  - **Admin Portal (`/login` & `/admin`)**: Protected dashboard with KPI analytics, listing manager (CRUD), coordinate picker map, and lead CRM with one-click WhatsApp replies.

- **Mobile First & Responsive**:
  - Hamburger menu with custom slide-out navigation drawer.
  - Non-sticky, scrollable filter bars on mobile devices.
  - Stacked circular floating Call and WhatsApp buttons.
  - Unified 4-column Midnight Navy footer across all pages.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Tailwind CSS, Custom CSS (`trs-style.css`)
- **Maps**: Leaflet.js with CartoDB & OpenStreetMap tiles
- **Icons**: Lucide Icons & SVG icons
- **Data Store**: JSON file-based database (`data/properties.json`, `data/inquiries.json`, `data/users.json`) with validation schemas

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mayankuttm1-bit/Shri-Manibhadra-Real-estate-brokers.git
   cd Shri-Manibhadra-Real-estate-brokers
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   # or
   node server.js
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## 📍 Office Location

**Shri Manibhadra Real Estate Brokers**  
Shop 14, Shyama Prasad Mukherjee Complex,  
Nanakheda, Jawahar Nagar, Malipura,  
Ujjain - 456001, Madhya Pradesh, India  
- **Phone**: +91 98765 43210  
- **Email**: info@manibhadrarealestate.com  
- **Working Hours**: Mon - Sun: 10:00 AM - 8:00 PM  

---

## 📄 License

ISC License © 2026 Shri Manibhadra Real Estate Brokers. All rights reserved.
