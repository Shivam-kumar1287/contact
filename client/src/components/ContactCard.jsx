import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const ContactCard = ({ contact, onDelete, onEdit }) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await onDelete(contact._id);
        toast.success('Contact deleted successfully');
      } catch (error) {
        toast.error(error.message || 'Failed to delete contact');
      }
    }
  };

  const handleEdit = () => {
    onEdit(contact._id);
  };

  return (
    <div className="card p-6 animate-fade-in">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {contact.name}
          </h3>
          {contact.email && (
            <div className="flex items-center text-gray-600 mb-1">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a 
                href={`mailto:${contact.email}`}
                className="hover:text-primary-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {contact.email}
              </a>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center text-gray-600 mb-1">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a 
                href={`tel:${contact.phone}`}
                className="hover:text-primary-600 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {contact.phone}
              </a>
            </div>
          )}
          {contact.address && (
            <div className="flex items-start text-gray-600 mb-1">
              <svg
                className="w-4 h-4 mr-2 mt-1 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>{contact.address}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2 ml-4">
          <button
            onClick={handleEdit}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit contact"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete contact"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
      
      {contact.notes && (
        <div className="border-t pt-3 mt-3">
          <p className="text-gray-600 text-sm">
            <span className="font-medium">Notes:</span> {contact.notes}
          </p>
        </div>
      )}
      
      <div className="border-t pt-3 mt-3">
        <p className="text-gray-400 text-xs">
          Added {new Date(contact.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default ContactCard;
