import React from 'react';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useI18next } from 'gatsby-plugin-react-i18next';

const StarRating = ({ rating, reviews }) => {
  const { t } = useTranslation('Books');
  const { language: currentLanguage } = useI18next();
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={`flex items-center gap-1 mb-2 md:mb-3 ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
      <div className={`flex items-center ${currentLanguage === 'ar' ? 'flex-row-reverse' : ''}`}>
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
            <div className={`absolute inset-0 overflow-hidden ${currentLanguage === 'ar' ? 'right-0' : 'left-0'}`} style={{ width: '50%' }}>
              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-gray-300" />
        ))}
      </div>
      <span className={`text-xs sm:text-sm text-gray-600 ${currentLanguage === 'ar' ? 'mr-1' : 'ml-1'}`}>
        ({reviews} {t('trending.reviews')})
      </span>
    </div>
  );
};

export default StarRating;
