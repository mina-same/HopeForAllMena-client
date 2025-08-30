import React from 'react';
import { ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getVisiblePages = () => {
        const pages = [];
        for (let i = 1; i <= Math.min(5, totalPages); i++) {
            pages.push(i);
        }
        return pages;
    };

    return (
        <div className="flex items-center justify-center space-x-1 py-8">
            {getVisiblePages().map((page) => (
                <div
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(page)}
                    className={`w-10 h-10 rounded-full ${currentPage === page
                            ? 'bg-orange-primary text-white hover:bg-orange-primary'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    {page}
                </div>
            ))}

            {currentPage < totalPages && (
                <div
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    className="flex items-center gap-1 text-muted-foreground hover:text-foreground ml-2"
                >
                    NEXT
                    <ChevronRight className="h-4 w-4" />
                </div>
            )}
        </div>
    );
};