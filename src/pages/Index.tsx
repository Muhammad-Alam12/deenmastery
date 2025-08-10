"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, ChevronLeft, Menu, BookOpen, Facebook, Youtube, Twitter, Info, Mail } from 'lucide-react'
import { Switch } from "@/components/ui/switch"
import BookReader from "@/components/BookReader"
import ContactPage from "@/components/ContactPage"
import AboutPage from "@/components/AboutPage"

interface Book {
  title_ar: string
  author_ar: string
  title_en?: string
  author_en?: string
  filename: string
  filename_ar?: string
  filename_en?: string
  coverText: string
  type: string
  source?: string
  category: string
  id: number
  featured?: boolean
}

// Google Analytics 4 Configuration
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Initialize Google Analytics
(function() {
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=G-HN1BLRMQCS';
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', 'G-HN1BLRMQCS');
})();

const Index = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isMobile, setIsMobile] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: any }>>([])
  const [loading, setLoading] = useState(true)
  const [showArabic, setShowArabic] = useState(false)
  const [categorySearchQuery, setCategorySearchQuery] = useState("")
  const [featuredBooks, setFeaturedBooks] = useState<string[]>([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const [currentPage, setCurrentPage] = useState<"home" | "contact" | "about">("home")
  const [currentLanguage, setCurrentLanguage] = useState<"arabic" | "english" | "spanish" | "german" | "portuguese" | "urdu" | "turkish" | "bahasa">("english")
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const mainContentRef = useRef<HTMLDivElement>(null)

  // Language configurations with translations
  const languageConfig = {
    arabic: { 
      code: 'ar', 
      name: 'العربية', 
      direction: 'rtl',
      translations: {
        searchPlaceholder: "البحث في الكتب...",
        availableBooks: "الكتب المتاحة",
        category: "التصنيف:",
        noBooks: "لم يتم العثور على كتب للتصنيف أو البحث المحدد.",
        showAllBooks: "عرض جميع الكتب",
        byAuthor: "بقلم",
        featured: "مميز",
        home: "الرئيسية",
        about: "عنا",
        contact: "اتصل بنا",
        language: "اللغة"
      }
    },
    english: { 
      code: 'en', 
      name: 'English', 
      direction: 'ltr',
      translations: {
        searchPlaceholder: "Search books...",
        availableBooks: "Available Books",
        category: "Category:",
        noBooks: "No books found for the selected category or search term.",
        showAllBooks: "Show all books",
        byAuthor: "by",
        featured: "Featured",
        home: "Home",
        about: "About",
        contact: "Contact",
        language: "Language"
      }
    },
    spanish: { 
      code: 'es', 
      name: 'Español', 
      direction: 'ltr',
      translations: {
        searchPlaceholder: "Buscar libros...",
        availableBooks: "Libros Disponibles",
        category: "Categoría:",
        noBooks: "No se encontraron libros para la categoría o término de búsqueda seleccionado.",
        showAllBooks: "Mostrar todos los libros",
        byAuthor: "por",
        featured: "Destacado",
        home: "Inicio",
        about: "Acerca de",
        contact: "Contacto",
        language: "Idioma"
      }
    },
    german: { 
      code: 'de', 
      name: 'Deutsch', 
      direction: 'ltr',
      translations: {
        searchPlaceholder: "Bücher suchen...",
        availableBooks: "Verfügbare Bücher",
        category: "Kategorie:",
        noBooks: "Keine Bücher für die ausgewählte Kategorie oder den Suchbegriff gefunden.",
        showAllBooks: "Alle Bücher anzeigen",
        byAuthor: "von",
        featured: "Empfohlen",
        home: "Startseite",
        about: "Über uns",
        contact: "Kontakt",
        language: "Sprache"
      }
    },
    portuguese: { 
      code: 'pt', 
      name: 'Português', 
      direction: 'ltr',
      translations: {
        searchPlaceholder: "Pesquisar livros...",
        availableBooks: "Livros Disponíveis",
        category: "Categoria:",
        noBooks: "Nenhum livro encontrado para a categoria ou termo de pesquisa selecionado.",
        showAllBooks: "Mostrar todos os livros",
        byAuthor: "por",
        featured: "Destaque",
        home: "Início",
        about: "Sobre",
        contact: "Contato",
        language: "Idioma"
      }
    },
    urdu: { 
      code: 'ur', 
      name: 'اردو', 
      direction: 'rtl',
      translations: {
        searchPlaceholder: "کتابیں تلاش کریں...",
        availableBooks: "دستیاب کتابیں",
        category: "قسم:",
        noBooks: "منتخب کردہ قسم یا تلاش کی اصطلاح کے لیے کوئی کتاب نہیں ملی۔",
        showAllBooks: "تمام کتابیں دکھائیں",
        byAuthor: "بذریعہ",
        featured: "نمایاں",
        home: "گھر",
        about: "ہمارے بارے میں",
        contact: "رابطہ",
        language: "زبان"
      }
    },
    turkish: { 
      code: 'tr', 
      name: 'Türkçe', 
      direction: 'ltr',
      translations: {
        searchPlaceholder: "Kitap ara...",
        availableBooks: "Mevcut Kitaplar",
        category: "Kategori:",
        noBooks: "Seçilen kategori veya arama terimi için kitap bulunamadı.",
        showAllBooks: "Tüm kitapları göster",
        byAuthor: "tarafından",
        featured: "Öne Çıkan",
        home: "Ana Sayfa",
        about: "Hakkında",
        contact: "İletişim",
        language: "Dil"
      }
    },
    bahasa: { 
      code: 'id', 
      name: 'Bahasa', 
      direction: 'ltr',
      translations: {
        searchPlaceholder: "Cari buku...",
        availableBooks: "Buku Tersedia",
        category: "Kategori:",
        noBooks: "Tidak ada buku yang ditemukan untuk kategori atau istilah pencarian yang dipilih.",
        showAllBooks: "Tampilkan semua buku",
        byAuthor: "oleh",
        featured: "Unggulan",
        home: "Beranda",
        about: "Tentang",
        contact: "Kontak",
        language: "Bahasa"
      }
    }
  }

  // Get current translations
  const t = languageConfig[currentLanguage].translations
  const isRTL = languageConfig[currentLanguage].direction === 'rtl'

  // Google Analytics 4 setup
  useEffect(() => {
    // Add GA4 script to head
    const script1 = document.createElement("script")
    script1.async = true
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
    document.head.appendChild(script1)

    const script2 = document.createElement("script")
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-XXXXXXXXXX', {
        page_title: 'Deen Mastery Library',
        page_location: window.location.href,
        custom_map: {
          custom_parameter_1: 'session_id'
        }
      });
    `
    document.head.appendChild(script2)

    // Track initial page load with session data
    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "page_view", {
        page_title: "Library Home",
        page_location: window.location.href,
        session_id: sessionId,
        user_language: currentLanguage,
        timestamp: new Date().toISOString()
      })

      window.gtag("event", "session_start", {
        session_id: sessionId,
        timestamp: new Date().toISOString()
      })
    }

    return () => {
      document.head.removeChild(script1)
      document.head.removeChild(script2)
    }
  }, [sessionId, currentLanguage])

  // Enhanced user flow tracking
  const trackUserFlow = (action: string, category: string, label?: string, value?: number, additionalData?: any) => {
    if (window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
        session_id: sessionId,
        user_language: currentLanguage,
        current_page: currentPage,
        timestamp: new Date().toISOString(),
        ...additionalData
      })
    }
    
    // Also log to console for debugging
    console.log(`🔍 User Flow: ${action}`, {
      category,
      label,
      value,
      session_id: sessionId,
      current_page: currentPage,
      ...additionalData
    })
  }

  // Handle mobile back button
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (selectedBook) {
        event.preventDefault()
        setSelectedBook(null)
        trackUserFlow("back_button", "navigation", "mobile_back")
        return false
      }
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [selectedBook])

  // Load featured books
  useEffect(() => {
    const loadFeaturedBooks = async () => {
      try {
        const response = await fetch("/featured-books.json")
        if (response.ok) {
          const featured = await response.json()
          setFeaturedBooks(featured)
        }
      } catch (error) {
        console.warn("Could not load featured books:", error)
        // Fallback featured books
        setFeaturedBooks(["الورقة النحوية", "نواقض الإسلام", "المنظومة البيقونية", "أبناؤنا والصلاة"])
      }
    }

    loadFeaturedBooks()
  }, [])

  // Load books from manifest.json
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setLoading(true)
        console.log("Loading books from manifest...")
        trackUserFlow("data_load_start", "library", "books_loading")

        const response = await fetch("/epubs/manifest.json")
        if (!response.ok) {
          throw new Error(`Failed to fetch manifest: ${response.status}`)
        }

        const manifestBooks = await response.json()
        console.log("Loaded books from manifest:", manifestBooks.length)

        // Transform the books to ensure consistent structure
        const transformedBooks: Book[] = manifestBooks.map((book: any, index: number) => ({
          title_ar: book.title_ar || "عنوان غير معروف",
          author_ar: book.author_ar || "مؤلف غير معروف",
          title_en: book.title_en || book.title_ar || "Unknown Title",
          author_en: book.author_en || book.author_ar || "Unknown Author",
          filename: book.filename || book.filename_ar || book.filename_en || "",
          filename_ar: book.filename_ar || book.filename,
          filename_en: book.filename_en || book.filename,
          coverText: book.coverText || "كتاب",
          type: book.type || "epub",
          source: book.source || "local",
          category: book.category || "Miscellaneous",
          id: book.id || index + 1,
          featured: book.featured || false,
        }))

        console.log("Transformed books:", transformedBooks.length)

        setBooks(transformedBooks)
        setLoading(false)
        trackUserFlow("data_loaded", "library", "books_count", transformedBooks.length)
      } catch (error) {
        console.error("Failed to load books from manifest:", error)
        trackUserFlow("error", "library", "failed_to_load_books", 0, { error: error.message })
        setLoading(false)
      }
    }

    loadBooks()
  }, [])

  // Load categories from books data
  useEffect(() => {
    if (books.length > 0) {
      const uniqueCategories = [...new Set(books.map((book) => book.category.trim()))]
      console.log("📚 Unique categories found in books:", uniqueCategories)

      const categoriesWithIcons = [
        { id: "all", name: "All Books", icon: BookOpen },
        ...uniqueCategories.map((name: string) => ({
          id: name.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF]/g, "-"),
          name: name,
          icon: BookOpen,
        })),
      ]

      setCategories(categoriesWithIcons)
      console.log("Categories loaded:", categoriesWithIcons.length)
    }
  }, [books])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Restore scroll position when returning from book reader
  useEffect(() => {
    if (!selectedBook && currentPage === "home") {
      const savedPosition = sessionStorage.getItem("libraryScrollPosition")
      if (savedPosition && mainContentRef.current) {
        setTimeout(() => {
          mainContentRef.current?.scrollTo(0, Number.parseInt(savedPosition))
        }, 100)
        sessionStorage.removeItem("libraryScrollPosition")
      }
    }
  }, [selectedBook, currentPage])

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        setScrollPosition(mainContentRef.current.scrollTop)
      }
    }

    const mainContent = mainContentRef.current
    if (mainContent) {
      mainContent.addEventListener("scroll", handleScroll)
      return () => mainContent.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Filter books based on category and search - FIXED LOGIC
  useEffect(() => {
    console.log("Filtering books - Category:", selectedCategory, "Search:", searchQuery, "Language:", currentLanguage)
    let filtered = [...books]

    // Filter by category first
    if (selectedCategory !== "all") {
      const categoryObj = categories.find((cat) => cat.id === selectedCategory)
      const categoryName = categoryObj ? categoryObj.name : selectedCategory
      console.log("Filtering by category:", categoryName)

      filtered = filtered.filter((book) => {
        // Exact matching with normalization
        const bookCategory = book.category.trim()
        const targetCategory = categoryName.trim()
        const exactMatch = bookCategory.toLowerCase() === targetCategory.toLowerCase()

        if (exactMatch) {
          console.log("✅ Book matches category:", book.title_ar, "->", book.category)
        }
        return exactMatch
      })

      console.log("Books after category filter:", filtered.length)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (book) =>
          book.title_ar.toLowerCase().includes(query) ||
          book.author_ar.toLowerCase().includes(query) ||
          (book.title_en && book.title_en.toLowerCase().includes(query)) ||
          (book.author_en && book.author_en.toLowerCase().includes(query)) ||
          book.category.toLowerCase().includes(query),
      )
      console.log("Books after search filter:", filtered.length)
      trackUserFlow("search", "library", searchQuery, filtered.length)
    } else if (selectedCategory === "all") {
      // Only sort by featured books when showing all books and no search
      filtered = filtered.sort((a, b) => {
        const aIsFeatured = featuredBooks.some((title) => a.title_ar.includes(title))
        const bIsFeatured = featuredBooks.some((title) => b.title_ar.includes(title))

        if (aIsFeatured && !bIsFeatured) return -1
        if (!aIsFeatured && bIsFeatured) return 1

        return a.title_ar.localeCompare(b.title_ar, "ar")
      })
    }

    setFilteredBooks(filtered)
  }, [searchQuery, selectedCategory, books, categories, featuredBooks, currentLanguage])

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase()),
  )

  const handleBookSelect = (book: Book) => {
    console.log("Book selected for reading:", book)
    setSelectedBook(book)
    setShowSearchResults(false)
    trackUserFlow("book_open", "reading", isRTL ? book.title_ar : book.title_en || book.title_ar, 0, {
      book_id: book.id,
      book_category: book.category,
      scroll_position: scrollPosition
    })

    // Push state for mobile back button handling
    window.history.pushState({ bookSelected: true }, "", window.location.href)
  }

  const handleSearchFocus = () => {
    setShowSearchResults(true)
    trackUserFlow("search_focus", "interaction", "search_bar")
  }

  const handleSearchBlur = () => {
    setTimeout(() => setShowSearchResults(false), 200)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value.length > 2) {
      trackUserFlow("search_input", "search", value, value.length)
    }
  }

  const handleCloseReader = () => {
    const bookTitle = selectedBook ? (isRTL ? selectedBook.title_ar : selectedBook.title_en || selectedBook.title_ar) : "unknown"
    setSelectedBook(null)
    trackUserFlow("book_close", "reading", bookTitle)
    // Go back in history to handle mobile back button
    if (window.history.state?.bookSelected) {
      window.history.back()
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
    trackUserFlow("sidebar_toggle", "interface", sidebarCollapsed ? "open" : "close")
  }

  const handleCategorySelect = (categoryId: string) => {
    console.log("Category selected:", categoryId)
    setSelectedCategory(categoryId)
    setSearchQuery("")
    setCurrentPage("home")
    trackUserFlow("category_select", "navigation", categoryId)

    if (selectedBook) {
      setSelectedBook(null)
    }

    if (isMobile) {
      setTimeout(() => {
        setSidebarCollapsed(true)
      }, 150)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSidebarCollapsed(true)
    }
  }

  const handlePageChange = (page: "home" | "contact" | "about") => {
    const previousPage = currentPage
    setCurrentPage(page)
    setSelectedBook(null)
    setSearchQuery("")
    trackUserFlow("page_view", "navigation", page, 0, { from_page: previousPage })
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }

  const handleLanguageChange = (language: keyof typeof languageConfig) => {
    const previousLanguage = currentLanguage
    setCurrentLanguage(language)
    setShowArabic(language === "arabic" || language === "urdu")
    trackUserFlow("language_change", "interface", language, 0, { 
      from_language: previousLanguage,
      to_language: language
    })
  }

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
    )
  }

  return (
    <div className="min-h-screen bg-amber-50 flex relative">
      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={handleOverlayClick}
          style={{ touchAction: "manipulation" }}
        />
      )}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "mr-0" : isMobile ? "mr-0" : "mr-80"}`}
      >
        {selectedBook ? (
          // Book Reader Component
          <BookReader
            book={selectedBook}
            onClose={handleCloseReader}
            showArabic={isRTL}
            scrollPosition={scrollPosition}
            onUserAction={trackUserFlow}
            currentLanguage={currentLanguage}
          />
        ) : currentPage === "contact" ? (
          <ContactPage onBack={() => handlePageChange("home")} />
        ) : currentPage === "about" ? (
          <AboutPage onBack={() => handlePageChange("home")} onCategorySelect={handleCategorySelect} />
        ) : (
          // Landing Page
          <div
            ref={mainContentRef}
            className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 pt-8 md:pt-16 overflow-auto"
            dir={isRTL ? "rtl" : "ltr"}
          >
            {/* Mobile Menu Button */}
            {isMobile && (
              <button
                onClick={() => {
                  trackUserFlow("mobile_menu", "interface", "toggle")
                  toggleSidebar()
                }}
                className="fixed top-4 right-4 z-50 p-2 bg-green-700 text-white rounded-lg shadow-lg"
                style={{ touchAction: "manipulation" }}
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
              <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-2">Deen Mastery</h1>
              <p className="text-amber-700 text-base md:text-lg italic">Knowledge Made Accessible</p>
            </div>

            {/* Search Section */}
            <div className="relative w-full max-w-md mb-6 md:mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleSearchFocus}
                  onBlur={handleSearchBlur}
                  className={`w-full px-4 py-3 text-base md:text-lg border-2 border-amber-800 rounded-lg focus:outline-none focus:border-amber-600 bg-white ${
                    isRTL ? "pr-12 pl-4 text-right" : "pl-4 pr-12 text-left"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                />
                <Search
                  className={`absolute top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5 ${
                    isRTL ? "left-3" : "right-3"
                  }`}
                />
              </div>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-amber-800 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                  {filteredBooks.length > 0 ? (
                    filteredBooks.slice(0, 10).map((book, index) => (
                      <div
                        key={book.id || index}
                        onClick={() => {
                          trackUserFlow("search_result_click", "interaction", book.title_ar, index)
                          handleBookSelect(book)
                        }}
                        className="px-4 py-3 hover:bg-amber-50 cursor-pointer border-b border-amber-200 last:border-b-0"
                      >
                        <div className="font-medium text-amber-900" dir={isRTL ? "rtl" : "ltr"}>
                          {isRTL ? book.title_ar : book.title_en}
                        </div>
                        <div className="text-sm text-amber-700" dir={isRTL ? "rtl" : "ltr"}>
                          {isRTL ? `${t.byAuthor} ${book.author_ar}` : `${t.byAuthor} ${book.author_en}`}
                        </div>
                        <div className="text-xs text-amber-600 capitalize">{book.category}</div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-amber-600">
                      {t.noBooks}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Available Books Section */}
            <div className="w-full max-w-6xl pb-16">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-amber-900">
                  {`${t.availableBooks} (${filteredBooks.length})`}
                </h2>
                {selectedCategory !== "all" && (
                  <div className="text-base font-normal text-amber-700 mt-2">
                    {t.category}{" "}
                    {categories.find((cat) => cat.id === selectedCategory)?.name}
                  </div>
                )}

                {/* Fixed Language Toggle - Always stays on right side */}
                <div className="flex items-center justify-end gap-3 mt-4" dir="ltr">
                  <span className="text-sm text-amber-700">English</span>
                  <div className="relative">
                    <Switch
                      checked={isRTL}
                      onCheckedChange={(checked) => {
                        handleLanguageChange(checked ? "arabic" : "english")
                      }}
                      className="data-[state=checked]:bg-amber-600"
                    />
                    <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-amber-600 font-medium">
                      {isRTL ? "العربية" : "EN"}
                    </span>
                  </div>
                  <span className="text-sm text-amber-700">العربية</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredBooks.map((book, index) => {
                  const isFeatured =
                    featuredBooks.some((title) => book.title_ar.includes(title)) &&
                    !searchQuery.trim() &&
                    selectedCategory === "all"

                  return (
                    <div
                      key={book.id || index}
                      onClick={() => {
                        trackUserFlow("book_card_click", "interaction", book.title_ar, index)
                        handleBookSelect(book)
                      }}
                      className={`bg-white border-2 rounded-lg p-3 md:p-4 hover:bg-amber-50 cursor-pointer transition-colors shadow-sm ${
                        isFeatured ? "border-amber-400 ring-2 ring-amber-200" : "border-amber-200"
                      }`}
                    >
                      {isFeatured && (
                        <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded mb-2 text-center font-medium">
                          ⭐ {t.featured}
                        </div>
                      )}

                      <div className="font-medium text-amber-900 mb-2 text-sm md:text-base min-h-[2.5rem] flex items-start">
                        <div
                          className="leading-tight break-words w-full overflow-wrap-anywhere"
                          dir={isRTL ? "rtl" : "ltr"}
                        >
                          {isRTL ? book.title_ar : book.title_en}
                        </div>
                      </div>

                      <div className="text-xs md:text-sm text-amber-700 mb-2" dir={isRTL ? "rtl" : "ltr"}>
                        {isRTL ? `${t.byAuthor} ${book.author_ar}` : `${t.byAuthor} ${book.author_en}`}
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="text-xs text-amber-600 uppercase">{book.type}</div>
                        <div className="text-xs text-amber-600 capitalize bg-amber-100 px-2 py-1 rounded max-w-[120px] truncate">
                          {book.category}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredBooks.length === 0 && !loading && (
                <div className="text-center mt-8">
                  <div className="text-6xl mb-4">📚</div>
                  <p className="text-amber-700 mb-4">
                    {t.noBooks}
                  </p>
                  {selectedCategory !== "all" && (
                    <button
                      onClick={() => {
                        trackUserFlow("show_all_books", "interaction", "no_results")
                        handleCategorySelect("all")
                      }}
                      className="mt-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                    >
                      {t.showAllBooks}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar (Fixed position regardless of RTL) */}
      <div
        className={`fixed right-0 top-0 h-full bg-green-700 text-white flex flex-col transition-all duration-300 z-40 ${
          sidebarCollapsed ? "w-16" : "w-80"
        } ${isMobile && sidebarCollapsed ? "translate-x-full" : ""}`}
      >
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={`absolute -left-4 top-6 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-500 transition-colors z-50`}
          style={{ touchAction: "manipulation" }}
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`} />
        </button>

        {/* Sidebar Header */}
        <div className={`p-4 md:p-6 border-b border-green-600 ${sidebarCollapsed ? "px-2" : ""}`}>
          <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded mb-4">
            <BookOpen className="w-6 h-6" />
          </div>
          {!sidebarCollapsed && (
            <div className="bg-white text-green-800 px-3 py-1 rounded text-center text-sm font-medium">
              Browse Categories
            </div>
          )}
        </div>

        {/* Categories Section with Search */}
        {!sidebarCollapsed && (
          <div className="p-4 md:p-6 flex-1 overflow-y-auto">
            {/* Language Selection */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">{t.language} / اللغة</h3>
              <div className="grid grid-cols-2 gap-1">
                {Object.entries(languageConfig).map(([key, lang]) => (
                  <button
                    key={key}
                    onClick={() => {
                      trackUserFlow("language_select", "interface", key)
                      handleLanguageChange(key as keyof typeof languageConfig)
                    }}
                    className={`text-xs p-2 rounded transition-colors ${
                      currentLanguage === key
                        ? "bg-green-600 text-white"
                        : "bg-green-800 hover:bg-green-600 text-green-100"
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation Links */}
            <div className="mb-6">
              <h3 className="text-lg font-bold mb-3">Navigation</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    trackUserFlow("nav_home", "navigation", "sidebar")
                    handlePageChange("home")
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors ${
                    currentPage === "home" ? "bg-green-600" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 mr-2" />
                    <span>{t.home}</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    trackUserFlow("nav_about", "navigation", "sidebar")
                    handlePageChange("about")
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors ${
                    currentPage === "about" ? "bg-green-600" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    <span>{t.about}</span>
                  </div>
                </button>
                <button
                  onClick={() => {
                    trackUserFlow("nav_contact", "navigation", "sidebar")
                    handlePageChange("contact")
                  }}
                  className={`w-full text-left px-3 py-2 rounded text-sm hover:bg-green-600 transition-colors ${
                    currentPage === "contact" ? "bg-green-600" : ""
                  }`}
                >
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{t.contact}</span>
                  </div>
                </button>
              </div>
            </div>

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

            {/* Categories Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-bold">Filter by Category</h3>
            </div>

            <div className="space-y-2">
              {filteredCategories.map((category) => {
                // Count books in this category with exact matching
                const bookCount =
                  category.id === "all"
                    ? books.length
                    : books.filter((book) => {
                        const bookCategory = book.category.trim().toLowerCase()
                        const targetCategory = category.name.trim().toLowerCase()
                        return bookCategory === targetCategory
                      }).length

                return (
                  <button
                    key={category.id}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      trackUserFlow("category_sidebar_select", "navigation", category.name)
                      handleCategorySelect(category.id)
                    }}
                    className={`w-full text-left px-3 py-3 rounded text-sm hover:bg-green-600 transition-colors ${
                      selectedCategory === category.id ? "bg-green-600" : ""
                    }`}
                    style={{
                      WebkitTapHighlightColor: "transparent",
                      WebkitUserSelect: "none",
                      userSelect: "none",
                      touchAction: "manipulation",
                    }}
                  >
                    <div className="flex items-center justify-between pointer-events-none">
                      <div className="flex items-center min-w-0 flex-1">
                        <category.icon className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{category.name}</span>
                      </div>
                      <span className="text-xs bg-green-600 px-2 py-1 rounded ml-2 flex-shrink-0">{bookCount}</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {filteredCategories.length === 0 && categorySearchQuery && (
              <div className="text-center text-green-200 mt-4">No categories found for "{categorySearchQuery}"</div>
            )}

            <div className="mt-6">
              <h3 className="text-lg md:text-xl font-bold mb-4">About</h3>
              <p className="text-green-100 text-sm leading-relaxed">
                This digital library offers carefully curated Islamic books and documents. Browse by category or use
                search to find specific titles. All books are available in Arabic with English translations where
                available.
              </p>
            </div>
          </div>
        )}

        {/* Collapsed Categories */}
        {sidebarCollapsed && (
          <div className="p-2 flex-1 overflow-y-auto">
            <div className="space-y-2">
              <button
                onClick={() => {
                  trackUserFlow("nav_home_collapsed", "navigation", "sidebar")
                  handlePageChange("home")
                }}
                className={`w-full p-3 rounded hover:bg-green-600 transition-colors ${
                  currentPage === "home" ? "bg-green-600" : ""
                }`}
                title="Home"
              >
                <BookOpen className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => {
                  trackUserFlow("nav_about_collapsed", "navigation", "sidebar")
                  handlePageChange("about")
                }}
                className={`w-full p-3 rounded hover:bg-green-600 transition-colors ${
                  currentPage === "about" ? "bg-green-600" : ""
                }`}
                title="About Us"
              >
                <Info className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => {
                  trackUserFlow("nav_contact_collapsed", "navigation", "sidebar")
                  handlePageChange("contact")
                }}
                className={`w-full p-3 rounded hover:bg-green-600 transition-colors ${
                  currentPage === "contact" ? "bg-green-600" : ""
                }`}
                title="Contact Us"
              >
                <Mail className="w-5 h-5 mx-auto" />
              </button>
              {categories.slice(0, 3).map((category) => (
                <button
                  key={category.id}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    trackUserFlow("category_collapsed_select", "navigation", category.name)
                    handleCategorySelect(category.id)
                  }}
                  className={`w-full p-3 rounded hover:bg-green-600 transition-colors ${
                    selectedCategory === category.id ? "bg-green-600" : ""
                  }`}
                  title={category.name}
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    WebkitUserSelect: "none",
                    userSelect: "none",
                    touchAction: "manipulation",
                  }}
                >
                  <category.icon className="w-5 h-5 mx-auto pointer-events-none" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Contact & Social Media Links */}
        <div className={`p-4 md:p-6 border-t border-green-600 ${sidebarCollapsed ? "px-2" : ""}`}>
          {!sidebarCollapsed && (
            <>
              <div className="text-xs text-green-200 mb-3">Contact & Social Media</div>
              <div className="flex justify-between gap-2 mb-4">
                <div 
                  className="w-16 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                  onClick={() => trackUserFlow("social_click", "interaction", "facebook")}
                >
                  <Facebook className="w-4 h-4" />
                </div>
                <div 
                  className="w-16 h-8 bg-red-600 rounded flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors"
                  onClick={() => trackUserFlow("social_click", "interaction", "youtube")}
                >
                  <Youtube className="w-4 h-4" />
                </div>
                <div 
                  className="w-16 h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors"
                  onClick={() => trackUserFlow("social_click", "interaction", "twitter")}
                >
                  <Twitter className="w-4 h-4" />
                </div>
                <div 
                  className="w-16 h-8 bg-sky-500 rounded flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors"
                  onClick={() => trackUserFlow("social_click", "interaction", "bluesky")}
                >
                  <span className="text-xs font-bold">☁</span>
                </div>
              </div>

              <div className="p-3 bg-green-600 rounded">
                <div className="text-xs text-green-200 mb-2">Contact Info</div>
                <div className="text-xs text-white">Email: contact@deenmastery.com</div>
              </div>
            </>
          )}

          {sidebarCollapsed && (
            <div className="space-y-2">
              <div
                className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors mx-auto"
                title="Facebook"
                onClick={() => trackUserFlow("social_click_collapsed", "interaction", "facebook")}
              >
                <Facebook className="w-4 h-4" />
              </div>
              <div
                className="w-8 h-8 bg-red-600 rounded flex items-center justify-center cursor-pointer hover:bg-red-700 transition-colors mx-auto"
                title="YouTube"
                onClick={() => trackUserFlow("social_click_collapsed", "interaction", "youtube")}
              >
                <Youtube className="w-4 h-4" />
              </div>
              <div
                className="w-8 h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors mx-auto"
                title="Twitter"
                onClick={() => trackUserFlow("social_click_collapsed", "interaction", "twitter")}
              >
                <Twitter className="w-4 h-4" />
              </div>
              <div
                className="w-8 h-8 bg-sky-500 rounded flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors mx-auto"
                title="Bluesky"
                onClick={() => trackUserFlow("social_click_collapsed", "interaction", "bluesky")}
              >
                <span className="text-xs font-bold">☁</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Index