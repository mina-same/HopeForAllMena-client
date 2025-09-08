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
                    className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-full ${currentPage === page
                            ? 'bg-[#2194D1]/80 text-white hover:bg-[#2194D1]'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                >
                    <span className="text-lg font-medium">{page}</span>
                </div>
            ))}

            {currentPage < totalPages && (
                <div
                    variant="ghost"
                    size="sm"
                    onClick={() => onPageChange(currentPage + 1)}
                    className="cursor-pointer flex items-center gap-1 text-muted-foreground hover:text-foreground ml-2"
                >
                    NEXT
                    <ChevronRight className="h-4 w-4" />
                </div>
            )}
        </div>
    );
};