# Contact Manager - MERN Stack Application

A complete, production-ready Contact Management Web Application built with the MERN stack (MongoDB, Express, React, Node.js). This application demonstrates modern web development practices with a clean architecture and responsive design.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Locally](#running-locally)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### Core Functionality
- ✅ **Add Contacts** - Create new contacts with detailed information
- ✅ **View Contacts** - Display all contacts in a responsive card layout
- ✅ **Search Contacts** - Real-time search by name, email, or phone
- ✅ **Update Contacts** - Edit existing contact information
- ✅ **Delete Contacts** - Remove contacts with confirmation dialog
- ✅ **Form Validation** - Client-side and server-side validation
- ✅ **Error Handling** - Comprehensive error management
- ✅ **Loading States** - Smooth loading indicators

### Technical Features
- 🎨 **Modern UI** - Clean, responsive design with TailwindCSS
- 🔍 **Search Functionality** - Instant search across multiple fields
- 📱 **Mobile Responsive** - Works perfectly on all devices
- 🚀 **Fast Performance** - Optimized React app with Vite
- 🔒 **Security** - Input validation, rate limiting, CORS protection
- 📊 **RESTful API** - Clean API design with proper HTTP methods
- 🔄 **Real-time Updates** - Instant UI updates after CRUD operations

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Beautiful toast notifications

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API rate limiting

### Development Tools
- **ESLint** - Code linting
- **Concurrently** - Run multiple scripts
- **Nodemon** - Auto-restart server

## 🏗️ Architecture

### MVC Pattern (Backend)
- **Models** - Mongoose schemas and data validation
- **Controllers** - Business logic and request handling
- **Routes** - API endpoint definitions
- **Config** - Database connection and environment setup

### Component-Based (Frontend)
- **Components** - Reusable UI components
- **Pages** - Route-level components
- **Services** - API communication layer
- **Hooks** - Custom React hooks for state management

## 📁 Project Structure

```
contact-manager-mern/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── ContactCard.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   ├── ContactList.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx
│   │   │   └── AddContact.jsx
│   │   ├── services/           # API services
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── server/                     # Express backend
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── models/
│   │   └── Contact.js         # Mongoose model
│   ├── controllers/
│   │   └── contactController.js # Business logic
│   ├── routes/
│   │   └── contactRoutes.js   # API routes
│   ├── server.js              # Express server
│   └── package.json
├── .env.example               # Environment variables template
├── .gitignore
├── vercel.json               # Vercel deployment config
├── package.json              # Root package.json
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (for cloud database)

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/contact-manager-mern.git
cd contact-manager-mern
```

### Step 2: Install Dependencies
```bash
# Install all dependencies (root, server, and client)
npm run install-all

# Or install manually:
npm install
cd server && npm install
cd ../client && npm install
```

### Step 3: Set Up Environment Variables

#### Backend Environment Variables
Create a `.env` file in the `server` directory:
```bash
cd server
cp .env.example .env
```

Update `.env` with your values:
```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/contact-manager?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

#### Frontend Environment Variables
Create a `.env` file in the `client` directory:
```bash
cd client
cp .env.example .env
```

Update `.env` with your API URL:
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## 🏃‍♂️ Running Locally

### Option 1: Run Both Frontend and Backend Together
```bash
# From the root directory
npm run dev
```
This will start both the frontend (http://localhost:5173) and backend (http://localhost:5000) servers.

### Option 2: Run Separately
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

### Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- API Health Check: http://localhost:5000/api/health

## 📡 API Endpoints

### Contacts API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/contacts` | Get all contacts |
| GET | `/api/contacts/search?q=query` | Search contacts |
| GET | `/api/contacts/:id` | Get single contact |
| POST | `/api/contacts` | Create new contact |
| PUT | `/api/contacts/:id` | Update contact |
| DELETE | `/api/contacts/:id` | Delete contact |

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

### Request/Response Format

#### Success Response
```json
{
  "success": true,
  "data": {
    "_id": "64a1b2c3d4e5f6789012345",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, State",
    "notes": "Sample notes",
    "createdAt": "2023-07-01T12:00:00.000Z",
    "updatedAt": "2023-07-01T12:00:00.000Z"
  }
}
```

#### Error Response
```json
{
  "success": false,
  "message": "Error message description"
}
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

#### Frontend Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the React app and deploy it

#### Backend Deployment (Serverless)
1. The `vercel.json` file is already configured for serverless deployment
2. Set environment variables in Vercel dashboard:
   - `MONGODB_URI`: Your MongoDB connection string
   - `NODE_ENV`: production

#### MongoDB Atlas Setup
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Add your Vercel deployment IP to the whitelist
4. Get the connection string and add it to environment variables

### Alternative Deployment Options

#### Render (Backend)
1. Connect your repository to Render
2. Set up a Web Service
3. Configure environment variables
4. Deploy

#### Netlify (Frontend)
1. Connect your repository to Netlify
2. Configure build settings:
   - Build command: `cd client && npm run build`
   - Publish directory: `client/dist`

## 📸 Screenshots

### Home Page - Contact List
*(Add screenshot here)*
![Contact List](screenshots/contact-list.png)

### Add Contact Form
*(Add screenshot here)*
![Add Contact](screenshots/add-contact.png)

### Search Results
*(Add screenshot here)*
![Search Results](screenshots/search-results.png)

### Mobile Responsive View
*(Add screenshot here)*
![Mobile View](screenshots/mobile-view.png)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Ensure all components are responsive
- Test your changes thoroughly
- Update documentation if needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

If you have any questions or need help, please:
1. Check the [FAQ](#faq) section
2. Search existing [Issues](https://github.com/your-username/contact-manager-mern/issues)
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Contact groups and categories
- [ ] Import/Export contacts (CSV, vCard)
- [ ] Advanced search and filtering
- [ ] Contact avatar/image upload
- [ ] Dark mode toggle
- [ ] Pagination for large contact lists
- [ ] Contact history/audit log
- [ ] Email integration
- [ ] Mobile app (React Native)

## 📊 Project Stats

- **Lines of Code**: ~2,000+
- **Components**: 8 React components
- **API Endpoints**: 6 RESTful endpoints
- **Database Models**: 1 Mongoose schema
- **Build Time**: ~30 seconds
- **Bundle Size**: ~200KB (gzipped)

---

**Built with ❤️ using the MERN stack**
