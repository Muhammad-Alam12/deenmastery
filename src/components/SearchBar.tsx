import React from 'react';
import { Search, Book, Filter } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  showArabic: boolean;
}

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  categories, 
  selectedCategory, 
  onCategoryChange, 
  showArabic 
}: SearchBarProps) => {
  return (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-600 w-5 h-5" />
          <input
            type="text"
            placeholder={showArabic ? "البحث في الكتب بالعنوان أو المؤلف..." : "Search books by title or author..."}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-amber-200 rounded-full shadow-lg focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-200 transition-all duration-300 bg-white/80 backdrop-blur-sm"
          />
        </div>
        
        {searchTerm && (
          <div className="mt-2 text-center text-amber-700">
            <div className="inline-flex items-center bg-amber-100 px-4 py-2 rounded-full">
              <Book className="w-4 h-4 mr-2" />
              {showArabic ? `البحث عن: "${searchTerm}"` : `Searching for: "${searchTerm}"`}
            </div>
          </div>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        <div className="flex items-center text-amber-700 mr-2">
          <Filter className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">
            {showArabic ? "الفئات:" : "Categories:"}
          </span>
        </div>
        
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? 'bg-amber-600 text-white shadow-md transform scale-105'
                : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50 hover:border-amber-300'
            }`}
          >
            {showArabic && category === "All" ? "الكل" : category}
          </button>
        ))}
      </div>

      {/* Results Summary */}
      {selectedCategory !== "All" && (
        <div className="text-center text-amber-600">
          <div className="inline-flex items-center bg-amber-50 px-4 py-2 rounded-full border border-amber-200">
            <span className="text-sm">
              {showArabic 
                ? `تصفية حسب: ${selectedCategory}` 
                : `Filtered by: ${selectedCategory}`
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
