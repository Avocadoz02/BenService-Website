'use client'

import { Sidebar } from "../components/sidebar";
import { TopNav } from "../components/top-nav";
import { useEffect } from "react";
import config from "../config";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";

export default function DashboardLayout({
    children
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        fetchUsersAccess();
    }, []);

    const fetchUsersAccess = async () => {
        const token = localStorage.getItem(config.tokenKey)
        if (!token) {
            router.replace('/');
            return;
        }

        const level = localStorage.getItem('bun_service_level')
        if (level === 'user' && pathname !== '/backoffice/repair-record') {
            Swal.fire({
                title: 'Access Denied',
                icon: 'error',
                text: 'You cannot access to this page',
                timer: 3000
            }).then(() => {
                router.replace('/backoffice/repair-record');
            });
        }

        if (level === 'engineer' && pathname !== '/backoffice/repair-status' && pathname !== '/backoffice/device') {
            Swal.fire({
                title: 'Access Denied',
                icon: 'error',
                text: 'You cannot access to this page',
                timer: 3000
            }).then(() => {
                router.replace('/backoffice/repair-status');
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <TopNav />

            <div className="flex bg-gray-800">
                <Sidebar />
                <main className="flex-1 p-6 bg-gradient-to-t from-gray-600 to-gray-950 rounded-tl-3xl">
                    {children}
                </main>
            </div>
        </div>
    );
}