const express = require('express');
const router = express.Router();
const {
  getContacts,
  searchContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact
} = require('../controllers/contactController');
const protect = require('../middleware/authMiddleware');

// Apply authentication middleware to all routes
router.use(protect);

// Route for getting all contacts and creating a new contact
router.route('/')
  .get(getContacts)
  .post(createContact);

// Route for searching contacts
router.get('/search', searchContacts);

// Routes for getting, updating, and deleting a single contact
router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

module.exports = router;
