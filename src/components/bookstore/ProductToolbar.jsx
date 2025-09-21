import React from 'react';
import { useTranslation, useI18next } from 'gatsby-plugin-react-i18next';
import { SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';

export const ProductToolbar = ({
    onFilterToggle,
    viewMode,
    onViewModeChange,
    sortBy,
    onSortChange,
    itemsPerPage,
    onItemsPerPageChange
}) => {
    const { t } = useTranslation('Bookstore');
    const { i18n } = useI18next();
    const currentLanguage = i18n?.resolvedLanguage || 'en';
    return (
        <>
            {/* RTL-specific styles for Arabic */}
            {currentLanguage === 'ar' && (
                <style jsx>{`
                    .product-toolbar {
                        direction: rtl;
                    }
                    .product-toolbar .gap-6 {
                        --tw-space-x-reverse: 1;
                    }
                    .product-toolbar .gap-4 {
                        --tw-space-x-reverse: 1;
                    }
                    .product-toolbar .gap-2 {
                        --tw-space-x-reverse: 1;
                    }
                `}</style>
            )}
            <div className={`flex flex-col xs:flex-row items-start xs:items-center justify-between py-3 xs:py-4 px-3 xs:px-6 bg-background product-toolbar gap-3 xs:gap-0 ${currentLanguage === 'ar' ? 'rtl' : ''}`} dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                <div className="flex items-center gap-3 xs:gap-6 w-full xs:w-auto">
                    {/* Filter Toggle */}
                    <Button 
                        onClick={onFilterToggle}
                        variant="outline"
                        className="rounded-lg p-2 flex items-center gap-2 text-foreground hover:text-foreground text-sm xs:text-base"
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                        <span className="hidden xs:inline">{t('filters.title')}</span>
                    </Button>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`h-6 w-6 border-none rounded-md flex items-center justify-center transition-all duration-200 ${viewMode === 'grid' ? 'bg-[#2194D1] text-white shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-800'}`}
                        title={t('toolbar.viewMode.grid')}
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`h-6 w-6 border-none rounded-md flex items-center justify-center transition-all duration-200 ${viewMode === 'list' ? 'bg-[#2194D1] text-white shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-800'}`}
                        title={t('toolbar.viewMode.list')}
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 xs:gap-4 w-full xs:w-auto">
                {/* Sort Dropdown */}
                <div className="w-full xs:w-auto">
                    <Select value={sortBy} onValueChange={(value) => onSortChange(value)}>
                        <SelectTrigger className="w-full xs:w-48 sm:w-52 border border-gray-200 bg-white text-sm px-3 py-2 rounded-md hover:border-gray-300 focus:border-[#2194D1] focus:ring-1 focus:ring-[#2194D1] transition-colors">
                            <SelectValue placeholder={t('toolbar.sortBy.default')} />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                            <SelectItem value="default" className="hover:bg-gray-50 focus:bg-gray-50">{t('toolbar.sortBy.default')}</SelectItem>
                            <SelectItem value="title_asc" className="hover:bg-gray-50 focus:bg-gray-50">{t('toolbar.sortBy.title_asc')}</SelectItem>
                            <SelectItem value="title_desc" className="hover:bg-gray-50 focus:bg-gray-50">{t('toolbar.sortBy.title_desc')}</SelectItem>
                            <SelectItem value="rating_desc" className="hover:bg-gray-50 focus:bg-gray-50">{t('toolbar.sortBy.rating_desc')}</SelectItem>
                            <SelectItem value="newest" className="hover:bg-gray-50 focus:bg-gray-50">{t('toolbar.sortBy.newest')}</SelectItem>
                            <SelectItem value="oldest" className="hover:bg-gray-50 focus:bg-gray-50">{t('toolbar.sortBy.oldest')}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Items Per Page */}
                <div className="flex items-center gap-2 xs:gap-3 w-full xs:w-auto justify-between xs:justify-start">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{t('toolbar.itemsPerPage')}</span>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
                    >
                        <SelectTrigger className="w-20 xs:w-16 sm:w-20 border border-gray-200 bg-white text-sm px-3 py-1.5 rounded-md hover:border-gray-300 focus:border-[#2194D1] focus:ring-1 focus:ring-[#2194D1] transition-colors">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border border-gray-200 rounded-md shadow-lg">
                            <SelectItem value="8" className="hover:bg-gray-50 focus:bg-gray-50">8</SelectItem>
                            <SelectItem value="12" className="hover:bg-gray-50 focus:bg-gray-50">12</SelectItem>
                            <SelectItem value="16" className="hover:bg-gray-50 focus:bg-gray-50">16</SelectItem>
                            <SelectItem value="20" className="hover:bg-gray-50 focus:bg-gray-50">20</SelectItem>
                            <SelectItem value="24" className="hover:bg-gray-50 focus:bg-gray-50">24</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                </div>
            </div>
        </>
    );
};