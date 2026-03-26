import { useState, useEffect } from 'react';
import ContactCard from './ContactCard';
import toast from 'react-hot-toast';

const ContactList = ({ 
  contacts, 
  loading, 
  onDelete, 
  onEdit, 
  searchQuery,
  onRefresh 
}) => {
  const [filteredContacts, setFilteredContacts] = useState(contacts);

  useEffect(() => {
    if (searchQuery) {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone?.includes(searchQuery)
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [contacts, searchQuery]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    );
  }

  if (filteredContacts.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {searchQuery ? 'No contacts found' : 'No contacts yet'}
        </h3>
        <p className="text-gray-600 mb-4">
          {searchQuery 
            ? 'Try adjusting your search terms'
            : 'Get started by adding your first contact'
          }
        </p>
        {!searchQuery && (
          <button
            onClick={onRefresh}
            className="btn btn-primary"
          >
            Add Your First Contact
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {searchQuery ? `Search Results (${filteredContacts.length})` : `All Contacts (${filteredContacts.length})`}
        </h2>
        {searchQuery && (
          <button
            onClick={onRefresh}
            className="btn btn-secondary text-sm"
          >
            Clear Search
          </button>
        )}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map((contact) => (
          <ContactCard
            key={contact._id}
            contact={contact}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </div>
  );
};

export default ContactList;
