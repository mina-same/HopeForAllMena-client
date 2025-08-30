import React from 'react';
import { SlidersHorizontal, Grid3X3, List } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


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
                <div
                    variant="ghost"
                    onClick={onFilterToggle}
                    className="flex items-center gap-2 text-foreground hover:text-foreground"
                >
                    <SlidersHorizontal className="h-4 w-4" />
                    <span>Filter</span>
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center gap-1">
                    <div
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewModeChange('grid')}
                        className={`h-8 w-8 p-0 ${viewMode === 'grid' ? 'bg-muted' : ''}`}
                    >
                        <Grid3X3 className="h-4 w-4" />
                    </div>
                    <div
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewModeChange('list')}
                        className={`h-8 w-8 p-0 ${viewMode === 'list' ? 'bg-muted' : ''}`}
                    >
                        <List className="h-4 w-4" />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={(value) => onSortChange(value)}>
                    <SelectTrigger className="w-40 border-0 bg-transparent text-sm">
                        <SelectValue placeholder="Default sorting" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="default">Default sorting</SelectItem>
                        <SelectItem value="popularity">Sort by popularity</SelectItem>
                        <SelectItem value="rating">Sort by average rating</SelectItem>
                        <SelectItem value="date">Sort by latest</SelectItem>
                        <SelectItem value="price-low">Sort by price: low to high</SelectItem>
                        <SelectItem value="price-high">Sort by price: high to low</SelectItem>
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
                        <SelectContent>
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