"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ZoomIn, ZoomOut, Download, RotateCcw, Home, BookOpen, SearchIcon } from "lucide-react"

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
}

interface BookReaderProps {
  book: Book
  onClose: () => void
  showArabic?: boolean
  scrollPosition?: number
}

interface Chapter {
  title: string
  content: string
  id: string
}

interface WordTranslation {
  [key: string]: {
    translation: string
    transliteration?: string
    root?: string
    meaning?: string
  }
}

const BookReader = ({ book, onClose, showArabic = false, scrollPosition = 0 }: BookReaderProps) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [zoom, setZoom] = useState(100)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [pageInput, setPageInput] = useState("1")
  const [wordTranslations, setWordTranslations] = useState<WordTranslation>({})
  const [hoveredWord, setHoveredWord] = useState<string | null>(null)
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 })
  const [magnifierActive, setMagnifierActive] = useState(false)
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 })
  const contentRef = useRef<HTMLDivElement>(null)
  const magnifierRef = useRef<HTMLDivElement>(null)

  // Touch handling for swipe navigation
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentPage < totalPages - 1) {
      handleNextPage()
    }
    if (isRightSwipe && currentPage > 0) {
      handlePrevPage()
    }
  }

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50))
  }

  const handleResetZoom = () => {
    setZoom(100)
  }

  const handleDownload = () => {
    const filename = showArabic ? book.filename_ar || book.filename : book.filename_en || book.filename
    const link = document.createElement("a")
    link.href = `/epubs/${filename}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePrevPage = () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      setPageInput(String(newPage + 1))
      // Reset scroll to top
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      setPageInput(String(newPage + 1))
      // Reset scroll to top
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
    }
  }

  const handleLastPage = () => {
    const lastPage = totalPages - 1
    setCurrentPage(lastPage)
    setPageInput(String(totalPages))
    // Reset scroll to top
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  const handlePageInputChange = (value: string) => {
    setPageInput(value)
    const pageNum = Number.parseInt(value)
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum - 1)
    }
  }

  const handleGoToPage = () => {
    const pageNum = Number.parseInt(pageInput)
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum - 1)
      // Reset scroll to top
      if (contentRef.current) {
        contentRef.current.scrollTop = 0
      }
    } else {
      // Reset to current page if invalid
      setPageInput(String(currentPage + 1))
    }
  }

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = clickX / rect.width
    const newPage = Math.floor(percentage * totalPages)
    const clampedPage = Math.max(0, Math.min(newPage, totalPages - 1))
    setCurrentPage(clampedPage)
    setPageInput(String(clampedPage + 1))
    // Reset scroll to top
    if (contentRef.current) {
      contentRef.current.scrollTop = 0
    }
  }

  const handleCloseReader = () => {
    // Store scroll position before closing
    if (scrollPosition !== undefined) {
      sessionStorage.setItem("libraryScrollPosition", scrollPosition.toString())
    }
    onClose()
  }

  // Load word translations
  useEffect(() => {
    const loadWordTranslations = async () => {
      try {
        const response = await fetch("/word-translations.json")
        if (response.ok) {
          const translations = await response.json()
          setWordTranslations(translations)
        }
      } catch (error) {
        console.warn("Could not load word translations:", error)
      }
    }

    loadWordTranslations()
  }, [])

  // Handle word hover
  const handleWordHover = (e: React.MouseEvent, word: string) => {
    const cleanWord = word.replace(/[^\u0600-\u06FF\u0750-\u077F]/g, "").trim()
    if (cleanWord && wordTranslations[cleanWord]) {
      setHoveredWord(cleanWord)
      setHoverPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const handleWordLeave = () => {
    setHoveredWord(null)
  }

  // Magnifier functionality
  const handleMouseMove = (e: React.MouseEvent) => {
    if (magnifierActive) {
      setMagnifierPosition({ x: e.clientX, y: e.clientY })
    }
  }

  const toggleMagnifier = () => {
    setMagnifierActive(!magnifierActive)
  }

  // Load and parse EPUB file
  useEffect(() => {
    const loadEpub = async () => {
      try {
        setIsLoading(true)
        setError(null)

        console.log("Loading EPUB:", book.filename)

        // Import JSZip dynamically
        const JSZip = (await import("jszip")).default

        // Determine which filename to use based on language
        const filename = showArabic ? book.filename_ar || book.filename : book.filename_en || book.filename

        // Fetch the EPUB file
        const response = await fetch(`/epubs/${filename}`)
        if (!response.ok) {
          throw new Error(`Failed to fetch EPUB file: ${response.status}`)
        }

        const arrayBuffer = await response.arrayBuffer()
        console.log("EPUB file loaded, size:", arrayBuffer.byteLength)

        // Parse the ZIP file
        const zip = new JSZip()
        const zipContent = await zip.loadAsync(arrayBuffer)
        console.log("ZIP parsed, files:", Object.keys(zipContent.files).length)

        // Find and parse container.xml to get the OPF file path
        const containerFile = zipContent.files["META-INF/container.xml"]
        if (!containerFile) {
          throw new Error("Invalid EPUB: container.xml not found")
        }

        const containerXml = await containerFile.async("text")
        const parser = new DOMParser()
        const containerDoc = parser.parseFromString(containerXml, "text/xml")
        const opfPath = containerDoc.querySelector("rootfile")?.getAttribute("full-path")

        if (!opfPath) {
          throw new Error("Invalid EPUB: OPF path not found")
        }

        console.log("OPF path:", opfPath)

        // Parse the OPF file to get the spine and manifest
        const opfFile = zipContent.files[opfPath]
        if (!opfFile) {
          throw new Error("Invalid EPUB: OPF file not found")
        }

        const opfXml = await opfFile.async("text")
        const opfDoc = parser.parseFromString(opfXml, "text/xml")

        // Get the base path for content files
        const basePath = opfPath.substring(0, opfPath.lastIndexOf("/") + 1)

        // Extract spine items (reading order)
        const spineItems = Array.from(opfDoc.querySelectorAll("spine itemref"))
        const manifestItems = Array.from(opfDoc.querySelectorAll("manifest item"))

        console.log("Spine items:", spineItems.length)
        console.log("Manifest items:", manifestItems.length)

        // Build chapters array
        const extractedChapters: Chapter[] = []

        for (let i = 0; i < spineItems.length; i++) {
          const itemref = spineItems[i]
          const idref = itemref.getAttribute("idref")

          if (!idref) continue

          // Find the corresponding manifest item
          const manifestItem = manifestItems.find((item) => item.getAttribute("id") === idref)
          if (!manifestItem) continue

          const href = manifestItem.getAttribute("href")
          if (!href) continue

          const fullPath = basePath + href
          console.log("Processing chapter:", fullPath)

          // Get the content file
          const contentFile = zipContent.files[fullPath]
          if (!contentFile) {
            console.warn("Content file not found:", fullPath)
            continue
          }

          try {
            const htmlContent = await contentFile.async("text")

            // Parse HTML and extract text content
            const htmlDoc = parser.parseFromString(htmlContent, "text/html")

            // Remove script and style tags
            const scripts = htmlDoc.querySelectorAll("script, style")
            scripts.forEach((el) => el.remove())

            // Get the title
            const chapterTitle =
              htmlDoc.querySelector("title")?.textContent ||
              htmlDoc.querySelector("h1, h2, h3")?.textContent ||
              `Chapter ${i + 1}`

            // Get the body content
            const bodyContent = htmlDoc.querySelector("body")?.innerHTML || htmlContent

            // Clean up the content and add word hover functionality
            let cleanContent = bodyContent
              .replace(/<script[^>]*>.*?<\/script>/gis, "")
              .replace(/<style[^>]*>.*?<\/style>/gis, "")
              .replace(/\s+/g, " ")
              .trim()

            // Add word hover functionality for Arabic text
            if (showArabic) {
              cleanContent = cleanContent.replace(
                /[\u0600-\u06FF\u0750-\u077F]+/g,
                (match) => `<span class="hoverable-word" data-word="${match}">${match}</span>`,
              )
            }

            if (cleanContent) {
              extractedChapters.push({
                id: idref,
                title: chapterTitle.trim(),
                content: cleanContent,
              })
            }
          } catch (chapterError) {
            console.warn("Error processing chapter:", fullPath, chapterError)
          }
        }

        console.log("Extracted chapters:", extractedChapters.length)

        if (extractedChapters.length === 0) {
          throw new Error("No readable content found in this EPUB file")
        }

        setChapters(extractedChapters)
        setTotalPages(extractedChapters.length)
        setCurrentPage(0)
        setPageInput("1")
        setIsLoading(false)

        console.log("✅ EPUB successfully loaded and parsed")
      } catch (err) {
        console.error("❌ Failed to load EPUB:", err)
        setError(err instanceof Error ? err.message : "Failed to load the book")
        setIsLoading(false)
      }
    }

    loadEpub()
  }, [book, showArabic])

  // Update page input when current page changes
  useEffect(() => {
    setPageInput(String(currentPage + 1))
  }, [currentPage])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent backspace from refreshing page in input field
      if (e.key === "Backspace" && e.target instanceof HTMLInputElement) {
        e.stopPropagation()
        return
      }

      switch (e.key) {
        case "Escape":
          handleCloseReader()
          break
        case "ArrowLeft":
          e.preventDefault()
          handlePrevPage()
          break
        case "ArrowRight":
          e.preventDefault()
          handleNextPage()
          break
        case "Home":
          e.preventDefault()
          setCurrentPage(0)
          setPageInput("1")
          if (contentRef.current) {
            contentRef.current.scrollTop = 0
          }
          break
        case "End":
          e.preventDefault()
          handleLastPage()
          break
        case "m":
        case "M":
          e.preventDefault()
          toggleMagnifier()
          break
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [currentPage, totalPages])

  // Add word hover event listeners
  useEffect(() => {
    const handleWordClick = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.classList.contains("hoverable-word")) {
        const word = target.getAttribute("data-word")
        if (word) {
          handleWordHover(e as any, word)
        }
      }
    }

    const contentElement = contentRef.current
    if (contentElement) {
      contentElement.addEventListener("mouseover", handleWordClick)
      contentElement.addEventListener("mouseleave", handleWordLeave)

      return () => {
        contentElement.removeEventListener("mouseover", handleWordClick)
        contentElement.removeEventListener("mouseleave", handleWordLeave)
      }
    }
  }, [chapters, currentPage])

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
        <div className="bg-white shadow-lg border-b border-gray-200 p-4 flex items-center justify-between">
          <button onClick={handleCloseReader} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
          </button>
          <h2 className="font-semibold text-gray-900">Error Loading Book</h2>
          <div></div>
        </div>

        <div className="flex-1 flex items-center justify-center bg-gray-100">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <div className="text-red-500 text-6xl mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900">Unable to Load Book</h3>
            <p className="text-gray-600 mb-4 text-sm">{error}</p>
            <div className="text-sm text-gray-500 mb-4 p-3 bg-gray-50 rounded">
              <p>
                <strong>Book:</strong> {showArabic ? book.title_ar : book.title_en}
              </p>
              <p>
                <strong>File:</strong> {book.filename}
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
              >
                Retry Loading
              </button>
              <button
                onClick={handleDownload}
                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Download Book
              </button>
              <button
                onClick={handleCloseReader}
                className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                Back to Library
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header with Page Display */}
      <div className="bg-white shadow-lg border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={handleCloseReader}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <Home className="w-5 h-5" />
          </button>

          {/* Page Display - Centered */}
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Page {currentPage + 1}</h1>
            <div className="w-full h-1 bg-amber-600 rounded"></div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Magnifier Toggle */}
            <button
              onClick={toggleMagnifier}
              className={`p-2 rounded-lg transition-colors ${
                magnifierActive ? "bg-amber-100 text-amber-700" : "hover:bg-gray-100"
              }`}
              title="Toggle Magnifier (M)"
            >
              <SearchIcon className="w-4 h-4" />
            </button>

            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-white rounded transition-colors"
                disabled={zoom <= 50}
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="px-2 py-1 text-xs font-medium min-w-[3rem] text-center">{zoom}%</span>

              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-white rounded transition-colors"
                disabled={zoom >= 200}
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetZoom}
                className="p-2 hover:bg-white rounded transition-colors"
                title="Reset Zoom"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download Book"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Book Title */}
        <div className="text-center mt-2">
          <h2 className="font-semibold text-gray-700 text-sm md:text-base truncate">
            {showArabic ? book.title_ar : book.title_en}
          </h2>
          <p className="text-xs text-gray-500 truncate">
            {showArabic ? `بقلم ${book.author_ar}` : `by ${book.author_en}`}
          </p>
        </div>
      </div>

      {/* Reader Content */}
      <div
        className="flex-1 bg-gray-100 p-2 md:p-4 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseMove={handleMouseMove}
      >
        <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mb-4 mx-auto"></div>
                <div className="text-lg font-medium text-gray-700">Loading Book...</div>
                <div className="text-sm text-gray-500 mt-2 max-w-xs truncate">{book.filename}</div>
                <div className="text-xs text-gray-400 mt-1">Extracting content from EPUB...</div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full overflow-auto" ref={contentRef}>
              <div
                className="max-w-4xl mx-auto p-4 md:p-8 pb-16"
                style={{
                  fontSize: `${zoom}%`,
                  direction: showArabic ? "rtl" : "ltr",
                  textAlign: showArabic ? "right" : "left",
                  fontFamily: showArabic ? "'Amiri', 'Noto Sans Arabic', Arial, sans-serif" : "Georgia, serif",
                  lineHeight: "1.8",
                }}
              >
                {chapters.length > 0 && (
                  <div>
                    {/* Chapter Content */}
                    <div
                      className="prose prose-lg max-w-none text-gray-800"
                      style={{
                        direction: showArabic ? "rtl" : "ltr",
                        textAlign: showArabic ? "right" : "left",
                        fontFamily: showArabic ? "'Amiri', 'Noto Sans Arabic', Arial, sans-serif" : "Georgia, serif",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: chapters[currentPage]?.content || "",
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Magnifier */}
          {magnifierActive && (
            <div
              ref={magnifierRef}
              className="fixed pointer-events-none z-50 w-32 h-32 border-4 border-amber-500 rounded-full bg-white shadow-lg"
              style={{
                left: magnifierPosition.x - 64,
                top: magnifierPosition.y - 64,
                transform: "scale(2)",
                transformOrigin: "center",
                overflow: "hidden",
              }}
            >
              <div className="w-full h-full bg-white opacity-90"></div>
            </div>
          )}
        </div>
      </div>

      {/* Word Translation Tooltip */}
      {hoveredWord && wordTranslations[hoveredWord] && (
        <div
          className="fixed z-50 bg-black text-white p-3 rounded-lg shadow-lg max-w-xs pointer-events-none"
          style={{
            left: hoverPosition.x + 10,
            top: hoverPosition.y - 10,
            transform: hoverPosition.x > window.innerWidth - 200 ? "translateX(-100%)" : "none",
          }}
        >
          <div className="font-bold text-sm mb-1">{hoveredWord}</div>
          <div className="text-xs mb-1">{wordTranslations[hoveredWord].translation}</div>
          {wordTranslations[hoveredWord].transliteration && (
            <div className="text-xs text-gray-300 mb-1">
              <em>{wordTranslations[hoveredWord].transliteration}</em>
            </div>
          )}
          {wordTranslations[hoveredWord].meaning && (
            <div className="text-xs text-gray-300">{wordTranslations[hoveredWord].meaning}</div>
          )}
        </div>
      )}

      {/* Enhanced Bottom Navigation Bar */}
      <div className="bg-white border-t border-gray-200 p-3 md:p-4">
        <div className="flex flex-col space-y-3">
          {/* Navigation Controls */}
          <div className="flex items-center justify-center space-x-2 md:space-x-4">
            <button
              onClick={() => {
                setCurrentPage(0)
                setPageInput("1")
                if (contentRef.current) {
                  contentRef.current.scrollTop = 0
                }
              }}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage <= 0}
            >
              First
            </button>

            <button
              onClick={handlePrevPage}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage <= 0}
            >
              Previous
            </button>

            {/* Enhanced Clickable Progress Bar */}
            <div className="flex-1 max-w-md mx-4">
              <div
                className="w-full bg-gray-200 rounded-full h-4 cursor-pointer relative hover:bg-gray-300 transition-colors"
                onClick={handleProgressBarClick}
                title={`Click to jump to page (${currentPage + 1}/${totalPages})`}
              >
                <div
                  className="bg-amber-600 h-4 rounded-full transition-all duration-300 relative"
                  style={{ width: `${totalPages > 0 ? ((currentPage + 1) / totalPages) * 100 : 0}%` }}
                >
                  {/* Progress indicator dot */}
                  <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-amber-700 rounded-full border-2 border-white shadow-md"></div>
                </div>
              </div>
            </div>

            <button
              onClick={handleNextPage}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </button>

            <button
              onClick={handleLastPage}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage >= totalPages - 1}
            >
              Last
            </button>
          </div>

          {/* Manual Page Input */}
          <div className="flex items-center justify-center space-x-3">
            <span className="text-sm text-gray-600">Page:</span>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                max={totalPages}
                value={pageInput}
                onChange={(e) => handlePageInputChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleGoToPage()
                  }
                  // Prevent backspace from affecting page navigation
                  e.stopPropagation()
                }}
                className="w-16 px-2 py-1 text-sm text-center border border-gray-300 rounded focus:outline-none focus:border-amber-500"
                placeholder="1"
              />
              <span className="text-sm text-gray-500">of {totalPages}</span>
            </div>
            <button
              onClick={handleGoToPage}
              className="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
            >
              Go
            </button>
          </div>

          {/* Chapter Info and Controls */}
          <div className="text-center text-xs text-gray-500">
            <div>
              Chapter {currentPage + 1} of {totalPages} • {chapters[currentPage]?.title || "Loading..."}
            </div>
            <div className="mt-1 text-gray-400">
              Swipe left/right or use arrow keys to navigate • Press M for magnifier
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookReader
