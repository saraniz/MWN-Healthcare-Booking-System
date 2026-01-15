// components/DoctorSidebar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Calendar,
  Users,
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Settings,
  FileText,
  BarChart3,
  MessageSquare,
  Heart,
  Pill
} from 'lucide-react';

interface DoctorSidebarProps {
  doctorName?: string;
  doctorSpecialization?: string;
}

export default function DoctorSidebar({ 
  doctorName = "Dr. Sarah Johnson",
  doctorSpecialization = "Cardiologist"
}: DoctorSidebarProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/doctor/dashboard',
      icon: LayoutDashboard,
      isActive: pathname === '/doctor/dashboard'
    },
    {
      name: 'Appointments',
      href: '/doctor/appointments',
      icon: Calendar,
      isActive: pathname === '/doctor/appointments'
    },
    {
      name: 'Patients',
      href: '/doctor/patients',
      icon: Users,
      isActive: pathname === '/doctor/patients'
    },
    {
      name: 'Settings',
      href: '/doctor/settings',
      icon: Settings,
      isActive: pathname === '/doctor/settings'
    }
  ];

  const handleLogout = () => {
    // Add your logout logic here
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <Link href="/" className="block">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0A8F7A] to-[#06D6A0] flex items-center justify-center shadow-sm">
              <Heart className="h-6 w-6 text-white" />
            </div>
            
           
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-black">MWN</h2>
                <p className="text-sm text-gray-600">MediCare Wellness Network</p>
              </div>
            
          </div>
        </div>
        </Link>

        {/* Doctor Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
                alt="Doctor"
                className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{doctorName}</p>
              <p className="text-xs text-gray-600 truncate">{doctorSpecialization}</p>
            </div>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="p-1 hover:bg-gray-100 rounded-lg"
            >
              <Bell className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      item.isActive
                        ? 'bg-gradient-to-r from-[#0A8F7A] to-[#06D6A0] text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon className={`w-5 h-5 ${item.isActive ? 'text-white' : 'text-gray-500'}`} />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Stats */}
        <div className="px-4 py-6 border-t border-gray-200">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Today's Patients</span>
              <span className="text-lg font-bold text-gray-900">12</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Waiting</span>
              <span className="text-lg font-bold text-gray-900">3</span>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}