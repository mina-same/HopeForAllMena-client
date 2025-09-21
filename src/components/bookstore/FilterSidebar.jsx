import React from 'react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { X } from 'lucide-react';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';


export const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange, categories = [] }) => {
  const { t } = useTranslation('Bookstore');
  const { i18n } = useI18next();
  const currentLanguage = i18n?.resolvedLanguage || 'en';
  const handleCategoryChange = (category, checked) => {
    const newCategories = checked 
      ? [...filters.categories, category]
      : filters.categories.filter(c => c !== category);
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handleRatingChange = (rating) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? 0 : rating
    });
  };

  const handleYearChange = (year, checked) => {
    onFiltersChange({
      ...filters,
      publicationYear: checked ? year : ''
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      categories: [],
      rating: 0,
      publicationYear: '',
      inStock: undefined
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
    <>
      {/* RTL-specific styles for Arabic */}
      {currentLanguage === 'ar' && (
        <style jsx>{`
          .filter-sidebar {
            direction: rtl;
          }
          .filter-sidebar .space-x-2 {
            --tw-space-x-reverse: 1;
          }
        `}</style>
      )}
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side={currentLanguage === 'ar' ? 'right' : 'left'} className="w-80 filter-sidebar" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
          <SheetHeader>
            <SheetTitle className="flex items-center justify-between">
              {t('filters.title')}
              <div variant="ghost" size="sm" onClick={clearAllFilters}>
                {t('filters.clearAll')}
              </div>
            </SheetTitle>
          </SheetHeader>
        
        <div className="space-y-6 mt-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold text-black mb-4">{t('filters.categories.title')}</h3>
            <div className="space-y-3">
              {categories.map((category) => {
                const categoryName = currentLanguage === 'ar' ? 
                  (category.name_ar || category.name_en || category) : 
                  (category.name_en || category);
                
                return (
                  <div key={category._id || category.name_en} className="flex items-center space-x-2">
                    <Checkbox
                      id={category._id || category.name_en}
                      checked={filters.categories.includes(category.name_en || category)}
                      onCheckedChange={(checked) => 
                        handleCategoryChange(category.name_en || category, checked)
                      }
                    />
                    <label
                      htmlFor={category._id || category.name_en}
                      className="text-sm text-black cursor-pointer"
                    >
                      {categoryName}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>


          {/* Rating */}
          <div>
            <h3 className="font-semibold text-black mb-4">{t('filters.rating.title')}</h3>
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

          {/* Publication Year */}
          <div>
            <h3 className="font-semibold text-black mb-4">{t('filters.publicationYear.title')}</h3>
            <div className="space-y-3">
              {['2025', '2024'].map((year) => (
                <div key={year} className="flex items-center space-x-2">
                  <Checkbox
                    id={year}
                    checked={filters.publicationYear === year}
                    onCheckedChange={(checked) => 
                      handleYearChange(year, checked)
                    }
                  />
                  <label
                    htmlFor={year}
                    className="text-sm text-black cursor-pointer"
                  >
                    {year}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        </SheetContent>
      </Sheet>
    </>
  );
};