import React, { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Home, Users, UserPlus, TrendingUp, BarChart3, Settings, LayoutDashboard, Trophy } from 'lucide-react';

export interface BreadcrumbItem {
    title: string;
    path: string;
    icon?: React.ReactNode;
}

interface BreadcrumbContextType {
    breadcrumbs: BreadcrumbItem[];
    description?: string;
    actions?: React.ReactNode;
    setPageMeta: (meta: { description?: string; actions?: React.ReactNode }) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

const iconMap: Record<string, React.ReactNode> = {
    'admin': <Home size={14} />,
    'dashboard': <LayoutDashboard size={14} />,
    'match-setup': <Trophy size={14} />,
    'team-management': <Users size={14} />,
    'player-management': <UserPlus size={14} />,
    'score-updates': <TrendingUp size={14} />,
    'score-edit': <TrendingUp size={14} />,
    'statistics': <BarChart3 size={14} />,
    'settings': <Settings size={14} />,
};

const titleMap: Record<string, string> = {
    'admin': 'Home',
    'dashboard': 'Dashboard',
    'match-setup': 'Match Setup',
    'team-management': 'Team Management',
    'player-management': 'Player Management',
    'score-updates': 'Score Updates',
    'score-edit': 'Score Editor',
    'statistics': 'Statistics',
    'settings': 'Settings',
};

export const BreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const [meta, setMeta] = useState<{ description?: string; actions?: React.ReactNode }>({});

    // Reset meta on path change
    useEffect(() => {
        setMeta({});
    }, [location.pathname]);

    const breadcrumbs = useMemo(() => {
        const paths = location.pathname.split('/').filter(Boolean);
        const crumbs: BreadcrumbItem[] = [];
        let currentPath = '';

        paths.forEach((segment) => {
            currentPath += `/${segment}`;
            const title = titleMap[segment] || segment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            const icon = iconMap[segment];
            crumbs.push({ title, path: currentPath, icon });
        });
        return crumbs;
    }, [location.pathname]);

    const setPageMeta = useCallback((newMeta: { description?: string; actions?: React.ReactNode }) => {
        setMeta(newMeta);
    }, []);

    return (
        <BreadcrumbContext.Provider value={{ breadcrumbs, ...meta, setPageMeta }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumbs = () => {
    const context = useContext(BreadcrumbContext);
    if (!context) {
        throw new Error('useBreadcrumbs must be used within BreadcrumbProvider');
    }
    return context;
};
