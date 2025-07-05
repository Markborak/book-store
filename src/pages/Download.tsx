import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Clock, AlertCircle, CheckCircle, FileText } from 'lucide-react';
import { downloadAPI } from '../services/api';
import toast from 'react-hot-toast';

interface DownloadInfo {
  bookTitle: string;
  author: string;
  format: string;
  fileSize: number;
  downloadCount: number;
  maxDownloads: number;
  remainingDownloads: number;
  expiresAt: string;
  isExpired: boolean;
  purchaseDate: string;
}

const DownloadPage = () => {
  const { token } = useParams<{ token: string }>();
  const [downloadInfo, setDownloadInfo] = useState<DownloadInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchDownloadInfo();
    }
  }, [token]);

  const fetchDownloadInfo = async () => {
    try {
      const response = await downloadAPI.getInfo(token!);
      setDownloadInfo(response.data.data);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load download information');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!downloadInfo || downloadInfo.isExpired || downloadInfo.remainingDownloads <= 0) {
      return;
    }

    setDownloading(true);
    try {
      downloadAPI.download(token!);
      toast.success('Download started!');
      
      // Refresh download info after a short delay
      setTimeout(() => {
        fetchDownloadInfo();
        setDownloading(false);
      }, 2000);
    } catch (error) {
      toast.error('Download failed');
      setDownloading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Download Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  if (!downloadInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <AlertCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Download Not Found</h1>
          <p className="text-gray-600 mb-6">
            The download link you're looking for doesn't exist or has been removed.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-8">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="h-8 w-8" />
              <h1 className="text-2xl font-bold">Your E-Book Download</h1>
            </div>
            <p className="text-blue-100">
              Thank you for your purchase! Your e-book is ready for download.
            </p>
          </div>

          {/* Book Information */}
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{downloadInfo.bookTitle}</h2>
              <p className="text-lg text-gray-600">by {downloadInfo.author}</p>
            </div>

            {/* Download Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-gray-900">Downloads</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {downloadInfo.remainingDownloads} / {downloadInfo.maxDownloads}
                </p>
                <p className="text-sm text-gray-600">remaining</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-gray-900">Expires</span>
                </div>
                <p className="text-sm text-gray-900 font-medium">
                  {formatDate(downloadInfo.expiresAt)}
                </p>
                <p className="text-sm text-gray-600">
                  {downloadInfo.isExpired ? 'Expired' : 'Valid'}
                </p>
              </div>
            </div>

            {/* File Details */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-4">File Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Format:</span>
                  <span className="ml-2 text-blue-800">{downloadInfo.format}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Size:</span>
                  <span className="ml-2 text-blue-800">{formatFileSize(downloadInfo.fileSize)}</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Downloaded:</span>
                  <span className="ml-2 text-blue-800">{downloadInfo.downloadCount} times</span>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Purchased:</span>
                  <span className="ml-2 text-blue-800">{formatDate(downloadInfo.purchaseDate)}</span>
                </div>
              </div>
            </div>

            {/* Download Button */}
            {downloadInfo.isExpired ? (
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Download Expired</h3>
                <p className="text-gray-600 mb-6">
                  This download link has expired. Please contact support if you need assistance.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            ) : downloadInfo.remainingDownloads <= 0 ? (
              <div className="text-center">
                <AlertCircle className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Download Limit Reached</h3>
                <p className="text-gray-600 mb-6">
                  You have reached the maximum number of downloads for this book.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center px-6 py-3 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors"
                >
                  Contact Support
                </a>
              </div>
            ) : (
              <div className="text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Download</h3>
                <p className="text-gray-600 mb-6">
                  Click the button below to download your e-book. The download will start immediately.
                </p>
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="inline-flex items-center space-x-2 px-8 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {downloading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Preparing Download...</span>
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5" />
                      <span>Download E-Book</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Important Notes */}
            <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="font-semibold text-yellow-800 mb-3">Important Notes</h3>
              <ul className="text-yellow-700 text-sm space-y-2">
                <li>• This download link is valid for 24 hours from purchase</li>
                <li>• You can download the book up to {downloadInfo.maxDownloads} times</li>
                <li>• Keep this link safe and don't share it with others</li>
                <li>• If you experience any issues, contact our support team</li>
                <li>• The e-book is for personal use only</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;