
import React, { useState, useEffect, useRef } from 'react';
import { X, ZoomIn, ZoomOut, Download, ChevronLeft, ChevronRight, RotateCcw, Maximize2 } from 'lucide-react';
import ePub from 'epubjs';

interface Book {
  title: string;
  author: string;
  filename: string;
  coverText: string;
  type: string;
  source?: string;
  title_ar?: string;
  author_ar?: string;
}

interface BookReaderProps {
  book: Book;
  onClose: () => void;
  showArabic?: boolean;
}

const BookReader = ({ book, onClose, showArabic = false }: BookReaderProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<any>(null);
  const renditionRef = useRef<any>(null);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDownload = () => {
    // Always treat as local file for download
    const link = document.createElement('a');
    link.href = `/epubs/${book.filename}`;
    link.download = book.filename;
    link.click();
  };

  const getBookUrl = () => {
    // Force all books to load from local epubs folder regardless of manifest source
    const bookUrl = `/epubs/${book.filename}`;
    console.log('Attempting to load book from:', bookUrl);
    console.log('Book details:', book);
    return bookUrl;
  };

  const handlePrevPage = () => {
    if (renditionRef.current) {
      renditionRef.current.prev();
    }
  };

  const handleNextPage = () => {
    if (renditionRef.current) {
      renditionRef.current.next();
    }
  };

  useEffect(() => {
    const initializeEpub = async () => {
      if (!viewerRef.current) return;

      try {
        setIsLoading(true);
        setError(null);

        // Clean up previous book
        if (renditionRef.current) {
          renditionRef.current.destroy();
        }

        const bookUrl = getBookUrl();
        console.log('Initializing EPUB reader with URL:', bookUrl);
        
        // First check if the file exists by trying to fetch it
        try {
          const response = await fetch(bookUrl, { method: 'HEAD' });
          if (!response.ok) {
            throw new Error(`File not found: ${bookUrl} (Status: ${response.status})`);
          }
          console.log('File exists, proceeding with EPUB loading...');
        } catch (fetchError) {
          console.error('File check failed:', fetchError);
          throw new Error(`Cannot access file: ${book.filename}. Please ensure the file exists in the /epubs/ folder.`);
        }
        
        const epubBook = ePub(bookUrl);
        bookRef.current = epubBook;

        console.log('Creating rendition...');
        const rendition = epubBook.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'none'
        });
        renditionRef.current = rendition;

        console.log('Displaying book...');
        await rendition.display();
        console.log('Book displayed successfully');

        // Get total pages
        epubBook.ready.then(() => {
          console.log('Book ready, generating locations...');
          return epubBook.locations.generate(1024);
        }).then(() => {
          const totalLocs = epubBook.locations.length();
          console.log('Generated locations, total pages:', totalLocs);
          setTotalPages(totalLocs);
          setIsLoading(false);
        }).catch((locError) => {
          console.error('Error generating locations:', locError);
          // Still mark as loaded even if locations fail
          setTotalPages(1);
          setIsLoading(false);
        });

        // Handle page navigation
        rendition.on('relocated', (location: any) => {
          if (epubBook.locations && epubBook.locations.length() > 0) {
            const currentLocation = epubBook.locations.percentageFromCfi(location.start.cfi);
            setCurrentPage(Math.ceil(currentLocation * epubBook.locations.length()));
          }
        });

        // Apply zoom
        rendition.themes.fontSize(`${zoom}%`);

      } catch (err) {
        console.error('Failed to load EPUB:', err);
        setError(err instanceof Error ? err.message : 'Failed to load the book. Please try again.');
        setIsLoading(false);
      }
    };

    initializeEpub();

    return () => {
      if (renditionRef.current) {
        renditionRef.current.destroy();
      }
    };
  }, [book]);

  // Update zoom when zoom state changes
  useEffect(() => {
    if (renditionRef.current) {
      renditionRef.current.themes.fontSize(`${zoom}%`);
    }
  }, [zoom]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleKeyNav = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrevPage();
      } else if (e.key === 'ArrowRight') {
        handleNextPage();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleKeyNav);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleKeyNav);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex flex-col">
      {/* Header Controls */}
      <div className="bg-white shadow-lg border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div>
            <h2 className="font-semibold text-gray-900">
              {showArabic ? book.title_ar || book.title : book.title}
            </h2>
            <p className="text-sm text-gray-600">
              by {showArabic ? book.author_ar || book.author : book.author}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-white rounded transition-colors"
              disabled={zoom <= 50}
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            
            <span className="px-3 py-2 text-sm font-medium min-w-[4rem] text-center">
              {zoom}%
            </span>
            
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-white rounded transition-colors"
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleResetZoom}
              className="p-2 hover:bg-white rounded transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Page Controls */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={currentPage <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">{currentPage} of {totalPages}</span>
            </div>
            
            <button
              onClick={handleNextPage}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={currentPage >= totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex items-center space-x-1">
            <button
              onClick={handleFullscreen}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Reader Content */}
      <div className="flex-1 bg-gray-100 p-4 overflow-hidden">
        <div className="w-full h-full bg-white rounded-lg shadow-lg overflow-hidden relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600 mb-4 mx-auto"></div>
                <div className="text-lg font-medium text-gray-700">Loading book...</div>
                <div className="text-sm text-gray-500 mt-2">Loading: {book.filename}</div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-white">
              <div className="text-center text-red-600 max-w-md px-4">
                <div className="text-lg font-medium mb-2">Error Loading Book</div>
                <p className="text-sm mb-4">{error}</p>
                <div className="text-xs text-gray-500 mb-4">
                  Trying to load: {book.filename}
                </div>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
          
          <div ref={viewerRef} className="w-full h-full" />
        </div>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => renditionRef.current?.display(0)}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage <= 1}
            >
              First
            </button>
            
            <button
              onClick={handlePrevPage}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage <= 1}
            >
              Previous
            </button>
            
            <div className="w-64 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalPages > 0 ? (currentPage / totalPages) * 100 : 0}%` }}
              />
            </div>
            
            <button
              onClick={handleNextPage}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage >= totalPages}
            >
              Next
            </button>
            
            <button
              onClick={() => renditionRef.current?.display(-1)}
              className="px-3 py-1 text-sm hover:bg-gray-100 rounded transition-colors"
              disabled={currentPage >= totalPages}
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookReader;
