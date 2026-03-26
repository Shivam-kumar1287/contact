const Contact = require('../models/Contact');

// @desc    Get all contacts for logged-in user
// @route   GET /api/contacts
// @access  Private
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message
    });
  }
};

// @desc    Search contacts for logged-in user
// @route   GET /api/contacts/search
// @access  Private
const searchContacts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const contacts = await Contact.find({
      user: req.user.id,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching contacts',
      error: error.message
    });
  }
};

// @desc    Create a contact for logged-in user
// @route   POST /api/contacts
// @access  Private
const createContact = async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    // Check for duplicate email for this user
    if (email) {
      const existingContact = await Contact.findOne({ 
        email: email.toLowerCase(),
        user: req.user.id
      });
      if (existingContact) {
        return res.status(400).json({
          success: false,
          message: 'A contact with this email already exists'
        });
      }
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      phone: phone ? phone.trim() : undefined,
      address: address ? address.trim() : undefined,
      notes: notes ? notes.trim() : undefined,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: contact
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating contact',
      error: error.message
    });
  }
};

// @desc    Get single contact for logged-in user
// @route   GET /api/contacts/:id
// @access  Private
const getContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, user: req.user.id });

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
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message
    });
  }
};

// @desc    Update contact for logged-in user
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = async (req, res) => {
  try {
    const { name, email, phone, address, notes } = req.body;

    // Validation
    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Name is required'
      });
    }

    // Check for duplicate email for this user (excluding current contact)
    if (email) {
      const existingContact = await Contact.findOne({ 
        email: email.toLowerCase(),
        user: req.user.id,
        _id: { $ne: req.params.id }
      });
      
      if (existingContact) {
        return res.status(400).json({
          success: false,
          message: 'A contact with this email already exists'
        });
      }
    }

    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        name: name.trim(),
        email: email ? email.trim().toLowerCase() : undefined,
        phone: phone ? phone.trim() : undefined,
        address: address ? address.trim() : undefined,
        notes: notes ? notes.trim() : undefined
      },
      { new: true, runValidators: true }
    );

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
  } catch (error) {
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating contact',
      error: error.message
    });
  }
};

// @desc    Delete contact for logged-in user
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findOne({ _id: req.params.id, user: req.user.id });

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message
    });
  }
};

module.exports = {
  getContacts,
  searchContacts,
  createContact,
  getContact,
  updateContact,
  deleteContact
};
