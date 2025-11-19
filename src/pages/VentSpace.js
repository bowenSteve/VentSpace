import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from 'firebase/firestore';
import { Filter } from 'bad-words';

const filter = new Filter();

function VentSpace() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const MAX_CHARS = 500;

  // Real-time listener for messages
  useEffect(() => {
    const q = query(collection(db, 'vents'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || newMessage.length > MAX_CHARS) return;

    setIsSubmitting(true);

    try {
      // Content moderation - filter profanity
      const cleanedMessage = filter.clean(newMessage.trim());

      await addDoc(collection(db, 'vents'), {
        text: cleanedMessage,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });

      setNewMessage('');
      setCharCount(0);
      setShowSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding message:', error);
      alert('Failed to post your message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARS) {
      setNewMessage(text);
      setCharCount(text.length);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Just now';

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            Emotional Vent Space
          </h1>
          <p className="text-gray-600 mt-2">
            A safe space to share your thoughts anonymously
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Submission Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-purple-100 transition-all duration-300 hover:shadow-xl">
          <form onSubmit={handleSubmit}>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Share what's on your mind...
            </label>
            <textarea
              id="message"
              value={newMessage}
              onChange={handleTextChange}
              placeholder="Express yourself freely. You're safe here. 💜"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all duration-200"
              rows="4"
              disabled={isSubmitting}
              aria-label="Message input"
            />

            <div className="flex items-center justify-between mt-4">
              <span className={`text-sm ${charCount > MAX_CHARS * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
                {charCount}/{MAX_CHARS} characters
              </span>

              <button
                type="submit"
                disabled={!newMessage.trim() || isSubmitting || charCount > MAX_CHARS}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {isSubmitting ? 'Posting...' : 'Share Anonymously'}
              </button>
            </div>
          </form>

          {/* Success Message */}
          {showSuccess && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-800 rounded-lg animate-fade-in">
              Your message has been shared. Thank you for opening up. 🌟
            </div>
          )}
        </div>

        {/* Messages Feed */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Recent Vents ({messages.length})
          </h2>

          {messages.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-purple-100">
              <p className="text-gray-500 text-lg">
                No messages yet. Be the first to share! 💭
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id}
                className="bg-white rounded-2xl shadow-md p-6 border border-purple-100 transition-all duration-300 hover:shadow-lg hover:border-purple-200 animate-slide-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <p className="text-gray-800 leading-relaxed mb-3 whitespace-pre-wrap">
                  {message.text}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {formatTimestamp(message.timestamp)}
                  </span>
                  <span className="text-purple-400">💜</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-gray-600 text-sm">
          <p className="mb-2">
            All messages are anonymous. Be kind and supportive.
          </p>
          <p className="text-xs text-gray-500">
            Content moderation is active to maintain a safe space for everyone.
          </p>
        </div>
      </main>
    </div>
  );
}

export default VentSpace;
