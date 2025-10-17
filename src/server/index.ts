import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { PortalSDK, Currency, SinglePaymentRequestContent, InvoiceStatus } from 'portal-sdk';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Portal SDK configuration
const PORTAL_SERVER_URL = process.env.PORTAL_SERVER_URL || 'ws://localhost:3000/ws';
const PORTAL_AUTH_TOKEN = process.env.PORTAL_AUTH_TOKEN || 'remember-to-change-this';
const NOSTR_KEY = 'nsec1d5kdlzs3hrc6ydtj3xqu969d3cjwu22cvtauk8g9dx3e3my7lvtqhljvka';
const NOSTR_RELAY = 'wss://nos.lol';

let portalClient: PortalSDK | null = null;

// Store for active authentication sessions
const authSessions = new Map<string, {
  url: string;
  streamId: string;
  pubkey?: string;
  profile?: any;
  authenticated: boolean;
}>();

// Store for payment sessions
const paymentSessions = new Map<string, {
  orderId: string;
  amount: number;
  status: string;
  streamId?: string;
}>();

// Initialize Portal SDK connection
async function initPortalSDK() {
  // Temporarily run in mock mode for testing
  console.log('Running in mock mode for development');
  return null;

  // TODO: Re-enable Portal SDK connection once auth issue is resolved
  // try {
  //   console.log('Attempting to connect to Portal SDK at:', PORTAL_SERVER_URL);
  //   portalClient = new PortalSDK({
  //     serverUrl: PORTAL_SERVER_URL,
  //     connectTimeout: 10000,
  //   });

  //   await portalClient.connect();
  //   console.log('Connected to Portal SDK daemon');

  //   // Try authentication but don't fail if it doesn't work
  //   try {
  //     await portalClient.authenticate(PORTAL_AUTH_TOKEN);
  //     console.log('Authenticated with Portal SDK');
  //   } catch (authError) {
  //     console.warn('Authentication warning:', authError);
  //     console.log('Continuing without authentication - some features may be limited');
  //   }

  //   return portalClient;
  // } catch (error) {
  //   console.error('Failed to initialize Portal SDK:', error);
  //   console.log('Server will run in mock mode');
  //   // Return null to allow the server to start even if Portal SDK is not available
  //   return null;
  // }
}

// Auth endpoints
app.post('/api/auth/generate-url', async (req, res) => {
  try {
    const { tableNumber } = req.body;

    if (!portalClient) {
      // Fallback for development when Portal SDK is not available
      const mockStreamId = `mock-${Date.now()}`;
      const mockUrl = `nostr:auth?table=${tableNumber}&session=${mockStreamId}`;

      authSessions.set(mockStreamId, {
        url: mockUrl,
        streamId: mockStreamId,
        authenticated: false,
      });

      // Simulate authentication after 5 seconds for testing
      setTimeout(() => {
        const session = authSessions.get(mockStreamId);
        if (session) {
          session.authenticated = true;
          session.pubkey = 'mock-pubkey-' + Date.now();
          session.profile = { name: 'Test User' };
        }
      }, 5000);

      return res.json({ url: mockUrl, streamId: mockStreamId });
    }

    const streamId = `auth-${Date.now()}`;

    const url = await portalClient.newKeyHandshakeUrl(
      (mainKey, preferredRelays) => {
        console.log('Key handshake received:', mainKey);
        const session = authSessions.get(streamId);
        if (session) {
          session.pubkey = mainKey;
          session.authenticated = true;

          // Fetch profile
          portalClient?.fetchProfile(mainKey).then(profile => {
            if (session && profile) {
              session.profile = profile;
            }
          });
        }
      },
      null,
      false
    );

    authSessions.set(streamId, {
      url,
      streamId,
      authenticated: false,
    });

    res.json({ url, streamId });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate authentication URL' });
  }
});

app.get('/api/auth/status/:streamId', (req, res) => {
  const { streamId } = req.params;
  const session = authSessions.get(streamId);

  if (!session) {
    return res.status(404).json({ error: 'Session not found' });
  }

  res.json({
    authenticated: session.authenticated,
    pubkey: session.pubkey,
    profile: session.profile,
  });
});

// Payment endpoints
app.post('/api/payment/request', async (req, res) => {
  try {
    const { orderId, amount, pubkey, description } = req.body;

    if (!portalClient) {
      // Mock payment for development
      const mockStreamId = `payment-${Date.now()}`;
      paymentSessions.set(mockStreamId, {
        orderId,
        amount,
        status: 'pending',
        streamId: mockStreamId,
      });

      // Simulate successful payment after 3 seconds
      setTimeout(() => {
        const session = paymentSessions.get(mockStreamId);
        if (session) {
          session.status = 'paid';
        }
      }, 3000);

      return res.json({ streamId: mockStreamId });
    }

    const paymentRequest: SinglePaymentRequestContent = {
      amount,
      currency: Currency.Millisats,
      description,
    };

    const streamId = `payment-${Date.now()}`;

    paymentSessions.set(streamId, {
      orderId,
      amount,
      status: 'pending',
      streamId,
    });

    await portalClient.requestSinglePayment(
      pubkey,
      [],
      paymentRequest,
      (status: InvoiceStatus) => {
        console.log('Payment status update:', status);
        const session = paymentSessions.get(streamId);
        if (session) {
          session.status = status.status;

          // Notify frontend via websocket
          io.emit(`payment-${streamId}`, { status: status.status });
        }
      }
    );

    res.json({ streamId });
  } catch (error) {
    console.error('Error requesting payment:', error);
    res.status(500).json({ error: 'Failed to request payment' });
  }
});

app.get('/api/payment/status/:streamId', (req, res) => {
  const { streamId } = req.params;
  const session = paymentSessions.get(streamId);

  if (!session) {
    return res.status(404).json({ error: 'Payment session not found' });
  }

  res.json({ status: session.status });
});

// Order endpoints
app.post('/api/orders', (req, res) => {
  const order = req.body;
  console.log('New order received:', order);

  // In a real app, save to database
  // For now, just acknowledge receipt
  res.json({ success: true, orderId: order.id });
});

// WebSocket connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 8080;

// Start server immediately, initialize Portal SDK in background
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Initializing Portal SDK connection...');

  initPortalSDK().then(() => {
    if (!portalClient) {
      console.log('⚠️  Running in mock mode - Portal SDK not connected');
      console.log('To use real Portal SDK, ensure the daemon is running:');
      console.log('docker run --rm -d -p 3000:3000 -e NOSTR_KEY=' + NOSTR_KEY + ' -e NOSTR_RELAYS=' + NOSTR_RELAY + ' getportal/sdk-daemon:latest');
    } else {
      console.log('✅ Portal SDK connected and ready');
    }
  });
});