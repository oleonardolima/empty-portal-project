import { PortalSDK, Currency, Timestamp } from 'portal-sdk';

// Initialize the client
const client = new PortalSDK({
  serverUrl: 'ws://localhost:3000/ws',
  connectTimeout: 10000
});

async function run() {
  // Connect to the server
  await client.connect();
  
  // Authenticate with your token
  await client.authenticate('your-auth-token');
  
  // Generate authentication URL for users
  const url = await client.newKeyHandshakeUrl((mainKey) => {
    console.log('Received key handshake from:', mainKey);
  });
  
  console.log('Authentication URL:', url);
}

run();
