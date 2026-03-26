import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { contactAPI } from '../services/api';
import ContactForm from '../components/ContactForm';
import toast from 'react-hot-toast';

const AddContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      fetchContact();
    }
  }, [id, isEditing]);

  const fetchContact = async () => {
    try {
      setLoading(true);
      const response = await contactAPI.getContact(id);
      setInitialData(response.data);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch contact');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSubmitting(true);
      
      if (isEditing) {
        await contactAPI.updateContact(id, formData);
      } else {
        await contactAPI.createContact(formData);
      }
    } catch (error) {
      throw error; // Re-throw to handle in ContactForm
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading-spinner h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {isEditing ? 'Edit Contact' : 'Add New Contact'}
        </h1>
        <p className="text-gray-600">
          {isEditing 
            ? 'Update the contact information below'
            : 'Fill in the form below to add a new contact'
          }
        </p>
      </div>

      <ContactForm
        onSubmit={handleSubmit}
        initialData={initialData}
        loading={submitting}
      />
    </div>
  );
};

export default AddContact;
