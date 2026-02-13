'use client';

import Userorder from '@/components/Userorder';
import { useState, useEffect } from 'react';

interface User {
  id: number;
  uid: string;
  name: string;
  whatsappnum: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      
      if (data.success) {
        setUsers(data.data);
        setError(null);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Error fetching users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedImage(null);
      }
    };
    if (selectedImage) {
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
    }
  }, [selectedImage]);

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setUsers(users.filter(user => user.id !== id));
        setError(null);
      } else {
        setError(data.message || 'Failed to delete user');
      }
    } catch (err) {
      setError('Error deleting user');
      console.error(err);
    }
  };

  // Handle edit start
  const handleEditStart = (user: User) => {
    setEditingId(user.id);
    setEditForm({
      uid: user.uid,
      name: user.name,
      whatsappnum: user.whatsappnum,
      imageUrl: user.imageUrl || '',
    });
  };

  // Handle edit cancel
  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Handle update
  const handleUpdate = async (id: number) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });
      const data = await response.json();

      if (data.success) {
        setUsers(users.map(user => user.id === id ? data.data : user));
        setEditingId(null);
        setEditForm({});
        setError(null);
      } else {
        setError(data.message || 'Failed to update user');
      }
    } catch (err) {
      setError('Error updating user');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Users Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left border-b">ID</th>
              <th className="px-4 py-3 text-left border-b">UID</th>
              <th className="px-4 py-3 text-left border-b">Name</th>
              <th className="px-4 py-3 text-left border-b">WhatsApp</th>
              <th className="px-4 py-3 text-left border-b">Image</th>
              <th className="px-4 py-3 text-left border-b">Created At</th>
              <th className="px-4 py-3 text-left border-b">Updated At</th>
              <th className="px-4 py-3 text-left border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b">{user.id}</td>
                  <td className="px-4 py-3 border-b">
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={editForm.uid || ''}
                        onChange={(e) => setEditForm({ ...editForm, uid: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      user.uid
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      user.name
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={editForm.whatsappnum || ''}
                        onChange={(e) => setEditForm({ ...editForm, whatsappnum: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                      />
                    ) : (
                      user.whatsappnum
                    )}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {editingId === user.id ? (
                      <input
                        type="text"
                        value={editForm.imageUrl || ''}
                        onChange={(e) => setEditForm({ ...editForm, imageUrl: e.target.value })}
                        className="w-full px-2 py-1 border rounded"
                        placeholder="Image URL"
                      />
                    ) : (
                      user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt={user.name}
                          className="w-16 h-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => setSelectedImage(user.imageUrl!)}
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect width="64" height="64" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )
                    )}
                  </td>
                  <td className="px-4 py-3 border-b text-sm text-gray-600">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 border-b text-sm text-gray-600">
                    {new Date(user.updatedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 border-b">
                    {editingId === user.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdate(user.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditStart(user)}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-7xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-all z-10"
              aria-label="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded"
              onClick={(e) => e.stopPropagation()}
              onError={(e) => {
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect width="800" height="600" fill="%23ddd"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="24"%3EImage not found%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>
        </div>
      )}
      <div>
        <Userorder/>
      </div>
    </div>
  );
}
