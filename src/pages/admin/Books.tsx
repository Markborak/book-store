/**
 * AdminBooks component provides an interface for administrators to manage the book collection.
 * It supports viewing, searching, filtering by category, pagination, creating, editing, deleting,
 * and toggling the active status of books.
 */

import React, { useEffect, useState } from "react";
import { Plus, Edit, Trash2, Eye, Search } from "lucide-react";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";

/**
 * Book interface represents the structure of a book object.
 * @property _id - Unique identifier for the book
 * @property title - Title of the book
 * @property description - Short description of the book
 * @property price - Price of the book in KES
 * @property category - Category to which the book belongs
 * @property coverImage - URL or path to the book's cover image
 * @property active - Boolean indicating if the book is active (available)
 * @property salesCount - Number of sales for the book
 * @property rating - Average rating of the book
 * @property createdAt - Date when the book was created
 */
interface Book {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  coverImage: string;
  active: boolean;
  salesCount: number;
  rating: number;
  createdAt: string;
}

const AdminBooks = () => {
  // State to hold the list of books fetched from the API
  const [books, setBooks] = useState<Book[]>([]);
  // Loading state to show spinner while fetching data
  const [loading, setLoading] = useState(true);
  // Search term entered by the user for filtering books by title or description
  const [searchTerm, setSearchTerm] = useState("");
  // Selected category filter for books
  const [selectedCategory, setSelectedCategory] = useState("");
  // Current page number for pagination
  const [currentPage, setCurrentPage] = useState(1);
  // Total number of pages available based on API response
  const [totalPages, setTotalPages] = useState(1);
  // Boolean to control visibility of the create book modal form
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Predefined list of book categories for filtering
  const categories = [
    "Self-Help",
    "Motivation",
    "Business",
    "Leadership",
    "Personal Development",
  ];

  /**
   * useEffect hook triggers fetchBooks whenever searchTerm, selectedCategory, or currentPage changes.
   * This ensures the book list is updated based on filters and pagination.
   */
  useEffect(() => {
    fetchBooks();
  }, [searchTerm, selectedCategory, currentPage]);

  /**
   * fetchBooks asynchronously fetches books from the admin API with current filters and pagination.
   * It updates the books state and totalPages based on the API response.
   * Shows a loading spinner while fetching and handles errors with toast notifications.
   */
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        category: selectedCategory || undefined,
      };

      const response = await adminAPI.getBooks(params);
      setBooks(response.data.data);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  /**
   * handleDeleteBook prompts the user for confirmation before deleting a book by its ID.
   * On success, it shows a success toast and refreshes the book list.
   * On failure, it shows an error toast.
   * @param id - ID of the book to delete
   * @param title - Title of the book to show in confirmation prompt
   */
  const handleDeleteBook = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await adminAPI.deleteBook(id);
      toast.success("Book deleted successfully");
      fetchBooks();
    } catch (error) {
      toast.error("Failed to delete book");
    }
  };

  /**
   * handleToggleStatus toggles the active status of a book by its ID.
   * It sends an update request to the API and refreshes the book list on success.
   * Shows success or error toast based on the outcome.
   * @param id - ID of the book to update
   * @param currentStatus - Current active status of the book
   */
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await adminAPI.updateBook(id, { active: !currentStatus });
      toast.success(
        `Book ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      fetchBooks();
    } catch (error) {
      toast.error("Failed to update book status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section with title and add new book button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
            <p className="text-gray-600">
              Create, edit, and manage your book collection
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Book</span>
          </button>
        </div>

        {/* Filters section with search input, category dropdown, and clear filters button */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("");
                setCurrentPage(1);
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Books table section displaying book details and actions */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            // Loading spinner while fetching books
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800"></div>
            </div>
          ) : books.length === 0 ? (
            // Message when no books are found
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No books found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book) => (
                      <tr key={book._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {/* Book cover image */}
                            <img
                              src={`https://book-store-pk35.onrender.com/${book.coverImage}`}
                              alt={book.title}
                              className="h-16 w-12 object-cover rounded"
                            />
                            <div className="ml-4">
                              {/* Book title */}
                              <div className="text-sm font-medium text-gray-900">
                                {book.title}
                              </div>
                              {/* Book description with line clamp */}
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {book.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Book category badge */}
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {book.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {/* Book price */}
                          KES {book.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {/* Book sales count */}
                          {book.salesCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Button to toggle book active status */}
                          <button
                            onClick={() =>
                              handleToggleStatus(book._id, book.active)
                            }
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              book.active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {book.active ? "Active" : "Inactive"}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {/* Action buttons: view, edit (TODO), delete */}
                          <div className="flex items-center space-x-2">
                            <a
                              href={`/books/${book._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                            <button
                              onClick={() => {
                                /* TODO: Implement edit */
                              }}
                              className="text-yellow-600 hover:text-yellow-900"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleDeleteBook(book._id, book.title)
                              }
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
                  {/* Mobile pagination buttons */}
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() =>
                        setCurrentPage(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() =>
                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  {/* Desktop pagination buttons */}
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page{" "}
                        <span className="font-medium">{currentPage}</span> of{" "}
                        <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Previous
                        </button>
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === page
                                ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                        <button
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Create Book Modal - Placeholder for book creation form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Add New Book
            </h2>
            <p className="text-gray-600 mb-6">
              Book creation form would go here. This requires file upload
              functionality.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900"
              >
                Create Book
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
