import React from 'react';
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
    return (
        <div className="flex items-center justify-between py-4 px-6 bg-background">
            <div className="flex items-center gap-6">
                {/* Filter Toggle */}
                <Button 
                    onClick={onFilterToggle}
                    variant="outline"
                    className="rounded-lg p-2 flex items-center gap-2 text-foreground hover:text-foreground"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filter</span>
                </Button>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={`h-6 w-6 border-none rounded-md flex items-center justify-center transition-all duration-200 ${viewMode === 'grid' ? 'bg-[#2194D1] text-white shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-800'}`}
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={`h-6 w-6 border-none rounded-md flex items-center justify-center transition-all duration-200 ${viewMode === 'list' ? 'bg-[#2194D1] text-white shadow-sm' : 'text-gray-600 hover:bg-white hover:text-gray-800'}`}
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={(value) => onSortChange(value)}>
                    <SelectTrigger className="w-40 border-0 bg-transparent text-sm">
                        <SelectValue placeholder="Default sorting" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                        <SelectItem value="default">Default sorting</SelectItem>
                        <SelectItem value="popularity">Sort by popularity</SelectItem>
                        <SelectItem value="rating">Sort by average rating</SelectItem>
                        <SelectItem value="date">Sort by latest</SelectItem>
                    </SelectContent>
                </Select>

                {/* Items Per Page */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Show</span>
                    <Select
                        value={itemsPerPage.toString()}
                        onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
                    >
                        <SelectTrigger className="w-12 border-0 bg-transparent text-sm">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white">
                            <SelectItem value="8">8</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="16">16</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};