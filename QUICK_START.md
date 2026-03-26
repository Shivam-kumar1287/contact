# 🚀 Quick Start Guide

## Current Status ✅
- ✅ All dependencies installed
- ✅ Environment variables created
- ✅ Frontend running on http://localhost:5173
- ⚠️ Backend needs MongoDB connection

## Next Steps

### 1. Set Up MongoDB Atlas (Required)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Cluster"
   - Choose "M0 Sandbox" (free tier)
   - Select a cloud provider and region
   - Leave cluster settings as default and create

3. **Get Connection String**
   - Go to Database → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - It will look like: `mongodb+srv://username:password@cluster.mongodb.net/contact-manager`

4. **Update Environment Variables**
   - Open `server/.env` file
   - Replace the MONGODB_URI with your actual connection string
   - Example: `MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/contact-manager?retryWrites=true&w=majority`

### 2. Restart the Application

```bash
# Stop the current process (Ctrl+C)
# Then restart:
npm run dev
```

### 3. Test the Application

Once MongoDB is connected:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## Alternative: Local MongoDB

If you prefer to use MongoDB locally:

1. **Install MongoDB**
   ```bash
   # Windows: Download from https://www.mongodb.com/try/download/community
   # macOS: brew install mongodb-community
   # Ubuntu: sudo apt-get install mongodb
   ```

2. **Start MongoDB Service**
   ```bash
   # Windows: Start MongoDB service from Services
   # macOS: brew services start mongodb-community
   # Ubuntu: sudo systemctl start mongod
   ```

3. **Update .env File**
   ```
   MONGODB_URI=mongodb://localhost:27017/contact-manager
   ```

## Troubleshooting

### MongoDB Connection Issues
- Ensure your IP is whitelisted in MongoDB Atlas
- Check that your username/password are correct
- Verify the database name in your connection string

### Port Already in Use
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <PID> /F
```

### Frontend Not Loading
- Check that port 5173 is available
- Clear browser cache
- Restart the development server

## Features to Test

Once running:
1. **Add Contact** - Create your first contact
2. **View Contacts** - See all contacts in card layout
3. **Search** - Test search by name, email, or phone
4. **Edit Contact** - Update existing contact information
5. **Delete Contact** - Remove contacts with confirmation

## Development Tips

- **Hot Reload**: Both frontend and backend auto-restart on changes
- **API Testing**: Use http://localhost:5000/api/health to test backend
- **Browser DevTools**: Open developer tools to see network requests
- **Console Logs**: Check terminal for server logs and errors

## Need Help?

If you encounter any issues:
1. Check the terminal output for error messages
2. Verify your MongoDB connection string
3. Ensure all environment variables are set correctly
4. Check that both frontend and backend are running

The application is fully functional once MongoDB is properly connected! 🎉
