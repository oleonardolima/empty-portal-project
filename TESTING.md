# Testing the Restaurant Portal Application

## Current Setup Status

✅ **Portal SDK Daemon**: Running in Docker on port 3000
✅ **Backend Server**: Running on port 8080 (in mock mode)
✅ **Frontend**: Available on port 5173

## How to Test the Application

### 1. Access the Application
Open your browser and go to: http://localhost:5173

### 2. Authentication Flow
- Select a table number (1-12)
- A QR code will be generated for Nostr authentication
- In mock mode, authentication completes automatically after 5 seconds
- You'll be redirected to the menu page

### 3. Ordering Process
- Browse menu items by category (Appetizers, Mains, Desserts, Beverages)
- Click "Add to Order" to add items to your cart
- Adjust quantities in the order summary on the right
- Click "Submit Order" to proceed to checkout

### 4. Payment
- Review your order in the checkout page
- Click "Pay with Lightning" to initiate payment
- In mock mode, payment completes automatically after 3 seconds
- You'll see a success message and be redirected

## API Endpoints (for testing)

### Generate Auth URL
```bash
curl -X POST http://localhost:8080/api/auth/generate-url \
  -H "Content-Type: application/json" \
  -d '{"tableNumber": 5}'
```

### Check Auth Status
```bash
curl http://localhost:8080/api/auth/status/{streamId}
```

### Submit Order
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "id": "order-123",
    "tableNumber": 5,
    "items": [],
    "totalAmount": 50000
  }'
```

### Request Payment
```bash
curl -X POST http://localhost:8080/api/payment/request \
  -H "Content-Type: application/json" \
  -d '{
    "orderId": "order-123",
    "amount": 50000,
    "pubkey": "mock-pubkey",
    "description": "Restaurant Order"
  }'
```

## Mock Mode Behavior

Since we're running in mock mode:
- **Authentication**: Simulates success after 5 seconds
- **Payments**: Simulates success after 3 seconds
- **User Profile**: Returns "Test User" as the name

## Switching to Real Portal SDK

To use the actual Portal SDK with real Nostr authentication and Lightning payments:

1. Ensure the Portal SDK daemon is running with proper configuration
2. Update `/src/server/index.ts` to re-enable Portal SDK connection (uncomment the code)
3. Restart the backend server

## Current Known Issues

- Portal SDK authentication token validation is not working with the default configuration
- The WebSocket connection closes immediately after auth attempt
- Running in mock mode as a workaround for development and testing