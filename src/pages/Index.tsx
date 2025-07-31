import React, { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight, Download, X, ZoomIn, ZoomOut, Menu, BookOpen, Filter, Facebook, Youtube, Twitter } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import BookReader from '@/components/BookReader';

const Index = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isMobile, setIsMobile] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showArabic, setShowArabic] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');

  // Featured books - prioritize "Seerat Ibn Ishaq" first
  const featuredBooks = [
    "Seerat Ibn Ishaq", // This should be first
    "Tafsir al Qurtubi"
  ];

  // Load books from manifest.json
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const response = await fetch('/manifest.json');
        const manifestBooks = await response.json();
        
        console.log('Loaded books from manifest:', manifestBooks.length);
        
        // Transform the books to keep both Arabic and English
        const transformedBooks = manifestBooks.map(book => ({
          title: book.title_en,
          author: book.author_en,
          title_ar: book.title_ar,
          author_ar: book.author_ar,
          filename: book.filename_en,
          coverText: book.coverText || book.title_en.substring(0, 10),
          type: book.type,
          source: book.source,
          category: book.category
        }));
        
        console.log('Transformed books:', transformedBooks.length);
        setBooks(transformedBooks);
        
        // Show featured books first, then rest
        const featured = transformedBooks.filter(book => 
          featuredBooks.some(featuredTitle => 
            book.title.toLowerCase().includes(featuredTitle.toLowerCase()) ||
            book.title_ar.includes(featuredTitle)
          )
        );
        const others = transformedBooks.filter(book => 
          !featuredBooks.some(featuredTitle => 
            book.title.toLowerCase().includes(featuredTitle.toLowerCase()) ||
            book.title_ar.includes(featuredTitle)
          )
        );
        
        setFilteredBooks([...featured, ...others]);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load books from manifest:', error);
        setLoading(false);
      }
    };

    loadBooks();
  }, []);

  // Load categories from JSON file
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch('/categories.json');
        const categoryNames = await response.json();
        
        console.log('Loaded categories:', categoryNames);
        
        // Create categories array with 'All Books' as first item and BookOpen icon for all
        const categoriesWithIcons = [
          { id: 'all', name: 'All Books', icon: BookOpen },
          ...categoryNames.map(name => ({
            id: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
            name: name,
            icon: BookOpen
          }))
        ];
        
        console.log('Categories with icons:', categoriesWithIcons);
        setCategories(categoriesWithIcons);
      } catch (error) {
        console.error('Failed to load categories:', error);
        // Fallback to basic categories if JSON fails to load
        setCategories([
          { id: 'all', name: 'All Books', icon: BookOpen }
        ]);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    let filtered = books;
    
    console.log('Filtering books. Selected category:', selectedCategory);
    console.log('Total books before filtering:', books.length);
    console.log('Is mobile:', isMobile);
    
    if (selectedCategory !== 'all') {
      // Find the actual category name from the selectedCategory id
      const categoryObj = categories.find(cat => cat.id === selectedCategory);
      const categoryName = categoryObj ? categoryObj.name : selectedCategory;
      
      console.log('Looking for category:', categoryName);
      console.log('Available categories:', categories.map(c => c.name));
      
      filtered = filtered.filter(book => {
        const matches = book.category === categoryName;
        console.log(`Book "${book.title}" category: "${book.category}" matches "${categoryName}":`, matches);
        return matches;
      });
    }
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(book => 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.title_ar.includes(searchQuery) ||
        book.author_ar.includes(searchQuery)
      );
    }
    
    console.log('Filtered books count:', filtered.length);
    console.log('First few filtered books:', filtered.slice(0, 3).map(b => ({ title: b.title, category: b.category })));
    
    // If no category is selected and no search, show featured books first with Seerat Ibn Ishaq prioritized
    if (selectedCategory === 'all' && !searchQuery.trim()) {
      // Sort featured books with "Seerat Ibn Ishaq" first
      const featured = filtered.filter(book => 
        featuredBooks.some(featuredTitle => 
          book.title.toLowerCase().includes(featuredTitle.toLowerCase()) ||
          book.title_ar.includes(featuredTitle)
        )
      ).sort((a, b) => {
        // Prioritize "Seerat Ibn Ishaq" to be first
        const aIsSeerat = a.title.toLowerCase().includes('seerat ibn ishaq') || a.title_ar.includes('سيرة ابن إسحاق');
        const bIsSeerat = b.title.toLowerCase().includes('seerat ibn ishaq') || b.title_ar.includes('سيرة ابن إسحاق');
        
        if (aIsSeerat && !bIsSeerat) return -1;
        if (!aIsSeerat && bIsSeerat) return 1;
        return 0;
      });
      
      const others = filtered.filter(book => 
        !featuredBooks.some(featuredTitle => 
          book.title.toLowerCase().includes(featuredTitle.toLowerCase()) ||
          book.title_ar.includes(featuredTitle)
        )
      );
      
      setFilteredBooks([...featured, ...others]);
    } else {
      setFilteredBooks(filtered);
    }
  }, [searchQuery, selectedCategory, books, categories, isMobile]);

  // Filter categories based on search query
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setShowSearchResults(false);
    setCurrentPage(1);
  };

  const handleSearchFocus = () => {
    setShowSearchResults(true);
    if (!searchQuery.trim()) {
      setFilteredBooks(books);
    }
  };

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200);
  };

  const getBookUrl = (book) => {
    if (book.source === 'url') {
      return book.filename;
    }
    return `/epubs/${book.filename}`;
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleCloseReader = () => {
    setSelectedBook(null);
    setZoom(100);
    setCurrentPage(1);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleCategorySelect = (categoryId) => {
    console.log('Category selected:', categoryId);
    setSelectedCategory(categoryId);
    setSearchQuery('');
    
    // Close book when category is selected
    if (selectedBook) {
      setSelectedBook(null);
      setZoom(100);
      setCurrentPage(1);
    }
    
    // On mobile, delay closing sidebar to allow the selection to process
    if (isMobile) {
      setTimeout(() => {
        setSidebarCollapsed(true);
      }, 150);
    }
    
    // Force re-render by triggering the filtering effect
    console.log('Forcing category filter update for:', categoryId);
  };

  const handleOverlayClick = (e) => {
    // Only close sidebar if clicking directly on the overlay (not propagated from sidebar content)
    if (e.target === e.currentTarget) {
      setSidebarCollapsed(true);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-800 text-white rounded-full mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Loading Library...</h2>
          <p className="text-amber-700">Please wait while we load your books.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 flex relative">
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={handleOverlayClick}
          style={{ touchAction: 'manipulation' }}
        />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'mr-0' : isMobile ? 'mr-0' : 'mr-80'}`}>
        {!selectedBook ? (
          // Landing Page
          <div className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 pt-8 md:pt-16">
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="fixed top-4 right-4 z-50 p-2 bg-green-700 text-white rounded-lg shadow-lg"
                style={{ touchAction: 'manipulation' }}
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            {/* Logo and Branding */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-4 md:mb-6">
                <img 
                  src="/lovable-uploads/92c79d95-bbb5-40d0-9b0f-37bccec10dcd.png" 
                  alt="Deen Mastery Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-2">
                Deen Mastery
              </h1>
              <p className="text-amber-700 text-base md:text-lg italic">Knowledge Made Accessible</p>
            </div>

            {/* Search Section */}
            <div className="relative w-full max-w-md mb-6 md:mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder={showArabic ? "البحث في الكتب..." : "Search books..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className={`w-full px-4 py-3 text-base md:text-lg border-2 border-amber-800 rounded-lg focus:outline-none focus:border-amber-600 bg-white ${
                    showArabic ? 'pr-12 pl-4 text-right' : 'pl-4 pr-12 text-left'
                  }`}
                  dir={showArabic ? 'rtl' : 'ltr'}
                />
                <Search className={`absolute top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5 ${
                  showArabic ? 'left-3' : 'right-3'
                }`} />
              </div>
              
              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-amber-800 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.slice(0, 10).map((book, index) => (
                      <div
                        key={index}
                        onClick={() => handleBookSelect(book)}
                        className="px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-amber-200 last:border-b-0"
                      >
                        <div className="font-medium text-amber-900">
                          {showArabic ? book.title_ar : book.title}
                        </div>
                        <div className="text-sm text-amber-700">
                          by {showArabic ? book.author_ar : book.author}
                        </div>
                        <div className="text-xs text-amber-600 capitalize">{book.category}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-amber-600">
                      {showArabic ? "لم يتم العثور على كتب" : "No books found"}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Available Books Section */}
            <div className="w-full max-w-6xl">
              <div className="text-center mb-6">
                {/* Centered heading */}
                <h2 className="text-xl md:text-2xl font-bold text-amber-900">
                  {showArabic ? `الكتب المتاحة (${filteredBooks.length})` : `Available Books (${filteredBooks.length})`}
                </h2>
                {selectedCategory !== 'all' && (
                  <div className="text-base font-normal text-amber-700 mt-2">
                    {showArabic ? 'التصنيف:' : 'Category:'} {categories.find(cat => cat.id === selectedCategory)?.name}
                  </div>
                )}
                
                {/* Language Toggle - aligned to the right */}
                <div className="flex items-center justify-end gap-3 mt-4">
                  <span className="text-sm text-amber-700">English</span>
                  <div className="relative">
                    <Switch 
                      checked={showArabic} 
                      onCheckedChange={setShowArabic}
                      className="data-[state=checked]:bg-amber-600"
                    />
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-amber-600 font-medium">
                      {showArabic ? 'العربية' : 'EN'}
                    </span>
                  </div>
                  <span className="text-sm text-amber-700">العربية</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredBooks.map((book, index) => (
                  <div
                    key={index}
                    onClick={() => handleBookSelect(book)}
                    className="bg-white border-2 border-amber-200 rounded-lg p-3 md:p-4 hover:bg-amber-50 cursor-pointer transition-colors shadow-sm"
                  >
                    {/* Title section - reserve space for two lines minimum */}
                    <div className="font-medium text-amber-900 mb-2 text-sm md:text-base min-h-[2.5rem] flex items-start">
                      <div className="leading-tight break-words w-full overflow-wrap-anywhere">
                        {showArabic ? book.title_ar : book.title}
                      </div>
                    </div>
                    <div className="text-xs md:text-sm text-amber-700 mb-2">
                      by {showArabic ? book.author_ar : book.author}
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-amber-600 uppercase">{book.type}</div>
                      <div className="text-xs text-amber-600 capitalize bg-amber-100 px-2 py-1 rounded">{book.category}</div>
                    </div>
                  </div>
                ))}
              </div>
              {filteredBooks.length === 0 && !loading && (
                <div className="text-center mt-8">
                  <p className="text-amber-700">
                    {showArabic ? "لم يتم العثور على كتب للتصنيف أو البحث المحدد." : "No books found for the selected category or search term."}
                  </p>
                  {selectedCategory !== 'all' && (
                    <button 
                      onClick={() => handleCategorySelect('all')}
                      className="mt-2 text-amber-600 hover:text-amber-800 underline"
                    >
                      {showArabic ? "عرض جميع الكتب" : "Show all books"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          // Book Reader Component
          <BookReader 
            book={selectedBook} 
            onClose={handleCloseReader}
            showArabic={showArabic}
          />
        )}
      </div>

      {/* Right Sidebar */}
      <div className={`fixed right-0 top-0 h-full bg-green-700 text-white flex flex-col transition-all duration-300 z-40 ${
        sidebarCollapsed ? 'w-16' : 'w-80'
      } ${isMobile && sidebarCollapsed ? 'translate-x-full' : ''}`}>
        
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="absolute -left-4 top-6 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors z-50"
          style={{ touchAction: 'manipulation' }}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? '' : 'rotate-180'}`} />
        </button>

        {/* Sidebar Header */}
        <div className={`p-4 md:p-6 border-b border-green-600 ${sidebarCollapsed ? 'px-2' : ''}`}>
          <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded mb-4">
            <span className="text-xl font-bold">▶</span>
          </div>
          {!sidebarCollapsed && (
            <div className="bg-white text-green-800 px-3 py-1 rounded text-center text-sm font-medium">
              Search Categories
            </div>
          )}
        </div>

        {/* Categories Section with Search */}
        {!sidebarCollapsed && (
          <div className="p-4 md:p-6 flex-1 overflow-y-auto">
            {/* Category Search */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={categorySearchQuery}
                  onChange={(e) => setCategorySearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-green-500 rounded bg-green-600 text-white placeholder-green-200 focus:outline-none focus:border-green-300"
                />
                <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 text-green-200 w-4 h-4" />
              </div>
            </div>

            {/* Categories Header with Language Toggle */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-bold">Filter by Category</h3>
              
              {/* Language Toggle in Sidebar - synchronized with main toggle */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-200">EN</span>
                <div className="relative">
                  <Switch 
                    checked={showArabic} 
                    onCheckedChange={setShowArabic}
                    className="data-[state=checked]:bg-green-800 data-[state=unchecked]:bg-green-600 scale-75"
                  />
                </div>
                <span className="text-xs text-green-200">AR</span>
              </div>
            </div>

            <div className="space-y-2">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onTouchStart={(e) => {
                    // Prevent event bubbling on touch start
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Category button clicked:', category.id, category.name);
                    handleCategorySelect(category.id);
                  }}
                  className={`w-full text-left px-3 py-3 rounded text-sm hover:bg-green-600 transition-colors ${
                    selectedCategory === category.id ? 'bg-green-600' : ''
                  }`}
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    touchAction: 'manipulation'
                  }}
                >
                  <div className="flex items-center pointer-events-none">
                    <category.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{category.name}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Show message when no categories found */}
            {filteredCategories.length === 0 && categorySearchQuery && (
              <div className="text-center text-green-200 mt-4">
                No categories found for "{categorySearchQuery}"
              </div>
            )}

            {/* About section */}
            <div className="mt-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">About</h3>
              <p className="text-green-100 text-sm leading-relaxed">
                This digital library offers carefully curated books and documents. 
                Browse by category or use search to find specific titles.
              </p>
            </div>
          </div>
        )}

        {/* Collapsed Categories */}
        {sidebarCollapsed && (
          <div className="p-2 flex-1 overflow-y-auto">
            <div className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Collapsed category button clicked:', category.id, category.name);
                    handleCategorySelect(category.id);
                  }}
                  className={`w-full p-3 rounded hover:bg-green-600 transition-colors ${
                    selectedCategory === category.id ? 'bg-green-600' : ''
                  }`}
                  title={category.name}
                  style={{ 
                    WebkitTapHighlightColor: 'transparent',
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    touchAction: 'manipulation'
                  }}
                >
                  <category.icon className="w-5 h-5 mx-auto pointer-events-none" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact & Social Media Links */}
        <div className={`p-4 md:p-6 border-t border-green-600 ${sidebarCollapsed ? 'px-2' : ''}`}>
          {!sidebarCollapsed && (
            <>
              <div className="text-xs text-green-200 mb-3">Contact & Social Media</div>
              {/* Social Media Icons in Single Row */}
              <div className="flex justify-between gap-2 mb-4">
                <div className="w-16 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                  <Facebook className="w-4 h-4" />
                </div>
                <div className="w-16 h-8 bg-red-600 rounded flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors">
                  <Youtube className="w-4 h-4" />
                </div>
                <div className="w-16 h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                  <Twitter className="w-4 h-4" />
                </div>
                <div className="w-16 h-8 bg-sky-500 rounded flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors">
                  <span className="text-xs font-bold">☁</span>
                </div>
              </div>
              
              {/* Contact Info */}
              <div className="p-3 bg-green-600 rounded">
                <div className="text-xs text-green-200 mb-2">Contact Info</div>
                <div className="text-xs text-white">
                  Email: contact@deenmastery.com
                </div>
              </div>
            </>
          )}
          
          {/* Collapsed Social Icons */}
          {sidebarCollapsed && (
            <div className="space-y-2">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors mx-auto" title="Facebook">
                <Facebook className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors mx-auto" title="YouTube">
                <Youtube className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors mx-auto" title="Twitter">
                <Twitter className="w-4 h-4" />
              </div>
              <div className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors mx-auto" title="Bluesky">
                <span className="text-xs font-bold">☁</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
