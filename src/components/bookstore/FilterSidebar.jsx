import React from 'react';
import { X } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import { categories } from '../../data/books';


export const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const handleCategoryChange = (category, checked) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handlePriceRangeChange = (values) => {
    onFiltersChange({
      ...filters,
      priceRange: [values[0], values[1]]
    });
  };

  const handleRatingChange = (rating) => {
    onFiltersChange({
      ...filters,
      rating
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      priceRange: [0, 1000],
      rating: 0
    });
  };

  const renderStars = (count) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm cursor-pointer ${
              star <= count ? 'text-star' : 'text-[#2194D1]'
            }`}
            onClick={() => handleRatingChange(count)}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-80">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            Filters
            <div variant="ghost" size="sm" onClick={clearAllFilters}>
              Clear All
            </div>
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-black mb-4">Categories</h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={filters.categories.includes(category)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category, checked)
                    }
                  />
                  <label
                    htmlFor={category}
                    className="text-sm text-black cursor-pointer"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          {/* <div>
            <h3 className="font-semibold text-black mb-4">Price Range</h3>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={1000}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between mt-2 text-sm text-[#777]">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div> */}

          {/* Rating */}
          <div>
            <h3 className="font-semibold text-black mb-4">Rating</h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div 
                  key={rating} 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => handleRatingChange(rating)}
                >
                  <Checkbox
                    checked={filters.rating === rating}
                  />
                  <div className="flex items-center gap-1">
                    {renderStars(rating)}
                    <span className="text-sm text-black ml-1">& Up</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Status */}
          <div>
            <h3 className="font-semibold text-black mb-4">Availability</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="in-stock"
                  checked={filters.inStock === true}
                  onCheckedChange={(checked) => 
                    onFiltersChange({
                      ...filters,
                      inStock: checked ? true : undefined
                    })
                  }
                />
                <label htmlFor="in-stock" className="text-sm text-black cursor-pointer">
                  Published
                </label>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};