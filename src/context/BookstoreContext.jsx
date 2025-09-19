import React, { createContext, useContext, useState } from 'react';

// Placeholder image URLs since assets don't exist yet
const cleanCodeImg = 'https://via.placeholder.com/300x400/4F46E5/FFFFFF?text=Clean+Code';
const webDevImg = 'https://via.placeholder.com/300x400/059669/FFFFFF?text=Web+Dev';
const databaseImg = 'https://via.placeholder.com/300x400/DC2626/FFFFFF?text=Database';
const aiMlImg = 'https://via.placeholder.com/300x400/7C3AED/FFFFFF?text=AI+ML';
const cybersecurityImg = 'https://via.placeholder.com/300x400/EA580C/FFFFFF?text=Security';
const cloudImg = 'https://via.placeholder.com/300x400/0891B2/FFFFFF?text=Cloud';

const BookstoreContext = createContext(null);

// Sample data
const sampleBooks = [
  {
    id: '1',
    title: 'The Art of Clean Code',
    author: 'Robert C. Martin',
    description: 'A comprehensive guide to writing clean, maintainable code that will stand the test of time. Learn the principles and practices that separate professional developers from amateurs.',
    shortDescription: 'Master the art of writing clean, maintainable code with proven principles and practices.',
    category: 'Programming',
    coverImageUrl: cleanCodeImg,
    pdfSampleUrl: '/samples/clean-code-sample.pdf',
    uploadDate: '2024-01-15',
    averageRating: 4.5,
    reviews: []
  },
  {
    id: '2',
    title: 'Modern Web Development',
    author: 'Sarah Johnson',
    description: 'Explore the latest trends and technologies in web development, from React and Vue to serverless architecture and JAMstack.',
    shortDescription: 'Comprehensive guide to modern web development technologies and best practices.',
    category: 'Web Development',
    coverImageUrl: webDevImg,
    uploadDate: '2024-02-01',
    averageRating: 4.2,
    reviews: []
  },
  {
    id: '3',
    title: 'Database Design Fundamentals',
    author: 'Michael Chen',
    description: 'Learn the essential principles of database design, normalization, and optimization for both relational and NoSQL databases.',
    shortDescription: 'Essential principles of database design and optimization for modern applications.',
    category: 'Database',
    coverImageUrl: databaseImg,
    uploadDate: '2024-01-30',
    averageRating: 4.7,
    reviews: []
  },
  {
    id: '4',
    title: 'AI and Machine Learning Basics',
    author: 'Dr. Emily Rodriguez',
    description: 'An accessible introduction to artificial intelligence and machine learning concepts, perfect for beginners and professionals alike.',
    shortDescription: 'Accessible introduction to AI and ML concepts for beginners and professionals.',
    category: 'Artificial Intelligence',
    coverImageUrl: aiMlImg,
    uploadDate: '2024-02-10',
    averageRating: 4.3,
    reviews: []
  },
  {
    id: '5',
    title: 'Cybersecurity Essentials',
    author: 'James Wilson',
    description: 'Protect your digital assets with comprehensive cybersecurity strategies, from basic security hygiene to advanced threat detection.',
    shortDescription: 'Comprehensive cybersecurity strategies for protecting digital assets.',
    category: 'Security',
    coverImageUrl: cybersecurityImg,
    uploadDate: '2024-02-05',
    averageRating: 4.6,
    reviews: []
  },
  {
    id: '6',
    title: 'Cloud Computing Architecture',
    author: 'Lisa Thompson',
    description: 'Design scalable and resilient cloud solutions using AWS, Azure, and Google Cloud Platform. Learn best practices for cloud migration.',
    shortDescription: 'Design scalable cloud solutions with AWS, Azure, and Google Cloud Platform.',
    category: 'Cloud Computing',
    coverImageUrl: cloudImg,
    uploadDate: '2024-01-20',
    averageRating: 4.4,
    reviews: []
  }
];

export const BookstoreProvider = ({ children }) => {
  const [books, setBooks] = useState(sampleBooks);
  const [reviews, setReviews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [magazineRequests, setMagazineRequests] = useState([]);
  const [filters, setFiltersState] = useState({
    search: '',
    category: 'all',
    rating: 'all',
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(true);

  const addBook = (bookData) => {
    const newBook = {
      ...bookData,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString().split('T')[0],
      averageRating: 0,
      reviews: []
    };
    setBooks(prev => [newBook, ...prev]);
  };

  const updateBook = (id, bookData) => {
    setBooks(prev => prev.map(book => 
      book.id === id ? { ...book, ...bookData } : book
    ));
  };

  const deleteBook = (id) => {
    setBooks(prev => prev.filter(book => book.id !== id));
    setReviews(prev => prev.filter(review => review.bookId !== id));
  };

  const addReview = (reviewData) => {
    const newReview = {
      ...reviewData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [...prev, newReview]);
    
    // Update book's average rating
    const bookReviews = [...reviews.filter(r => r.bookId === reviewData.bookId), newReview];
    const averageRating = bookReviews.reduce((sum, r) => sum + r.rating, 0) / bookReviews.length;
    updateBook(reviewData.bookId, { averageRating });
  };

  const deleteReview = (id) => {
    const review = reviews.find(r => r.id === id);
    setReviews(prev => prev.filter(r => r.id !== id));
    
    if (review) {
      const remainingReviews = reviews.filter(r => r.bookId === review.bookId && r.id !== id);
      const averageRating = remainingReviews.length > 0 
        ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length 
        : 0;
      updateBook(review.bookId, { averageRating });
    }
  };

  const addContact = (contactData) => {
    const newContact = {
      ...contactData,
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0]
    };
    setContacts(prev => [newContact, ...prev]);
  };

  const addMagazineRequest = (requestData) => {
    const newRequest = {
      ...requestData,
      id: Date.now().toString(),
      requestDate: new Date().toISOString().split('T')[0],
      status: 'pending'
    };
    setMagazineRequests(prev => [newRequest, ...prev]);
  };

  const updateMagazineRequestStatus = (id, status) => {
    setMagazineRequests(prev => prev.map(request => 
      request.id === id ? { ...request, status } : request
    ));
  };

  const deleteMagazineRequest = (id) => {
    setMagazineRequests(prev => prev.filter(request => request.id !== id));
  };

  const setFilters = (newFilters) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const login = (username, password) => {
    if (username === 'admin' && password === 'password123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
  };

  const value = {
    books,
    reviews,
    contacts,
    magazineRequests,
    filters,
    currentPage,
    isAdmin,
    
    setBooks,
    addBook,
    updateBook,
    deleteBook,
    
    addReview,
    deleteReview,
    
    addContact,
    
    addMagazineRequest,
    updateMagazineRequestStatus,
    deleteMagazineRequest,
    
    setFilters,
    setCurrentPage,
    
    login,
    logout
  };

  return (
    <BookstoreContext.Provider value={value}>
      {children}
    </BookstoreContext.Provider>
  );
};

export const useBookstore = () => {
  const context = useContext(BookstoreContext);
  if (context === undefined) {
    throw new Error('useBookstore must be used within a BookstoreProvider');
  }
  return context;
};