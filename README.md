 ## Pricify - Smart Price Intelligence Platfor
 A full-stack web application that helps shopkeepers and small retailers make smarter pricing decisions by aggregating and analyzing product prices from major e-commerce platforms like Amazon and Flipkart in real-time.

  ## What It Does

  Pricify scrapes live product prices from multiple online marketplaces, analyzes the data, and provides:

  - Real-time price comparison across Amazon and Flipkart
  - Smart price suggestions — a competitive selling price calculated using weighted averages
  - Price analytics — min, max, and average prices at a glance
  - Personal price list — save and manage products you're tracking
  - Trending products — see what others are searching for
  - User authentication — secure signup/login with JWT


  ## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **Web Scraping:** Puppeteer (Headless Chrome)  
- **Authentication:** JWT, bcryptjs  
- **Deployment:** Render  

## Local Setup

  Prerequisites

  - Node.js (v18 or higher)
  - MongoDB (local instance or MongoDB Atlas connection string)

  Steps

  1. Clone the repository
  git clone https://github.com/your-username/smart-price-intelligence-platform.git
  cd smart-price-intelligence-platform
  2. Install dependencies
  cd backend
  npm install
  3. Create environment file

  3. Create a .env file inside the backend/ directory:
  PORT=3000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_jwt_secret_key
  4. Start the server
  # Development (with auto-reload)
  npm run dev

  # Production
  npm start
  5. Open in browser

  5. Navigate to http://localhost:3000

 ##Live Demo

  The Site is live at -  https://pricify-h7hk.onrender.com
