# Restaurant Portal - Table Management & Payment System

A modern restaurant ordering system built with Portal SDK, enabling customers to authenticate via Nostr, browse menus, place orders, and pay using Lightning Network.

## Features

- 🔐 **Nostr Authentication**: QR code-based authentication using Nostr wallets
- 🍽️ **Digital Menu**: Browse categorized menu items (appetizers, mains, desserts, beverages)
- 🛒 **Order Management**: Add items to cart, modify quantities, submit orders
- 💳 **Lightning Payments**: Pay instantly using Lightning Network through Portal SDK
- 🪑 **Table Management**: Table selection and tracking for dine-in customers
- 📱 **Responsive Design**: Works seamlessly on mobile and desktop devices

## Prerequisites

- Node.js (v18 or higher)
- npm
- Docker (for running Portal SDK daemon)

## Setup Instructions

### 1. Run Portal SDK Backend with Docker

The Portal SDK daemon needs to be running for authentication and payments to work:

```bash
docker run --rm --name portal-sdk-daemon -d \
  -p 3000:3000 \
  -e NOSTR_KEY=nsec1d5kdlzs3hrc6ydtj3xqu969d3cjwu22cvtauk8g9dx3e3my7lvtqhljvka \
  -e NOSTR_RELAYS=wss://nos.lol \
  getportal/sdk-daemon:latest
```

This will:
- Start the Portal SDK daemon on port 3000
- Configure it with the provided Nostr private key
- Connect to the specified Nostr relay (wss://nos.lol)

To verify it's running:
```bash
docker ps | grep portal-sdk-daemon
```

To view logs:
```bash
docker logs portal-sdk-daemon
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Application

You'll need to run both the backend server and frontend development server:

**Terminal 1 - Start the Backend Server:**
```bash
npm run server
```
This starts the Express server on port 8080 that handles:
- Portal SDK integration
- Authentication flow
- Payment processing
- Order management

**Terminal 2 - Start the Frontend:**
```bash
npm run dev
```
This starts the Vite development server on port 5173.

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## How It Works

### Customer Flow

1. **Table Selection**: Customer selects their table number
2. **Authentication**: Scan QR code with Nostr wallet to authenticate
3. **Browse Menu**: View menu items organized by category
4. **Build Order**: Add items to cart, adjust quantities
5. **Submit Order**: Review and submit order for preparation
6. **Payment**: Pay using Lightning Network through your Nostr wallet
7. **Order Status**: Track order status in real-time

### Technical Architecture

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: Express.js + Socket.io
- **Authentication**: Portal SDK with Nostr protocol
- **Payments**: Lightning Network via Portal SDK
- **State Management**: Zustand

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Authentication components
│   ├── Menu/           # Menu display components
│   ├── Order/          # Order management components
│   └── Payment/        # Payment processing components
├── data/               # Static data (menu items)
├── pages/              # Page components
├── server/             # Backend Express server
├── store/              # Zustand state management
├── styles/             # CSS styles
└── types/              # TypeScript type definitions
```

## Environment Variables

The application uses the following environment variables (configured in `.env`):

- `PORTAL_SERVER_URL`: Portal SDK daemon WebSocket URL (default: ws://localhost:3000/ws)
- `PORTAL_AUTH_TOKEN`: Authentication token for Portal SDK (default: remember-to-change-this)
- `PORT`: Backend server port (default: 8080)

## Development Mode Features

When Portal SDK is not available, the application runs in mock mode:
- Authentication simulates success after 5 seconds
- Payments simulate success after 3 seconds
- This allows for frontend development without the Portal SDK daemon

## Available Scripts

- `npm run dev` - Start frontend development server
- `npm run server` - Start backend server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Troubleshooting

### Portal SDK Connection Issues
If you see "Running in mock mode - Portal SDK not connected":
1. Ensure Docker is running
2. Check if the Portal SDK container is active: `docker ps`
3. Restart the container if needed: `docker restart portal-sdk-daemon`

### Authentication Not Working
- Ensure you have a Nostr wallet app installed
- Check that the Portal SDK daemon is running
- Verify the NOSTR_KEY and NOSTR_RELAYS are correctly configured

### Payment Issues
- Ensure your Nostr wallet has Lightning Network support
- Check that you have sufficient balance
- Verify the Portal SDK daemon logs: `docker logs portal-sdk-daemon`

## Security Notes

- The provided nsec key is for demonstration purposes only
- In production, use a secure key and never expose it
- Always use HTTPS in production environments
- Implement proper authentication and authorization

## License

This project is built using the Portal SDK. Refer to the Portal SDK documentation for licensing information.