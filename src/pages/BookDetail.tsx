import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Calendar, FileText, Users, ShoppingCart, Phone } from 'lucide-react';
import { booksAPI, paymentsAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  category: string;
  coverImage: string;
  rating: number;
  salesCount: number;
  pages: number;
  format: string;
  publicationDate: string;
  tags: string[];
}

const BookDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: '',
    customerEmail: '',
    customerName: ''
  });

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await booksAPI.getById(id!);
      setBook(response.data.data);
    } catch (error) {
      toast.error('Failed to load book details');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    setPurchasing(true);
    try {
      const response = await paymentsAPI.initiate({
        phoneNumber: formData.phoneNumber,
        bookId: book._id,
        customerEmail: formData.customerEmail || undefined,
        customerName: formData.customerName || undefined
      });

      toast.success('Payment initiated! Please check your phone for M-Pesa prompt.');
      setShowPurchaseForm(false);
      
      // Poll for payment status
      const transactionId = response.data.transactionId;
      pollPaymentStatus(transactionId);
      
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Payment initiation failed');
    } finally {
      setPurchasing(false);
    }
  };

  const pollPaymentStatus = async (transactionId: string) => {
    const maxAttempts = 30; // 5 minutes
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await paymentsAPI.getStatus(transactionId);
        const status = response.data.data.paymentStatus;

        if (status === 'success') {
          toast.success('Payment successful! Your e-book will be sent to WhatsApp shortly.');
          return;
        } else if (status === 'failed') {
          toast.error('Payment failed. Please try again.');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 10000); // Check every 10 seconds
        } else {
          toast.error('Payment status check timed out. Please contact support if payment was deducted.');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
      }
    };

    poll();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Book not found</h1>
          <p className="text-gray-600">The book you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Book Cover */}
            <div className="flex justify-center">
              <img
                src={`http://localhost:5000/${book.coverImage}`}
                alt={book.title}
                className="w-full max-w-md rounded-lg shadow-lg"
              />
            </div>

            {/* Book Details */}
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                  {book.category}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {book.title}
              </h1>
              
              <p className="text-xl text-gray-600 mb-6">by {book.author}</p>
              
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="text-lg font-medium">{book.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-600">{book.salesCount} readers</span>
                </div>
              </div>

              <div className="text-4xl font-bold text-blue-800 mb-6">
                KES {book.price}
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>{book.pages} pages</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(book.publicationDate).getFullYear()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>{book.format}</span>
                </div>
              </div>

              <button
                onClick={() => setShowPurchaseForm(true)}
                className="w-full flex items-center justify-center space-x-2 px-8 py-4 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors mb-6"
              >
                <ShoppingCart className="h-5 w-5" />
                <span>Buy Now with M-Pesa</span>
              </button>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-800 mb-2">Instant Delivery</h3>
                <p className="text-yellow-700 text-sm">
                  After successful payment, your e-book will be automatically sent to your WhatsApp number. 
                  No waiting, no delays!
                </p>
              </div>
            </div>
          </div>

          {/* Description and Tags */}
          <div className="border-t border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Book</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              {book.description}
            </p>

            {book.tags && book.tags.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {book.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Purchase Form Modal */}
      {showPurchaseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Purchase</h2>
            
            <form onSubmit={handlePurchase}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number (M-Pesa) *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="tel"
                    required
                    placeholder="254712345678"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">Payment Summary</h3>
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">{book.title}</span>
                  <span className="font-bold text-blue-800">KES {book.price}</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPurchaseForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={purchasing}
                  className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors disabled:opacity-50"
                >
                  {purchasing ? 'Processing...' : 'Pay Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookDetail;