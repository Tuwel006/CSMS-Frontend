import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { useBreadcrumbs } from '../../context/BreadcrumbContext';

const PageHeader: React.FC = () => {
    const { breadcrumbs, description, actions } = useBreadcrumbs();
    const navigate = useNavigate();

    // Get the current page title (last breadcrumb)
    const currentPage = breadcrumbs[breadcrumbs.length - 1];
    const showBack = breadcrumbs.length > 1;

    const handleBack = () => {
        navigate(-1);
    };

    const BreadcrumbNav = ({ className = "" }) => (
        <nav className={`flex items-center gap-1 overflow-x-auto no-scrollbar ${className}`}>
            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                    {index > 0 && (
                        <ChevronRight size={10} className="text-gray-300 dark:text-gray-700 flex-shrink-0" />
                    )}
                    <Link
                        to={crumb.path}
                        className={`text-[8px] md:text-[9px] uppercase font-bold tracking-widest transition-colors whitespace-nowrap ${index === breadcrumbs.length - 1
                            ? "text-cyan-600 dark:text-cyan-400"
                            : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                            }`}
                    >
                        {crumb.title}
                    </Link>
                </React.Fragment>
            ))}
        </nav>
    );

    const ActionButtons = ({ isMobile = false }) => (
        <div className={`flex items-center ${isMobile ? 'gap-1.5' : 'gap-2'} flex-shrink-0`}>
            {actions}
            {showBack && (
                <button
                    onClick={handleBack}
                    className={`group flex items-center gap-1 font-bold uppercase tracking-widest text-gray-500 hover:text-cyan-600 dark:text-gray-400 dark:hover:text-cyan-400 border border-[var(--card-border)] rounded-xs bg-[var(--hover-bg)] hover:bg-[var(--card-bg)] transition-all shadow-sm ${isMobile ? 'px-1.5 py-0.5 text-[8px]' : 'px-2.5 py-1 text-[10px]'}`}
                >
                    <ArrowLeft size={isMobile ? 10 : 12} className="group-hover:-translate-x-0.5 transition-transform" />
                    <span>Back</span>
                </button>
            )}
        </div>
    );

    return (
        <div className="bg-[var(--bg)] border-b border-[var(--card-border)] px-4 md:px-6 transition-all py-1.5 md:py-2.5">
            {/* Mobile View - Stacked */}
            <div className="md:hidden flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-4">
                    <BreadcrumbNav className="flex-1" />
                    <ActionButtons isMobile={true} />
                </div>
                <div className="min-w-0">
                    {currentPage && (
                        <h1 className="text-sm font-bold text-[var(--text)] tracking-tight truncate leading-tight uppercase">
                            {currentPage.title}
                        </h1>
                    )}
                    {description && (
                        <p className="text-[8px] text-[var(--text-secondary)] font-bold uppercase tracking-wider truncate">
                            {description}
                        </p>
                    )}
                </div>
            </div>

            {/* Desktop View - Single Row (Previous Layout Style) */}
            <div className="hidden md:flex items-center justify-between gap-4">
                <div className="flex flex-col justify-center min-w-0 flex-1">
                    <div className="flex items-center gap-3 min-w-0">
                        {currentPage && (
                            <h1 className="text-lg font-bold text-[var(--text)] tracking-tight truncate leading-none uppercase">
                                {currentPage.title}
                            </h1>
                        )}
                        <div className="h-4 w-[1px] bg-gray-200 dark:bg-gray-800 flex-shrink-0" />
                        <BreadcrumbNav className="min-w-0" />
                    </div>
                    {description && (
                        <p className="text-[10px] text-[var(--text-secondary)] font-bold mt-1 uppercase tracking-wider">
                            {description}
                        </p>
                    )}
                </div>
                <ActionButtons />
            </div>
        </div>
    );
};

export default PageHeader;
