import React, { useState } from 'react';

interface PasskeySignupModalProps {
  open: boolean;
  onSubmit: (data: { username: string; phoneNumber: string }) => void;
  onClose: () => void;
}

export default function PasskeySignupModal({ open, onSubmit, onClose }: PasskeySignupModalProps) {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !phoneNumber.trim()) {
      setError('Please enter both username and phone number.');
      return;
    }
    setError('');
    onSubmit({ username, phoneNumber });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center">Complete Registration</h2>
        {error && <div className="mb-2 text-red-600 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter your username"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Mobile Number</label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Enter your mobile number"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}