# Product Requirements Document (PRD)

## Project Title: Shri Manibhadra Real Estate Brokers Platform
**Reference Model**: [TRS Property Mall](https://www.trspropertymall.com/)  
**Document Version**: 1.0.0  
**Date**: September 19, 2026  
**Status**: Approved for Architecture & Implementation  

---

## 1. Executive Summary & Vision

### 1.1 Product Vision
To build an authoritative, luxury-tier real estate web platform for **Shri Manibhadra Real Estate Brokers** (Ujjain, MP) that delivers the exact high-end look, feel, and seamless user experience of **TRS Property Mall**, paired with a robust **Authentication System**, an **Interactive Admin Analytics Dashboard**, a **Self-Serve Property Listing Manager (CRUD)**, and a **Single Unified Map Embedding All Properties**.

### 1.2 Business Context
* **Business Entity**: Shri Manibhadra Real Estate Brokers
* **Office Location**: Shop 14, Shyama Prasad Mukherjee Complex, Nanakheda, Jawahar Nagar, Malipura, Ujjain - 456001, Madhya Pradesh
* **Operating Hours**: Monday – Sunday: 10:00 AM – 8:00 PM (All 7 days)
* **Market Standing**: 4.9★ rating with 43+ verified client reviews; top-rated property consultant in the Ujjain & Malipura/Nanakheda growth corridor.

---

## 2. Target Audience & User Personas

| Persona | Description | Primary Needs | Key Platform Touchpoints |
| :--- | :--- | :--- | :--- |
| **Property Buyer (Local/NRI)** | Individuals seeking residential flats, duplexes, luxury villas, or investment plots in Ujjain. | Fast search by locality/budget, verified legal status, single map view of all available properties, instant WhatsApp inquiry. | Hero search bar, All-Properties Map, WhatsApp CTA, EMI calculator. |
| **Commercial Investor** | Business owners and retail investors looking for shops, offices, or highway-touch land. | Accurate pricing, sq.ft. dimensions, commercial viability analysis, high-traffic location mapping. | Commercial listings, Comparative Market Analysis (CMA), All-Properties Map. |
| **Property Seller / Landowner** | Property owners wishing to list their plots, homes, or commercial spaces for sale/rent. | Easy listing submission, transparent broker representation, maximum exposure. | "Post Property Free" flow, Seller's Agent services. |
| **Broker Admin (Client)** | The business owner/manager of Shri Manibhadra Real Estate Brokers. | View platform traffic and leads, add/edit/delete property listings, plot pins on the map, monitor lead conversions. | Password-protected Admin Panel, Analytics Dashboard, Property CRUD manager. |

---

## 3. Design System & Brand Identity (TRS Property Mall Model)

The platform adopts the luxury architectural styling of **TRS Property Mall**:

### 3.1 Color Palette
* **Midnight Navy (`--color-navy`)**: `#0B192C` / `#102642` (Header, hero overlay, footer, primary buttons)
* **Brass Gold (`--color-brass`)**: `#C9A24B` / `#D4AF37` (Accent borders, badges, prices, icons, highlights)
* **Limestone (`--color-limestone`)**: `#F7F6F2` (Section backgrounds, card surfaces)
* **Charcoal Ink (`--color-ink`)**: `#121826` (Primary typography, dark badges)
* **Taupe Slate (`--color-taupe`)**: `#8A8170` / `#64748B` (Subtitles, metadata, secondary text)
* **Pure Paper (`--color-paper`)**: `#FFFFFF` / `#FBFAF6` (White cards, contrast text)
* **WhatsApp Emerald**: `#25D366` (Quick chat / inquiry action buttons)

### 3.2 Typography & Spacing
* **Headings / Display**: `Playfair Display`, `Cinzel`, or serif display font for luxury real estate authority.
* **Body / UI**: `Plus Jakarta Sans` or `Inter` for clean, high-readability interfaces.
* **Elevation & Borders**: Subtle hairlines (`rgba(180, 189, 208, 0.15)`), soft drop-shadows (`box-shadow: 0 8px 30px rgba(0,0,0,0.06)`), and 8px–16px border-radii.

---

## 4. Functional Specifications

### 4.1 Public Web Portal

#### 4.1.1 Header & Utility Bar (Mirroring TRS Property Mall)
* **Top Utility Bar**:
  * Left: Office address ("Shop 14, Shyama Prasad Mukherjee Complex, Nanakheda, Ujjain") + "4.9★ Rated (43+ Reviews)".
  * Right: Direct Call button ("+91 91116 55111" / office line) + "Contact Us" link.
* **Main Navigation Bar**:
  * Logo: "Shri Manibhadra Real Estate Brokers" with luxury crest icon.
  * Links: `Properties`, `Services`, `All-Properties Map`, `About Us`, `EMI Calculator`, `Contact`.
  * Actions:
    * `Sign In` button (triggers Login modal).
    * `Post Property Free` button (triggers listing submission modal).

#### 4.1.2 Hero Section
* **Visuals**: Luxury architectural image/video backdrop with deep navy gradient overlay (`rgba(16, 38, 66, 0.85)`).
* **Badge**: "Fresh Verified Properties & Best Deals in Ujjain".
* **Headline**: "One Stop Solution For All Property Needs." (with italicized gold accent).
* **Subheadline**: "Buy, sell, and invest in verified residential, commercial, luxury, and land properties across Ujjain."
* **Dual Tab Switcher**:
  * Tab 1: `Buy Property`
  * Tab 2: `Sell Property`
* **Integrated Search Bar**:
  * Locality Dropdown: All Localities, Nanakheda, Malipura, Jawahar Nagar, Freeganj, Indore-Ujjain Road, Dewas Road, etc.
  * Property Type: All Types, Residential Flat, Luxury Villa, Commercial Shop, Office Space, Residential Plot, Agricultural Land.
  * Keyword input: Search by project, colony, or landmark.
  * `Search` CTA button.
* **Live Social Proof Counters**:
  * `3,000+` Properties Handled | `100+` Developers & Colonies | `1,000+` Satisfied Clients.

#### 4.1.3 Featured Properties Showcase
* Filterable cards: `All`, `Residential`, `Commercial`, `Plots & Land`, `Luxury`.
* Card Attributes:
  * High-res imagery with zoom hover effect.
  * Badges: `For Sale` / `For Rent` + `Featured` (Gold).
  * Locality with Map Pin icon.
  * Title, Specs (BHK, Sq.Ft. Area, Property Type).
  * Price formatted in standard Indian currency (`₹ Lakhs` or `₹ Crores`) + rate per sq.ft.
  * Primary Action: **WhatsApp "Enquire"** button triggering WhatsApp chat with pre-populated message:
    `"Hi, I'm interested in [Property Title] in [Locality], Ujjain. Can you share more details?"`

---

### 4.2 Single Interactive All-Properties Map

```
+-------------------------------------------------------------------------+
|  EXPLORE ALL PROPERTIES ON MAP                                          |
|  [All (18)]  [Residential (8)]  [Commercial (4)]  [Plots/Land (6)]      |
+-------------------------------------------------------------------------+
|                                                                         |
|         [Pin: Nanakheda Shop]           [Pin: Jawahar Nagar Villa]      |
|                                                                         |
|                    * POPUP ON CLICK *                                   |
|                    +------------------------------+                     |
|                    | [Image] Emerald Horizon      |                     |
|                    | Nanakheda, Ujjain            |                     |
|                    | 3 BHK Flat | 2,400 sq.ft     |                     |
|                    | ₹1.45 Cr                     |                     |
|                    | [WhatsApp Enquire]  [View]   |                     |
|                    +------------------------------+                     |
|                                                                         |
|  [Pin: Dewas Rd Land]               [Pin: Freeganj Office]              |
|                                                                         |
+-------------------------------------------------------------------------+
```

* **Core Requirement**: A single unified interactive map embedding **all properties** in the system.
* **Pin Dropping**: Every active property is rendered at its exact latitude and longitude with a custom luxury gold/navy marker.
* **Interactive Popup**:
  * Property thumbnail image.
  * Property title, type, and locality.
  * Price and area in sq.ft.
  * "Chat on WhatsApp" button & "View Details" button.
* **Dynamic Map Filters**: Top pill-buttons to instantly filter map pins by category (`All`, `Residential`, `Commercial`, `Plots & Land`).
* **Auto-Sync**: Whenever the admin adds a property with GPS coordinates in the Admin Panel, it immediately appears on this map without a code deploy.

---

### 4.3 Complete 19-Service Architecture

All 19 services offered by Shri Manibhadra Real Estate Brokers are organized into 4 structured categories:

| Category | Services Included | Value Proposition |
| :--- | :--- | :--- |
| **1. Residential & Luxury Living** | • Home buying and sales<br>• Luxury properties<br>• Luxury property buying and sales<br>• New construction services<br>• Property rental assistance | Tailored living solutions from affordable family homes to premium gated-community villas and modern duplexes. |
| **2. Commercial & Development** | • Commercial property buying and sales<br>• Commercial property consulting<br>• Property development<br>• Property development consulting | High-yield retail shops, office complexes, and development advisory for builders and business investors. |
| **3. Plots, Land & Agriculture** | • Purchase and sell plots land<br>• Land buying and sales | Verified NA (Non-Agricultural) plots, colony plots, highway-facing land, and farmhouse parcels in Ujjain. |
| **4. Advisory, Valuation & Representation** | • Property Consultant<br>• Comparative property market analysis (CMA)<br>• Property investing<br>• Buying agent services<br>• Seller's agent services<br>• International property buying and sales<br>• Property sales | Expert end-to-end representation, market price benchmarking, RERA compliance, title search, and NRI/international advisory. |

---

### 4.4 Interactive Financial Tools & Lead Capture

#### 4.4.1 Interactive EMI / Mortgage Calculator
* **Inputs**:
  * Property Price / Loan Amount (Slider: ₹5 L to ₹5 Cr)
  * Interest Rate (Slider: 6.5% to 15%)
  * Loan Tenure (Slider: 1 to 30 Years)
* **Real-time Outputs**:
  * Monthly EMI (₹)
  * Principal Amount vs Total Interest Payable breakdown
  * Visual donut chart representation of Principal vs Interest
  * "Apply for Pre-Approved Home Loan Assistance" CTA

#### 4.4.2 Lead Capture Engine
* **Modal / Inline Form**: Name, Phone Number, Email, Service / Property of Interest, Preferred Callback Time, Notes.
* **Lead Handling**:
  1. Lead saved to `data/inquiries.json` (accessible in Admin Panel).
  2. Instant redirection or WhatsApp deep-link generation.
  3. Real-time counter increment in Analytics.

---

### 4.5 Authentication System & Role-Based Access Control (RBAC)

* **Endpoints**:
  * `POST /api/auth/login`: Authenticates credentials and returns a signed JSON Web Token (JWT).
  * `POST /api/auth/logout`: Clears session.
  * `GET /api/auth/me`: Verifies active session token.
* **Roles**:
  * `admin`: Complete read/write/delete access to Admin Dashboard, Properties CRUD, Analytics, and Inquiries.
  * `client / user`: Public browsing, property bookmarking, and property submission for admin review.
* **Security Standards**:
  * Passwords hashed using `bcryptjs` (salt rounds: 10).
  * JWT expiration set to 24 hours with auto-logout.
  * Protected API routes check `Authorization: Bearer <token>`.

---

### 4.6 Admin Panel & Business Analytics Dashboard

```
+-----------------------------------------------------------------------------------+
| SHRI MANIBHADRA ADMIN PORTAL                     [Admin Profile]  [Logout]        |
+-------------------+---------------------------------------------------------------+
| [Analytics]       | METRIC CARDS                                                  |
| [Properties CRUD] | +---------------+ +---------------+ +---------------+ +-----+ |
| [Leads/Inquiries] | | Active Props  | | Total Leads   | | Total Views   | | ... | |
| [Settings]        | |     24        | |      68       | |    3,420      | |     | |
|                   | +---------------+ +---------------+ +---------------+ +-----+ |
|                   |                                                               |
|                   | CHARTS & VISUAL ANALYTICS                                     |
|                   | [ Views Trend Over Last 30 Days (Line Chart) ]                |
|                   | [ Inquiries by Category (Doughnut Chart)     ]                |
|                   |                                                               |
|                   | RECENT LEADS & INQUIRIES                                      |
|                   | Name        Phone          Property           Date     Action |
|                   | Rahul S.    98260XXXXX     Emerald Horizon    Today    [Chat] |
+-------------------+---------------------------------------------------------------+
```

#### 4.6.1 Analytics Metrics
* **Total Active Listings**: Count of live properties.
* **Total Inquiries / Leads**: Total leads captured.
* **Total Property Views**: Aggregated page and property card view count.
* **Conversion Rate**: Percentage of property views that turned into WhatsApp/Form inquiries.
* **Category Breakdown**: Distribution across Residential, Commercial, Plots, and Land.
* **Views Trend Chart**: Daily views over the past 7/30 days.

#### 4.6.2 Property Management Engine (CRUD)
The client can self-manage all property listings directly from the dashboard:
1. **Create Listing (`POST /api/properties`)**:
   * Title, Category (Residential, Commercial, Plots/Land, Luxury), Type (Flat, Villa, Shop, Plot, etc.).
   * Price (numeric value + display unit: Lakhs / Crores).
   * Area (sq.ft / bigha / sq.yards).
   * Bedrooms & Bathrooms (for residential).
   * Location / Locality (e.g. Nanakheda, Freeganj, Indore-Ujjain Road).
   * **Map Coordinates**: Latitude & Longitude with a click-to-pick map locator.
   * Image URL / Multi-image photo paths.
   * Amenities checkboxes (Parking, 24x7 Water, Security, Power Backup, Garden, etc.).
   * Status: `Active`, `Under Offer`, `Sold`.
   * `Featured Property` toggle.
2. **Read / List Listings (`GET /api/properties`)**:
   * Searchable, filterable data table with thumbnails, price, status badges, and view counts.
3. **Update Listing (`PUT /api/properties/:id`)**:
   * Pre-populated edit modal allowing changes to any property attribute.
4. **Delete Listing (`DELETE /api/properties/:id`)**:
   * Deletes listing with confirmation dialog and immediately updates the live site and map.

#### 4.6.3 Leads & Inquiries CRM
* Table listing all captured leads:
  * Client Name, Phone Number, Email, Property of Interest, Source (Form or WhatsApp click), Timestamp.
  * Direct action buttons: **One-Click WhatsApp Reply** (`https://wa.me/91...`) and **One-Click Phone Call**.
  * Status tagging: `New`, `Contacted`, `Follow-up`, `Closed`.

---

## 5. Technical Architecture & Data Schemas

### 5.1 Architecture Overview
* **Backend**: Node.js + Express.js REST API server.
* **Database**: Lightweight, file-persisted JSON database engine (`data/properties.json`, `data/users.json`, `data/inquiries.json`, `data/analytics.json`), providing instant zero-config persistence on Windows with no native compilation dependencies.
* **Frontend**: Responsive HTML5 + CSS3 (TRS design system) + Vanilla ES6 JavaScript + Leaflet.js / Google Maps API + Chart.js for admin analytics.
* **Icons**: Lucide Icons CDN.

### 5.2 Data Schemas

#### Property Schema (`data/properties.json`)
```json
{
  "id": "prop-ujj-001",
  "title": "Emerald Horizon Luxury 3 BHK",
  "slug": "emerald-horizon-nanakheda",
  "category": "residential",
  "type": "Flat",
  "price": 14500000,
  "priceDisplay": "₹1.45 Cr",
  "pricePerSqft": "₹6,041/sq.ft",
  "areaSqft": 2400,
  "bedrooms": 3,
  "bathrooms": 3,
  "locality": "Nanakheda, Ujjain",
  "address": "Near Shyama Prasad Mukherjee Complex, Nanakheda, Ujjain",
  "coordinates": {
    "lat": 23.1678,
    "lng": 75.7892
  },
  "images": [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
  ],
  "description": "Premium 3 BHK modern apartment in the heart of Nanakheda with 24x7 security, reserved parking, and clubhouse amenities.",
  "amenities": ["Covered Parking", "24/7 Security", "Power Backup", "Garden", "Elevator"],
  "status": "active",
  "isFeatured": true,
  "views": 284,
  "createdAt": "2026-09-01T10:00:00.000Z"
}
```

#### User / Admin Schema (`data/users.json`)
```json
{
  "id": "usr-admin-01",
  "name": "Shri Manibhadra Admin",
  "email": "admin@manibhadrarealestate.com",
  "passwordHash": "$2a$10$...",
  "role": "admin",
  "createdAt": "2026-09-19T00:00:00.000Z"
}
```

#### Inquiry Schema (`data/inquiries.json`)
```json
{
  "id": "inq-20260919-01",
  "name": "Rajesh Sharma",
  "phone": "+91 98260 12345",
  "email": "rajesh.sharma@example.com",
  "propertyId": "prop-ujj-001",
  "propertyTitle": "Emerald Horizon Luxury 3 BHK",
  "message": "Interested in site visit this Sunday.",
  "status": "new",
  "timestamp": "2026-09-19T11:45:00.000Z"
}
```

#### Analytics Schema (`data/analytics.json`)
```json
{
  "totalViews": 3420,
  "totalInquiries": 68,
  "dailyViews": [
    {"date": "2026-09-15", "views": 110},
    {"date": "2026-09-16", "views": 145},
    {"date": "2026-09-17", "views": 132},
    {"date": "2026-09-18", "views": 160},
    {"date": "2026-09-19", "views": 185}
  ],
  "categoryViews": {
    "residential": 1840,
    "commercial": 620,
    "plots": 780,
    "luxury": 180
  }
}
```

---

## 6. Non-Functional Requirements

### 6.1 Performance & Speed
* **First Contentful Paint (FCP)**: < 1.2 seconds.
* **Total Blocking Time (TBT)**: < 150 ms.
* **Lighthouse Performance Score**: > 90 on mobile and desktop.

### 6.2 Mobile Responsiveness
* 100% responsive fluid grid down to 320px screen width.
* Native-like mobile drawer navigation menu.
* Touch-optimized map pan and zoom gestures.

### 6.3 Security
* JWT token authentication for administrative routes.
* Sanitization of all form inputs to prevent XSS and injection attacks.
* Rate limiting on authentication attempts.

### 6.4 SEO & Local Search Optimization
* Structured data schema: `LocalBusiness`, `RealEstateAgent`, `OfferCatalog`, and `BreadcrumbList`.
* Local keywords: *"real estate developers in ujjain"*, *"property consultants nanakheda"*, *"plots for sale ujjain"*, *"commercial shops malipura"*.
* OpenGraph & Twitter Card tags for rich previews on social sharing.

---

## 7. Implementation Deliverables & Verification Checklist

| Deliverable | Description | Verification Criteria |
| :--- | :--- | :--- |
| **Backend Server (`server.js`)** | Express REST server with Auth, Properties, Inquiries, and Analytics endpoints. | All CRUD routes respond with standard JSON status codes and persist data. |
| **Public Homepage (`index.html`)** | Pixel-faithful implementation of TRS Property Mall layout, colors, typography, hero search, and featured cards. | Matches TRS color palette (`#0B192C`, `#C9A24B`), smooth animations, working tabs. |
| **All-Properties Map (`map.js`)** | Single interactive map rendering all active properties with custom pins and popups. | Pins appear at correct coordinates; clicking pin shows property card with WhatsApp link. |
| **Admin Dashboard (`admin.html`)** | Secure portal with KPI metric cards, Chart.js visual analytics, Property CRUD manager, and inquiries list. | Admin logs in, creates property, sees updated charts, and edits existing properties. |
| **19-Services Catalog** | Dedicated categorized section displaying all 19 real estate services. | All 19 services listed with descriptions and icons. |
| **EMI Calculator** | Real-time mortgage loan payment calculator. | Interactive sliders recalculate monthly installment and interest distribution dynamically. |

---

*End of Product Requirements Document (PRD)*
