import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { contactAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ContactList from '../components/ContactList';
import SearchBar from '../components/SearchBar';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getAllContacts();
      setContacts(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      await fetchContacts();
      return;
    }

    try {
      setSearchLoading(true);
      const response = await contactAPI.searchContacts(query);
      setContacts(response.data || []);
    } catch (error) {
      toast.error(error.message || 'Failed to search contacts');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await contactAPI.deleteContact(id);
      setContacts(prev => prev.filter(contact => contact._id !== id));
    } catch (error) {
      throw error; // Re-throw to handle in ContactCard
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-contact/${id}`);
  };

  const handleRefresh = () => {
    setSearchQuery('');
    navigate('/add-contact');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div>
      {/* Header with user info and logout */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Contact Manager
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name}! Manage your contacts efficiently.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-secondary text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <SearchBar 
        onSearch={handleSearch} 
        loading={searchLoading}
      />

      <ContactList
        contacts={contacts}
        loading={loading}
        onDelete={handleDelete}
        onEdit={handleEdit}
        searchQuery={searchQuery}
        onRefresh={handleRefresh}
      />
    </div>
  );
};

export default Dashboard;
