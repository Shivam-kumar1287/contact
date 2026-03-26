const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api', limiter);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // List of allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'http://localhost:3000',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// In-memory storage for demo
let users = [];
let contacts = [];
let userIdCounter = 1;
let contactIdCounter = 1;

// JWT Secret (use a real secret in production)
const JWT_SECRET = process.env.JWT_SECRET || 'demo_jwt_secret_key_for_testing_only';

// Helper functions
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

const hashPassword = async (password) => {
  return await bcrypt.hash(password, 12);
};

const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Authentication Middleware
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired.'
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Server error during authentication.'
      });
    }
  }
};

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    if (!email || email.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email.toLowerCase());
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    // Create user
    const hashedPassword = await hashPassword(password);
    const user = {
      id: userIdCounter++,
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(user);

    // Generate token
    const token = generateToken(user.id);

    // Remove password from output
    const { password: _, ...userWithoutPassword } = user;

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || email.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    // Find user
    const user = users.find(u => u.email === email.toLowerCase());

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user.id);

    // Remove password from output
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
});

app.get('/api/auth/me', protect, (req, res) => {
  const { password: _, ...userWithoutPassword } = req.user;
  res.status(200).json({
    success: true,
    data: userWithoutPassword
  });
});

// Contact Routes (all protected)
app.use('/api/contacts', protect);

app.get('/api/contacts', (req, res) => {
  const userContacts = contacts.filter(c => c.user === req.user.id);
  res.status(200).json({
    success: true,
    count: userContacts.length,
    data: userContacts
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

  const userContacts = contacts.filter(c => c.user === req.user.id);
  const results = userContacts.filter(contact =>
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

app.post('/api/contacts', (req, res) => {
  const { name, email, phone, address, notes } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }

  // Check for duplicate email for this user
  if (email) {
    const existingContact = contacts.find(c => 
      c.email === email.toLowerCase() && 
      c.user === req.user.id
    );
    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'A contact with this email already exists'
      });
    }
  }

  const contact = {
    _id: contactIdCounter++,
    name: name.trim(),
    email: email ? email.trim().toLowerCase() : undefined,
    phone: phone ? phone.trim() : undefined,
    address: address ? address.trim() : undefined,
    notes: notes ? notes.trim() : undefined,
    user: req.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  contacts.push(contact);

  res.status(201).json({
    success: true,
    data: contact
  });
});

app.get('/api/contacts/:id', (req, res) => {
  const contact = contacts.find(c => c._id === parseInt(req.params.id) && c.user === req.user.id);

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

app.put('/api/contacts/:id', (req, res) => {
  const { name, email, phone, address, notes } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }

  const contactIndex = contacts.findIndex(c => 
    c._id === parseInt(req.params.id) && 
    c.user === req.user.id
  );

  if (contactIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  // Check for duplicate email for this user (excluding current contact)
  if (email) {
    const existingContact = contacts.find(c => 
      c.email === email.toLowerCase() && 
      c.user === req.user.id &&
      c._id !== parseInt(req.params.id)
    );
    
    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'A contact with this email already exists'
      });
    }
  }

  contacts[contactIndex] = {
    ...contacts[contactIndex],
    name: name.trim(),
    email: email ? email.trim().toLowerCase() : undefined,
    phone: phone ? phone.trim() : undefined,
    address: address ? address.trim() : undefined,
    notes: notes ? notes.trim() : undefined,
    updatedAt: new Date().toISOString()
  };

  res.status(200).json({
    success: true,
    data: contacts[contactIndex]
  });
});

app.delete('/api/contacts/:id', (req, res) => {
  const contactIndex = contacts.findIndex(c => 
    c._id === parseInt(req.params.id) && 
    c.user === req.user.id
  );

  if (contactIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Contact not found'
    });
  }

  contacts.splice(contactIndex, 1);

  res.status(200).json({
    success: true,
    message: 'Contact deleted successfully'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Secure Contact Manager API is running (Demo Mode)',
    timestamp: new Date().toISOString(),
    mode: 'demo-with-auth',
    users: users.length,
    contacts: contacts.length
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
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

const PORT = process.env.PORT || 5000;

// For Vercel serverless deployment
module.exports = app;

// For local development
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🔐 Secure Contact Manager API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`📱 Frontend should be running on: http://localhost:5173`);
    console.log(`🔗 API Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Demo mode - Using in-memory storage (data will reset on restart)`);
    console.log(`🔑 Authentication enabled with JWT tokens`);
  });
}
