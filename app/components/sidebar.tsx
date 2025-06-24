'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import axios from "axios";
import config from "../config";
import Swal from "sweetalert2";

export function Sidebar() {
    const [userLevel, setUserLevel] = useState('');

    useEffect(() => {
        fetchUserLevel();
    }, []);

    const pathname = usePathname();

    const fetchUserLevel = async () => {
        try {
            const token = localStorage.getItem(config.tokenKey)
            const response = await axios.get(`${config.apiUrl}/api/user/level`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            setUserLevel(response.data);
        } catch (err: any) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                // text: err.message,
                text: 'Please login.',
            });
        }
    };

    const menuItemAll = [
        { title: 'Dasboard', href: '/backoffice/dashboard', icon: 'fa-solid fa-chart-simple'},
        { title: 'พนักงานร้าน', href: '/backoffice/user', icon: 'fa-solid fa-users'},
        { title: 'บันทึกการซ่อม', href: '/backoffice/repair-record', icon: 'fa-solid fa-screwdriver'},
        { title: 'สถานะการซ่อม', href: '/backoffice/repair-status', icon: 'fa-solid fa-gear'},
        { title: 'รายงานรายได้', href: '/backoffice/income-report', icon: 'fa-solid fa-money-bill'},
        { title: 'ทะเบียนวัสดุ อุปกรณ์', href: '/backoffice/device', icon: 'fa-solid fa-box'},
        { title: 'ข้อมูลร้าน', href: '/backoffice/company', icon: 'fa-solid fa-shop'},
    ];

    let menuItem: any[] = [];

    if (userLevel === 'admin') {
        menuItem = menuItemAll;
    } else if (userLevel === 'user') {
        menuItem.push(menuItemAll[2]); // บันทึกการซ่อม
    } else if (userLevel === 'engineer') {
        menuItem.push(menuItemAll[3], menuItemAll[5]); // สถานะการซ่อม, ทะเบียนวัสดุ อุปกรณ์
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <i className="fa-solid fa-user text-4xl mr-5"></i>
                <h1 className="text-xl font-bold">Bun Service 2025</h1>
            </div>
            <nav className="sidebar-nav gb-gray-950 p-4 rounded-tl-3xl ml-4">
                <ul>
                    {menuItem.map((item) => (
                        <li key={item.title}>
                            <Link href={item.href} className={clsx("sidebar-item", pathname === item.href ? "active" : "")}>
                                <i className={item.icon + ' mr-2 w-6'}></i>
                                {item.title}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}