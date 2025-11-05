# Zerodha Stock Market Dashboard

A full-stack stock trading application with buy/sell functionality and real-time holdings updates.

## Features

- ✅ **Buy/Sell Trading**: Execute buy and sell orders with real-time holdings updates
- ✅ **Holdings Management**: View current holdings with P&L calculations
- ✅ **Funds Management**: Add funds, withdraw money, and manage account balance
- ✅ **Account Creation**: Create commodity accounts and manage multiple account types
- ✅ **Real-time Updates**: Holdings and funds automatically update after operations
- ✅ **Responsive UI**: Modern, clean interface with modal dialogs for operations
- ✅ **Data Persistence**: MongoDB integration for storing trades, holdings, and funds

## Project Structure

```
Zerodha_stocksMarket/
├── backend/                 # Node.js/Express API
│   ├── controller/         # Trade controller
│   ├── model/             # MongoDB models
│   ├── schemas/           # Mongoose schemas
│   ├── Routes/            # API routes
│   ├── index.js           # Main server file
│   └── seedHoldings.js    # Database seeding script
└── dashboard/             # React frontend
    ├── src/
    │   ├── components/    # React components
    │   └── data/         # Sample data
    └── public/
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory:
   ```env
   MONGO_URL=mongodb://localhost:27017/zerodha_trading
   PORT=3002
   ```

4. **Start the backend server:**
   ```bash
   npm start
   ```
   
   The server will automatically seed the database with sample data on first run.

   The backend will run on `http://localhost:3002`

### Frontend Setup

1. **Navigate to dashboard directory:**
   ```bash
   cd dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the React development server:**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## How to Use

### Trading Operations

1. **Buy Stocks:**
   - Click on any stock in the watchlist
   - Enter quantity and price
   - Click "Buy" button
   - Holdings will automatically update

2. **Sell Stocks:**
   - Click on any stock in the watchlist
   - Enter quantity and price
   - Click "Sell" button
   - Holdings will automatically update

3. **View Holdings:**
   - Navigate to Holdings section
   - View current portfolio with P&L
   - See real-time calculations

4. **Manage Funds:**
   - Click "Add funds" to add money to your account
   - Click "Withdraw" to withdraw money from your account
   - View real-time balance updates
   - Create commodity accounts

### API Endpoints

- `GET /allHoldings` - Get all holdings
- `POST /newTrade` - Execute a new trade (buy/sell)
- `GET /allPositions` - Get all positions
- `GET /allOrders` - Get all orders
- `GET /funds` - Get current funds status
- `POST /funds/add` - Add funds to account
- `POST /funds/withdraw` - Withdraw funds from account
- `POST /funds/create-account` - Create new account type

## Key Features Fixed

### Backend Improvements
- ✅ Fixed trade schema to match frontend data structure
- ✅ Updated holdings schema with proper fields
- ✅ Implemented automatic holdings updates via middleware
- ✅ Added proper error handling and logging
- ✅ Created database seeding script

### Frontend Improvements
- ✅ Updated buy/sell window with both buy and sell buttons
- ✅ Fixed API endpoint calls
- ✅ Added loading states and error handling
- ✅ Improved holdings display with real-time calculations
- ✅ Added proper form validation

### Database Integration
- ✅ Automatic holdings updates when trades are executed
- ✅ Proper average price calculations for buy orders
- ✅ Holdings deletion when quantity reaches zero
- ✅ Real-time P&L calculations

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error:**
   - Ensure MongoDB is running
   - Check MONGO_URL in .env file
   - Verify database permissions

2. **CORS Errors:**
   - Backend is configured to allow all origins
   - Check if backend is running on port 3002

3. **Holdings Not Updating:**
   - Check browser console for errors
   - Verify backend logs for trade processing
   - Ensure database connection is stable

4. **Funds 404 Error:**
   - Make sure backend server is running
   - Run `node seedFunds.js` to create initial funds data
   - Check if funds routes are properly configured

5. **Funds Null Error:**
   - Refresh the page to reload funds data
   - Check browser console for API errors
   - Ensure funds database is seeded

### Quick Fix Commands

```bash
# All functionality is now in index.js
# Just restart the server:
cd backend
npm start
```

### Development Tips

- Check browser console for frontend errors
- Monitor backend logs for trade processing
- Use MongoDB Compass to verify data changes
- Test with different stock names and quantities

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- CORS
- Body-parser

### Frontend
- React
- Axios
- CSS3
- Chart.js (for graphs)

## Future Enhancements

- [ ] Real-time stock price updates
- [ ] User authentication
- [ ] Order history tracking
- [ ] Advanced charting
- [ ] Portfolio analytics
- [ ] Mobile responsiveness improvements
