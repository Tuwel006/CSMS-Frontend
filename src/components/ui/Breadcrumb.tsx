import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useBreadcrumbs } from '../../context/BreadcrumbContext';

const Breadcrumb: React.FC = () => {
    const { breadcrumbs } = useBreadcrumbs();

    if (breadcrumbs.length === 0) return null;

    return (
        <nav className="flex items-center gap-2 text-sm px-4 py-3 bg-white dark:bg-[#17283b] border-b border-[var(--card-border)]">
            {breadcrumbs.map((crumb, index) => (
                <React.Fragment key={crumb.path}>
                    {index > 0 && (
                        <ChevronRight size={14} className="text-gray-400 dark:text-gray-600" />
                    )}
                    {index < breadcrumbs.length - 1 ? (
                        <Link
                            to={crumb.path}
                            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"
                        >
                            {crumb.icon}
                            <span>{crumb.title}</span>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-1.5 text-gray-900 dark:text-white font-semibold">
                            {crumb.icon}
                            <span>{crumb.title}</span>
                        </div>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
};

export default Breadcrumb;
