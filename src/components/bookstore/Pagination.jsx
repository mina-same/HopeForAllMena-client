import React from 'react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { ChevronRight, ChevronLeft } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const { t } = useTranslation('Bookstore');
    const { i18n } = useI18next();
    const currentLanguage = i18n?.resolvedLanguage || 'en';
    
    const getVisiblePages = () => {
        const pages = [];
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <>
            {/* RTL-specific styles for Arabic */}
            {currentLanguage === 'ar' && (
                <style jsx>{`
                    .pagination-container {
                        direction: rtl;
                    }
                    .pagination-container .space-x-1 {
                        --tw-space-x-reverse: 1;
                    }
                    .pagination-container .gap-1 {
                        --tw-space-x-reverse: 1;
                    }
                `}</style>
            )}
            <div className={`flex items-center justify-center space-x-1 py-8 pagination-container ${currentLanguage === 'ar' ? 'rtl' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                {/* Previous Button */}
                {currentPage > 1 && (
                    <div
                        onClick={() => onPageChange(currentPage - 1)}
                        className="cursor-pointer flex items-center gap-1 text-muted-foreground hover:text-foreground mr-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        title={t('pagination.goToPage', { number: currentPage - 1 })}
                    >
                        {currentLanguage === 'ar' ? (
                            <>
                                <span className="text-sm font-medium">{t('pagination.previous')}</span>
                                <ChevronRight className="h-4 w-4" />
                            </>
                        ) : (
                            <>
                                <ChevronLeft className="h-4 w-4" />
                                <span className="text-sm font-medium">{t('pagination.previous')}</span>
                            </>
                        )}
                    </div>
                )}

                {/* Page Numbers */}
                {getVisiblePages().map((page) => (
                    <div
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${currentPage === page
                                ? 'bg-[#2194D1] text-white shadow-md transform scale-105'
                                : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                            }`}
                        title={t('pagination.goToPage', { number: page })}
                        aria-label={t('pagination.page', { number: page })}
                        aria-current={currentPage === page ? 'page' : undefined}
                    >
                        <span className="text-sm font-medium">{page}</span>
                    </div>
                ))}

                {/* Next Button */}
                {currentPage < totalPages && (
                    <div
                        onClick={() => onPageChange(currentPage + 1)}
                        className="cursor-pointer flex items-center gap-1 text-muted-foreground hover:text-foreground ml-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                        title={t('pagination.goToPage', { number: currentPage + 1 })}
                    >
                        {currentLanguage === 'ar' ? (
                            <>
                                <ChevronLeft className="h-4 w-4" />
                                <span className="text-sm font-medium">{t('pagination.next')}</span>
                            </>
                        ) : (
                            <>
                                <span className="text-sm font-medium">{t('pagination.next')}</span>
                                <ChevronRight className="h-4 w-4" />
                            </>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};