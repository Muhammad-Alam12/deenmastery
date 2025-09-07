"use client"

import type React from "react"

import { useState, useEffect, useRef, useMemo } from "react"
import { Search, BookOpen, Facebook, Youtube, Twitter, Info, Mail, Home, Globe, X } from "lucide-react"
import BookReader from "@/components/BookReader"
import ContactPage from "@/components/ContactPage"
import AboutPage from "@/components/AboutPage"

interface Book {
  title_ar: string
  author_ar: string
  title_en?: string
  author_en?: string
  title_es?: string
  author_es?: string
  title_de?: string
  author_de?: string
  title_pt?: string
  author_pt?: string
  title_ur?: string
  author_ur?: string
  title_tr?: string
  author_tr?: string
  title_id?: string
  author_id?: string
  filename: string
  filename_ar?: string
  filename_en?: string
  filename_es?: string
  filename_de?: string
  filename_pt?: string
  filename_ur?: string
  filename_tr?: string
  filename_id?: string
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
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

const Index = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isMobile, setIsMobile] = useState(false)
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon: any }>>([])
  const [loading, setLoading] = useState(true)
  const [categorySearchQuery, setCategorySearchQuery] = useState("")
  const [featuredBooks, setFeaturedBooks] = useState<string[]>([])
  const [scrollPosition, setScrollPosition] = useState(0)
  const [currentPage, setCurrentPage] = useState<"home" | "contact" | "about">("home")
  const [currentLanguage, setCurrentLanguage] = useState<
    "arabic" | "english" | "spanish" | "german" | "portuguese" | "urdu" | "turkish" | "bahasa"
  >("english")
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const mainContentRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Language configurations with translations
  const languageConfig = {
    arabic: {
      code: "ar",
      name: "العربية",
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
        language: "اللغة",
        browseCategories: "تصفح الفئات",
        filterByCategory: "تصفية حسب الفئة",
        contactSocialMedia: "التواصل ووسائل التواصل الاجتماعي",
        contactInfo: "معلومات الاتصال",
        email: "البريد الإلكتروني: contact@deenmastery.com",
        knowledgeMadeAccessible: "المعرفة في متناول الجميع",
        deenMastery: "إتقان الدين",
        closeSidebar: "إغلاق الشريط الجانبي",
        searchingFor: "البحث عن:",
        clearSearch: "مسح البحث",
      },
    },
    english: {
      code: "en",
      name: "English",
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
        language: "Language",
        browseCategories: "Browse Categories",
        filterByCategory: "Filter by Category",
        contactSocialMedia: "Contact & Social Media",
        contactInfo: "Contact Info",
        email: "Email: contact@deenmastery.com",
        knowledgeMadeAccessible: "Knowledge Made Accessible",
        deenMastery: "Deen Mastery",
        closeSidebar: "Close Sidebar",
        searchingFor: "Searching for:",
        clearSearch: "Clear Search",
      },
    },
    spanish: {
      code: "es",
      name: "Español",
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
        language: "Idioma",
        browseCategories: "Explorar Categorías",
        filterByCategory: "Filtrar por Categoría",
        contactSocialMedia: "Contacto y Redes Sociales",
        contactInfo: "Información de Contacto",
        email: "Email: contact@deenmastery.com",
        knowledgeMadeAccessible: "Conocimiento Accesible",
        deenMastery: "Dominio del Din",
        closeSidebar: "Cerrar Barra Lateral",
        searchingFor: "Buscando:",
        clearSearch: "Limpiar Búsqueda",
      },
    },
    german: {
      code: "de",
      name: "Deutsch",
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
        language: "Sprache",
        browseCategories: "Kategorien durchsuchen",
        filterByCategory: "Nach Kategorie filtern",
        contactSocialMedia: "Kontakt & Social Media",
        contactInfo: "Kontaktinformationen",
        email: "E-Mail: contact@deenmastery.com",
        knowledgeMadeAccessible: "Wissen Zugänglich Gemacht",
        deenMastery: "Deen Meisterschaft",
        closeSidebar: "Seitenleiste schließen",
        searchingFor: "Suche nach:",
        clearSearch: "Suche löschen",
      },
    },
    portuguese: {
      code: "pt",
      name: "Português",
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
        language: "Idioma",
        browseCategories: "Navegar por Categorias",
        filterByCategory: "Filtrar por Categoria",
        contactSocialMedia: "Contato e Redes Sociais",
        contactInfo: "Informações de Contato",
        email: "Email: contact@deenmastery.com",
        knowledgeMadeAccessible: "Conhecimento Acessível",
        deenMastery: "Domínio do Din",
        closeSidebar: "Fechar Barra Lateral",
        searchingFor: "Procurando por:",
        clearSearch: "Limpar Pesquisa",
      },
    },
    urdu: {
      code: "ur",
      name: "اردو",
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
        language: "زبان",
        browseCategories: "اقسام دیکھیں",
        filterByCategory: "قسم کے ذریعے فلٹر کریں",
        contactSocialMedia: "رابطہ اور سوشل میڈیا",
        contactInfo: "رابطے کی معلومات",
        email: "ای میل: contact@deenmastery.com",
        knowledgeMadeAccessible: "علم کو قابل رسائی بنایا گیا",
        deenMastery: "دین میں مہارت",
        closeSidebar: "سائیڈ بار بند کریں",
        searchingFor: "تلاش:",
        clearSearch: "تلاش صاف کریں",
      },
    },
    turkish: {
      code: "tr",
      name: "Türkçe",
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
        language: "Dil",
        browseCategories: "Kategorilere Göz At",
        filterByCategory: "Kategoriye Göre Filtrele",
        contactSocialMedia: "İletişim ve Sosyal Medya",
        contactInfo: "İletişim Bilgileri",
        email: "E-posta: contact@deenmastery.com",
        knowledgeMadeAccessible: "Bilgi Erişilebilir Kılındı",
        deenMastery: "Din Ustalığı",
        closeSidebar: "Kenar Çubuğunu Kapat",
        searchingFor: "Aranıyor:",
        clearSearch: "Aramayı Temizle",
      },
    },
    bahasa: {
      code: "id",
      name: "Bahasa",
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
        language: "Bahasa",
        browseCategories: "Jelajahi Kategori",
        filterByCategory: "Filter berdasarkan Kategori",
        contactSocialMedia: "Kontak & Media Sosial",
        contactInfo: "Info Kontak",
        email: "Email: contact@deenmastery.com",
        knowledgeMadeAccessible: "Pengetahuan Dibuat Dapat Diakses",
        deenMastery: "Penguasaan Din",
        closeSidebar: "Tutup Sidebar",
        searchingFor: "Mencari:",
        clearSearch: "Hapus Pencarian",
      },
    },
  }

  // Get current translations
  const t = languageConfig[currentLanguage].translations

  // Google Analytics 4 setup
  useEffect(() => {
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

    if (typeof window.gtag !== "undefined") {
      window.gtag("event", "page_view", {
        page_title: "Library Home",
        page_location: window.location.href,
        session_id: sessionId,
        user_language: currentLanguage,
        timestamp: new Date().toISOString(),
      })

      window.gtag("event", "session_start", {
        session_id: sessionId,
        timestamp: new Date().toISOString(),
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
        ...additionalData,
      })
    }

    console.log(`🔍 User Flow: ${action}`, {
      category,
      label,
      value,
      session_id: sessionId,
      current_page: currentPage,
      ...additionalData,
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

        const transformedBooks: Book[] = manifestBooks.map((book: any, index: number) => ({
          title_ar: book.title_ar || "عنوان غير معروف",
          author_ar: book.author_ar || "مؤلف غير معروف",
          title_en: book.title_en || book.title_ar || "Unknown Title",
          author_en: book.author_en || book.author_ar || "Unknown Author",
          title_es: book.title_es || book.title_en || book.title_ar,
          author_es: book.author_es || book.author_en || book.author_ar,
          title_de: book.title_de || book.title_en || book.title_ar,
          author_de: book.author_de || book.author_en || book.author_ar,
          title_pt: book.title_pt || book.title_en || book.title_ar,
          author_pt: book.author_pt || book.author_en || book.author_ar,
          title_ur: book.title_ur || book.title_ar,
          author_ur: book.author_ur || book.author_ar,
          title_tr: book.title_tr || book.title_en || book.title_ar,
          author_tr: book.author_tr || book.author_en || book.author_ar,
          title_id: book.title_id || book.title_en || book.title_ar,
          author_id: book.author_id || book.author_en || book.author_ar,
          filename: book.filename || book.filename_ar || book.filename_en || "",
          filename_ar: book.filename_ar || book.filename,
          filename_en: book.filename_en || book.filename,
          filename_es: book.filename_es || book.filename_en || book.filename,
          filename_de: book.filename_de || book.filename_en || book.filename,
          filename_pt: book.filename_pt || book.filename_en || book.filename,
          filename_ur: book.filename_ur || book.filename_ar || book.filename,
          filename_tr: book.filename_tr || book.filename_en || book.filename,
          filename_id: book.filename_id || book.filename_en || book.filename,
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

  // Get book title and author based on current language
  const getBookTitle = (book: Book) => {
    switch (currentLanguage) {
      case "arabic":
        return book.title_ar
      case "english":
        return book.title_en || book.title_ar
      case "spanish":
        return book.title_es || book.title_en || book.title_ar
      case "german":
        return book.title_de || book.title_en || book.title_ar
      case "portuguese":
        return book.title_pt || book.title_en || book.title_ar
      case "urdu":
        return book.title_ur || book.title_ar
      case "turkish":
        return book.title_tr || book.title_en || book.title_ar
      case "bahasa":
        return book.title_id || book.title_en || book.title_ar
      default:
        return book.title_en || book.title_ar
    }
  }

  const getBookAuthor = (book: Book) => {
    switch (currentLanguage) {
      case "arabic":
        return book.author_ar
      case "english":
        return book.author_en || book.author_ar
      case "spanish":
        return book.author_es || book.author_en || book.author_ar
      case "german":
        return book.author_de || book.author_en || book.author_ar
      case "portuguese":
        return book.author_pt || book.author_en || book.author_ar
      case "urdu":
        return book.author_ur || book.author_ar
      case "turkish":
        return book.author_tr || book.author_en || book.author_ar
      case "bahasa":
        return book.author_id || book.author_en || book.author_ar
      default:
        return book.author_en || book.author_ar
    }
  }

  const getBookFilename = (book: Book) => {
    switch (currentLanguage) {
      case "arabic":
        return book.filename_ar || book.filename
      case "english":
        return book.filename_en || book.filename
      case "spanish":
        return book.filename_es || book.filename_en || book.filename
      case "german":
        return book.filename_de || book.filename_en || book.filename
      case "portuguese":
        return book.filename_pt || book.filename_en || book.filename
      case "urdu":
        return book.filename_ur || book.filename_ar || book.filename
      case "turkish":
        return book.filename_tr || book.filename_en || book.filename
      case "bahasa":
        return book.filename_id || book.filename_en || book.filename
      default:
        return book.filename_en || book.filename
    }
  }

  // ROBUST FILTERING USING useMemo - This ensures the filtering always works
  const filteredBooks = useMemo(() => {
    if (books.length === 0) {
      console.log("📚 No books loaded yet")
      return []
    }

    console.log("🔍 FILTERING BOOKS:")
    console.log("📊 Total books:", books.length)
    console.log("🔍 Search query:", `"${searchQuery}"`)
    console.log("📂 Selected category:", selectedCategory)

    let result = [...books]

    // Apply category filter first
    if (selectedCategory !== "all") {
      const categoryObj = categories.find((cat) => cat.id === selectedCategory)
      const categoryName = categoryObj ? categoryObj.name : selectedCategory

      result = result.filter((book) => {
        const bookCategory = book.category.trim().toLowerCase()
        const targetCategory = categoryName.trim().toLowerCase()
        return bookCategory === targetCategory
      })

      console.log(`📂 After category filter (${categoryName}): ${result.length} books`)
    }

    // Apply search filter if there's a search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      console.log(`🔍 Applying search filter for: "${query}"`)

      result = result.filter((book) => {
        // Get current language title and author
        const currentTitle = getBookTitle(book).toLowerCase()
        const currentAuthor = getBookAuthor(book).toLowerCase()

        // Also search in Arabic (original) title and author
        const arabicTitle = book.title_ar.toLowerCase()
        const arabicAuthor = book.author_ar.toLowerCase()

        // Search in category
        const category = book.category.toLowerCase()

        // Check all possible matches
        const titleMatch = currentTitle.includes(query)
        const authorMatch = currentAuthor.includes(query)
        const arabicTitleMatch = arabicTitle.includes(query)
        const arabicAuthorMatch = arabicAuthor.includes(query)
        const categoryMatch = category.includes(query)

        const isMatch = titleMatch || authorMatch || arabicTitleMatch || arabicAuthorMatch || categoryMatch

        if (isMatch) {
          console.log(`✅ Match found: "${getBookTitle(book)}" by ${getBookAuthor(book)}`)
        }

        return isMatch
      })

      console.log(`🔍 After search filter: ${result.length} books`)

      // Track search
      if (typeof trackUserFlow === "function") {
        trackUserFlow("search", "library", searchQuery, result.length)
      }
    } else if (selectedCategory === "all") {
      // Sort by featured books when showing all books and no search
      result = result.sort((a, b) => {
        const aIsFeatured = featuredBooks.some((title) => a.title_ar.includes(title))
        const bIsFeatured = featuredBooks.some((title) => b.title_ar.includes(title))

        if (aIsFeatured && !bIsFeatured) return -1
        if (!aIsFeatured && bIsFeatured) return 1

        return a.title_ar.localeCompare(b.title_ar, "ar")
      })
    }

    console.log(`📚 FINAL FILTERED RESULT: ${result.length} books`)
    console.log(
      "📚 First 3 filtered books:",
      result.slice(0, 3).map((b) => getBookTitle(b)),
    )

    return result
  }, [books, searchQuery, selectedCategory, categories, featuredBooks, currentLanguage])

  // Filter categories based on search query
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(categorySearchQuery.toLowerCase()),
  )

  const handleBookSelect = (book: Book) => {
    console.log("Book selected for reading:", book)
    setSelectedBook(book)
    trackUserFlow("book_open", "reading", getBookTitle(book), 0, {
      book_id: book.id,
      book_category: book.category,
      scroll_position: scrollPosition,
    })

    window.history.pushState({ bookSelected: true }, "", window.location.href)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    console.log("🔍 Search input changed to:", `"${value}"`)
    setSearchQuery(value)

    if (value.length > 2) {
      trackUserFlow("search_input", "search", value, value.length)
    }
  }

  const clearSearch = () => {
    console.log("🔍 Clearing search...")
    setSearchQuery("")
    trackUserFlow("search_clear", "interaction", "clear_button")
  }

  const handleCloseReader = () => {
    const bookTitle = selectedBook ? getBookTitle(selectedBook) : "unknown"
    setSelectedBook(null)
    trackUserFlow("book_close", "reading", bookTitle)
    if (window.history.state?.bookSelected) {
      window.history.back()
    }
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed)
    trackUserFlow("sidebar_toggle", "interface", sidebarCollapsed ? "open" : "close")
  }

  const closeSidebar = () => {
    setSidebarCollapsed(true)
    trackUserFlow("sidebar_close", "interface", "close_button")
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
    trackUserFlow("language_change", "interface", language, 0, {
      from_language: previousLanguage,
      to_language: language,
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

  // Debug info - shows current state
  console.log("🎯 RENDER DEBUG:")
  console.log("📊 Books total:", books.length)
  console.log("📊 Filtered books:", filteredBooks.length)
  console.log("🔍 Current search:", `"${searchQuery}"`)
  console.log("📂 Current category:", selectedCategory)

  return (
    <div className="min-h-screen bg-amber-50 flex flex-col relative">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-amber-200 p-4 z-40 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/lovable-uploads/92c79d95-bbb5-40d0-9b0f-37bccec10dcd.png"
                alt="Deen Mastery Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-amber-900">{t.deenMastery}</h1>
              <p className="text-xs text-amber-600">{t.knowledgeMadeAccessible}</p>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handlePageChange("home")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                currentPage === "home"
                  ? "bg-amber-100 text-amber-800 font-medium"
                  : "text-gray-600 hover:text-amber-700 hover:bg-amber-50"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>{t.home}</span>
            </button>
            <button
              onClick={() => handlePageChange("about")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                currentPage === "about"
                  ? "bg-amber-100 text-amber-800 font-medium"
                  : "text-gray-600 hover:text-amber-700 hover:bg-amber-50"
              }`}
            >
              <Info className="w-4 h-4" />
              <span>{t.about}</span>
            </button>
            <button
              onClick={() => handlePageChange("contact")}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                currentPage === "contact"
                  ? "bg-amber-100 text-amber-800 font-medium"
                  : "text-gray-600 hover:text-amber-700 hover:bg-amber-50"
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>{t.contact}</span>
            </button>
          </div>

          {/* Language Selector & Categories Button */}
          <div className="flex items-center space-x-3">
            {/* Language Dropdown */}
            <div className="relative">
              <select
                value={currentLanguage}
                onChange={(e) => handleLanguageChange(e.target.value as keyof typeof languageConfig)}
                className="appearance-none bg-white border border-amber-200 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:border-amber-500 min-w-[120px]"
              >
                {Object.entries(languageConfig).map(([key, lang]) => (
                  <option key={key} value={key}>
                    {lang.name}
                  </option>
                ))}
              </select>
              <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Categories Toggle Button */}
            <button
              onClick={toggleSidebar}
              className="p-2 bg-green-700 text-white rounded-lg shadow-lg hover:bg-green-800 transition-colors"
              title={t.browseCategories}
            >
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4 flex space-x-2">
          <button
            onClick={() => handlePageChange("home")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentPage === "home"
                ? "bg-amber-100 text-amber-800 font-medium"
                : "text-gray-600 hover:text-amber-700 hover:bg-amber-50"
            }`}
          >
            {t.home}
          </button>
          <button
            onClick={() => handlePageChange("about")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentPage === "about"
                ? "bg-amber-100 text-amber-800 font-medium"
                : "text-gray-600 hover:text-amber-700 hover:bg-amber-50"
            }`}
          >
            {t.about}
          </button>
          <button
            onClick={() => handlePageChange("contact")}
            className={`flex-1 px-3 py-2 rounded-lg text-sm transition-colors ${
              currentPage === "contact"
                ? "bg-amber-100 text-amber-800 font-medium"
                : "text-gray-600 hover:text-amber-700 hover:bg-amber-50"
            }`}
          >
            {t.contact}
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobile && !sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={handleOverlayClick}
          style={{ touchAction: "manipulation" }}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {selectedBook ? (
          // Book Reader Component
          <BookReader
            book={selectedBook}
            onClose={handleCloseReader}
            showArabic={currentLanguage === "arabic" || currentLanguage === "urdu"}
            scrollPosition={scrollPosition}
            onUserAction={trackUserFlow}
            currentLanguage={currentLanguage}
            filename={getBookFilename(selectedBook)}
          />
        ) : currentPage === "contact" ? (
          <ContactPage onBack={() => handlePageChange("home")} currentLanguage={currentLanguage} />
        ) : currentPage === "about" ? (
          <AboutPage
            onBack={() => handlePageChange("home")}
            onCategorySelect={handleCategorySelect}
            currentLanguage={currentLanguage}
          />
        ) : (
          // Landing Page - FIXED TO USE useMemo filteredBooks
          <div
            ref={mainContentRef}
            className="flex-1 flex flex-col items-center justify-start px-4 md:px-8 pt-8 md:pt-16 overflow-auto"
          >
            {/* Logo and Branding */}
            <div className="text-center mb-8 md:mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 mb-4 md:mb-6">
                <img
                  src="/lovable-uploads/92c79d95-bbb5-40d0-9b0f-37bccec10dcd.png"
                  alt="Deen Mastery Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-2">{t.deenMastery}</h1>
              <p className="text-amber-700 text-base md:text-lg italic">{t.knowledgeMadeAccessible}</p>
            </div>

            {/* Search Section */}
            <div className="w-full max-w-md mb-6 md:mb-8">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-3 text-base md:text-lg border-2 border-amber-800 rounded-lg focus:outline-none focus:border-amber-600 bg-white pl-4 pr-20 text-left"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                  {searchQuery.trim() && (
                    <button
                      onClick={clearSearch}
                      className="p-1 hover:bg-amber-100 rounded text-amber-600 transition-colors"
                      title={t.clearSearch}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <Search className="text-amber-600 w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Available Books Section - NOW CORRECTLY USES useMemo filteredBooks */}
            <div className="w-full max-w-6xl pb-16">
              <div className="text-center mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-amber-900">
                  {`${t.availableBooks} (${filteredBooks.length})`}
                </h2>
                {selectedCategory !== "all" && (
                  <div className="text-base font-normal text-amber-700 mt-2">
                    {t.category} {categories.find((cat) => cat.id === selectedCategory)?.name}
                  </div>
                )}
                {searchQuery.trim() && (
                  <div className="text-sm text-amber-600 mt-2 flex items-center justify-center space-x-2">
                    <span>
                      {t.searchingFor} "{searchQuery}"
                    </span>
                    <button onClick={clearSearch} className="text-amber-800 hover:text-amber-900 underline text-xs">
                      {t.clearSearch}
                    </button>
                  </div>
                )}
              </div>

              {/* BOOKS GRID - This now uses the useMemo filteredBooks which is guaranteed to work */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                {filteredBooks.map((book, index) => {
                  const isFeatured =
                    featuredBooks.some((title) => book.title_ar.includes(title)) &&
                    !searchQuery.trim() &&
                    selectedCategory === "all"

                  return (
                    <div
                      key={`${book.id}-${index}`}
                      onClick={() => {
                        trackUserFlow("book_card_click", "interaction", getBookTitle(book), index)
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
                        <div className="leading-tight break-words w-full overflow-wrap-anywhere">
                          {getBookTitle(book)}
                        </div>
                      </div>

                      <div className="text-xs md:text-sm text-amber-700 mb-2">
                        {t.byAuthor} {getBookAuthor(book)}
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
                  <p className="text-amber-700 mb-4">{t.noBooks}</p>
                  {(selectedCategory !== "all" || searchQuery.trim()) && (
                    <button
                      onClick={() => {
                        trackUserFlow("show_all_books", "interaction", "no_results")
                        handleCategorySelect("all")
                        setSearchQuery("")
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

        {/* Categories Sidebar */}
        <div
          className={`fixed right-0 top-20 h-[calc(100vh-5rem)] bg-green-700 text-white flex flex-col transition-all duration-300 ease-in-out z-40 ${
            sidebarCollapsed ? "w-0 overflow-hidden" : "w-80"
          } ${isMobile && sidebarCollapsed ? "translate-x-full" : ""}`}
        >
          {/* Sidebar Header with Close Button */}
          <div className="p-4 md:p-6 border-b border-green-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-600 rounded mr-3">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="bg-white text-green-800 px-3 py-1 rounded text-sm font-medium">
                  {t.browseCategories}
                </div>
              </div>
              <button
                onClick={closeSidebar}
                className="p-2 hover:bg-green-600 rounded-lg transition-colors"
                title={t.closeSidebar}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Categories Section with Search */}
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

            {/* Categories Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg md:text-xl font-bold">{t.filterByCategory}</h3>
            </div>

            <div className="space-y-2">
              {filteredCategories.map((category) => {
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
          </div>

          {/* Contact & Social Media Links */}
          <div className="p-4 md:p-6 border-t border-green-600">
            <div className="text-xs text-green-200 mb-3">{t.contactSocialMedia}</div>
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
              <div className="text-xs text-green-200 mb-2">{t.contactInfo}</div>
              <div className="text-xs text-white">{t.email}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
