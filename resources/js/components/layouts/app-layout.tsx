import React from 'react';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppContent } from '@/components/app-content';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    variant?: 'header' | 'sidebar';
}

export function AppLayout({ children, breadcrumbs, variant = 'sidebar' }: AppLayoutProps) {
    return (
        <AppShell variant={variant}>
            <AppSidebar />
            <AppContent variant={variant}>
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <div className="px-4 pt-4">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                )}
                {children}
            </AppContent>
        </AppShell>
    );
}