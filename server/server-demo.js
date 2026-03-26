const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const app = express();

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Mock data for demo
let contacts = [
  {
    _id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    address: '123 Main St, City, State',
    notes: 'Sample contact for demo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+0987654321',
    address: '456 Oak Ave, Town, State',
    notes: 'Another sample contact',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// API Routes
app.get('/api/contacts', (req, res) => {
  res.status(200).json({
    success: true,
    count: contacts.length,
    data: contacts
  });
});

app.get('/api/contacts/search', (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({
      success: false,
      message: 'Search query is required'
    });
  }

  const results = contacts.filter(contact =>
    contact.name.toLowerCase().includes(q.toLowerCase()) ||
    contact.email?.toLowerCase().includes(q.toLowerCase()) ||
    contact.phone?.includes(q)
  );

  res.status(200).json({
    success: true,
    count: results.length,
    data: results
  });
});

app.get('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(c => c._id === req.params.id);
  
  if (!contact) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  res.status(200).json({
    success: true,
    data: contact
  });
});

app.post('/api/contacts', (req, res) => {
  const { name, email, phone, address, notes } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }

  const newContact = {
    _id: Date.now().toString(),
    name: name.trim(),
    email: email ? email.trim() : undefined,
    phone: phone ? phone.trim() : undefined,
    address: address ? address.trim() : undefined,
    notes: notes ? notes.trim() : undefined,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  contacts.unshift(newContact);

  res.status(201).json({
    success: true,
    data: newContact
  });
});

app.put('/api/contacts/:id', (req, res) => {
  const index = contacts.findIndex(c => c._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  const { name, email, phone, address, notes } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }

  contacts[index] = {
    ...contacts[index],
    name: name.trim(),
    email: email ? email.trim() : undefined,
    phone: phone ? phone.trim() : undefined,
    address: address ? address.trim() : undefined,
    notes: notes ? notes.trim() : undefined,
    updatedAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    data: contacts[index]
  });
});

app.delete('/api/contacts/:id', (req, res) => {
  const index = contacts.findIndex(c => c._id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  contacts.splice(index, 1);

  res.status(200).json({
    success: true,
    message: 'Contact deleted successfully'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running (Demo Mode)',
    timestamp: new Date().toISOString(),
    mode: 'demo'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

// For Vercel serverless deployment
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Demo server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log(`📱 Frontend should be running on: http://localhost:5173`);
    console.log(`🔗 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Demo mode - Using in-memory storage (data will reset on restart)`);
  });
}
