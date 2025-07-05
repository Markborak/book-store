import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, BookOpen, Users, Award, ArrowRight } from 'lucide-react';
import { booksAPI } from '../services/api';
import toast from 'react-hot-toast';

interface Book {
  _id: string;
  title: string;
  description: string;
  price: number;
  coverImage: string;
  rating: number;
  salesCount: number;
}

const Home = () => {
  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalSales: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksResponse, statsResponse] = await Promise.all([
          booksAPI.getFeatured(),
          booksAPI.getStats()
        ]);
        
        setFeaturedBooks(booksResponse.data.data);
        setStats(statsResponse.data.data);
      } catch (error) {
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Transform Your Life with
                <span className="text-yellow-400 block">Powerful Insights</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Discover life-changing books by Mwatha Njoroge, a renowned public speaker 
                and life coach. Start your journey to greatness today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/books"
                  className="inline-flex items-center px-8 py-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Explore Books
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-900 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Mwatha Njoroge"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-yellow-500 text-blue-900 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Award className="h-6 w-6" />
                  <span className="font-semibold">Life Coach & Author</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-blue-800" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalBooks}+</h3>
              <p className="text-gray-600">Published Books</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mx-auto mb-4">
                <Users className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.totalSales}+</h3>
              <p className="text-gray-600">Happy Readers</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <Star className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">{stats.avgRating.toFixed(1)}</h3>
              <p className="text-gray-600">Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Books
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our most popular and transformative books that have helped 
              thousands achieve their goals and unlock their potential.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBooks.map((book) => (
              <div key={book._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={`http://localhost:5000/${book.coverImage}`}
                  alt={book.title}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{book.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-blue-800">KES {book.price}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600">{book.rating}</span>
                    </div>
                  </div>
                  <Link
                    to={`/books/${book._id}`}
                    className="block w-full text-center px-4 py-2 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/books"
              className="inline-flex items-center px-8 py-4 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
            >
              View All Books
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Join thousands of readers who have already started their journey to success. 
            Get instant access to life-changing insights delivered directly to your WhatsApp.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center px-8 py-4 bg-yellow-500 text-blue-900 font-semibold rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;