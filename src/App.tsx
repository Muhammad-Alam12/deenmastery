"use client"

import { useState, useEffect } from "react"
import BookGrid from "./components/BookGrid"
import SearchBar from "./components/SearchBar"
import BookReader from "./components/BookReader"
import ContactPage from "./components/ContactPage"
import AboutPage from "./components/AboutPage"
import { Menu, X, BookOpen, Globe, Phone, Info, Home } from 'lucide-react'
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Routes, Route } from "react-router-dom"
import Index from "./pages/Index"
import NotFound from "./pages/NotFound"
import "./App.css"

// Google Analytics 4 Configuration
declare global {
  interface Window {
    dataLayer: any[]
    gtag: (...args: any[]) => void
  }
}

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

const queryClient = new QueryClient()

const App = () => {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [currentPage, setCurrentPage] = useState<"library" | "contact" | "about">("library")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showArabic, setShowArabic] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

  // Initialize Google Analytics 4
  useEffect(() => {
    // Add GA4 script to head
    const script1 = document.createElement("script")
    script1.async = true
    script1.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
    document.head.appendChild(script1)

    // Initialize dataLayer and gtag
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag("js", new Date())
    window.gtag("config", "G-XXXXXXXXXX", {
      page_title: "Deen Mastery Library",
      page_location: window.location.href,
      custom_map: {
        custom_parameter_1: 'session_id'
      }
    })

    // Track initial page load with session data
    window.gtag("event", "page_view", {
      page_title: "Library Home",
      page_location: window.location.href,
      session_id: sessionId,
      user_language: showArabic ? 'arabic' : 'english',
      timestamp: new Date().toISOString()
    })

    // Track session start
    window.gtag("event", "session_start", {
      session_id: sessionId,
      timestamp: new Date().toISOString()
    })
  }, [sessionId, showArabic])

  // Enhanced user flow tracking
  const trackUserFlow = (action: string, category: string, label?: string, value?: number, additionalData?: any) => {
    if (window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
        session_id: sessionId,
        user_language: showArabic ? 'arabic' : 'english',
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

  // Load books data
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoading(true)
        trackUserFlow("data_load_start", "library", "books_loading")

        // Try to load from the provided manifest first
        let booksData: Book[] = []

        try {
          const manifestResponse = await fetch("/manifest.json")
          if (manifestResponse.ok) {
            booksData = await manifestResponse.json()
            trackUserFlow("data_load_success", "library", "manifest_json", booksData.length)
          }
        } catch (error) {
          console.warn("Could not load manifest.json, trying categories.json")
          trackUserFlow("data_load_fallback", "library", "manifest_failed")
        }

        // Fallback to categories.json if manifest.json doesn't exist
        if (booksData.length === 0) {
          try {
            const categoriesResponse = await fetch("/categories.json")
            if (categoriesResponse.ok) {
              booksData = await categoriesResponse.json()
              trackUserFlow("data_load_success", "library", "categories_json", booksData.length)
            }
          } catch (error) {
            console.warn("Could not load categories.json either")
            trackUserFlow("data_load_error", "library", "both_files_failed")
          }
        }

        if (booksData.length === 0) {
          throw new Error("No book data found")
        }

        setBooks(booksData)
        setFilteredBooks(booksData)

        // Extract unique categories from the actual book data
        const uniqueCategories = Array.from(new Set(booksData.map((book) => book.category)))
          .filter((category) => category && category.trim() !== "")
          .sort()

        setCategories(["All", ...uniqueCategories])

        console.log("✅ Books loaded successfully:", booksData.length)
        console.log("📚 Categories found:", uniqueCategories)

        trackUserFlow("data_loaded", "library", "books_count", booksData.length, {
          categories_count: uniqueCategories.length,
          categories: uniqueCategories
        })
      } catch (error) {
        console.error("❌ Failed to load books:", error)
        trackUserFlow("error", "library", "failed_to_load_books", 0, { error: error.message })
      } finally {
        setIsLoading(false)
      }
    }

    loadBooks()
  }, [])

  // Restore scroll position
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("libraryScrollPosition")
    if (savedScrollPosition && currentPage === "library") {
      setTimeout(() => {
        window.scrollTo(0, Number.parseInt(savedScrollPosition))
        sessionStorage.removeItem("libraryScrollPosition")
        trackUserFlow("scroll_restored", "navigation", "library_return", Number.parseInt(savedScrollPosition))
      }, 100)
    }
  }, [currentPage])

  // Filter books based on search and category
  useEffect(() => {
    let filtered = books

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((book) => {
        const titleMatch = showArabic
          ? book.title_ar.toLowerCase().includes(searchLower)
          : (book.title_en || book.title_ar).toLowerCase().includes(searchLower)

        const authorMatch = showArabic
          ? book.author_ar.toLowerCase().includes(searchLower)
          : (book.author_en || book.author_ar).toLowerCase().includes(searchLower)

        const categoryMatch = book.category.toLowerCase().includes(searchLower)

        return titleMatch || authorMatch || categoryMatch
      })
    }

    setFilteredBooks(filtered)

    // Track search and filter events
    if (searchTerm) {
      trackUserFlow("search", "library", searchTerm, filtered.length, {
        search_term: searchTerm,
        results_count: filtered.length
      })
    }
    if (selectedCategory !== "All") {
      trackUserFlow("filter", "library", selectedCategory, filtered.length, {
        category: selectedCategory,
        results_count: filtered.length
      })
    }
  }, [books, searchTerm, selectedCategory, showArabic])

  const handleBookSelect = (book: Book) => {
    setScrollPosition(window.scrollY)
    setSelectedBook(book)
    trackUserFlow("book_open", "reading", showArabic ? book.title_ar : book.title_en || book.title_ar, 0, {
      book_id: book.id,
      book_category: book.category,
      book_filename: book.filename,
      scroll_position: window.scrollY
    })
  }

  const handleCloseBook = () => {
    const bookTitle = selectedBook ? (showArabic ? selectedBook.title_ar : selectedBook.title_en || selectedBook.title_ar) : "unknown"
    setSelectedBook(null)
    trackUserFlow("book_close", "reading", bookTitle, 0, {
      book_id: selectedBook?.id,
      return_to: "library"
    })
  }

  const handleLanguageToggle = () => {
    const newLanguage = !showArabic
    setShowArabic(newLanguage)
    trackUserFlow("language_toggle", "interface", newLanguage ? "arabic" : "english", 0, {
      from_language: showArabic ? "arabic" : "english",
      to_language: newLanguage ? "arabic" : "english"
    })
  }

  const handlePageChange = (page: "library" | "contact" | "about") => {
    const previousPage = currentPage
    setCurrentPage(page)
    setIsMenuOpen(false)
    trackUserFlow("page_view", "navigation", page, 0, {
      from_page: previousPage,
      to_page: page
    })
  }

  const handleMenuToggle = () => {
    const newMenuState = !isMenuOpen
    setIsMenuOpen(newMenuState)
    trackUserFlow("menu_toggle", "interface", newMenuState ? "open" : "close", 0, {
      menu_state: newMenuState ? "open" : "close"
    })
  }

  // Fixed category navigation - navigate to library with selected category
  const handleCategorySelect = (category: string) => {
    const previousCategory = selectedCategory
    setSelectedCategory(category)
    if (currentPage !== "library") {
      setCurrentPage("library")
    }
    setIsMenuOpen(false)
    trackUserFlow("category_select", "navigation", category, 0, {
      from_category: previousCategory,
      to_category: category,
      from_page: currentPage,
      navigation_type: currentPage !== "library" ? "cross_page" : "same_page"
    })
  }

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    if (term.length > 2) {
      trackUserFlow("search_input", "search", term, term.length, {
        search_length: term.length,
        search_type: "typing"
      })
    }
  }

  // Track clicks on UI elements
  const handleUIClick = (element: string, location: string) => {
    trackUserFlow("ui_click", "interaction", element, 0, {
      element_type: element,
      location: location,
      page: currentPage
    })
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  )
}

export default App
