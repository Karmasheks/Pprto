import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { Bell, Cog, Search, Menu, CalendarDays, RefreshCw, Plus } from "lucide-react";

export function Header() {
  const { user } = useAuth();
  const { setOpen } = useMobileSidebar();
  
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between p-4">
        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden text-gray-600 focus:outline-none dark:text-gray-300"
          onClick={() => setOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </Button>
        
        {/* Page title (mobile only) */}
        <div className="lg:hidden flex items-center">
          <div className="w-8 h-8 rounded-md bg-primary-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
              <path d="M15.5 2A1.5 1.5 0 0014 3.5v13a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-1zM9.5 6A1.5 1.5 0 008 7.5v9A1.5 1.5 0 009.5 18h1a1.5 1.5 0 001.5-1.5v-9A1.5 1.5 0 0010.5 6h-1zM3.5 10A1.5 1.5 0 002 11.5v5A1.5 1.5 0 003.5 18h1A1.5 1.5 0 006 16.5v-5A1.5 1.5 0 004.5 10h-1z" />
            </svg>
          </div>
          <h1 className="ml-2 text-lg font-semibold text-gray-800 dark:text-white">MarketMetrics</h1>
        </div>
        
        {/* Search */}
        <div className="hidden md:flex items-center ml-4 flex-1 max-w-md">
          <div className="relative w-full">
            <Input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-4 h-4" />
            </div>
          </div>
        </div>
        
        {/* Header actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <Cog className="w-5 h-5" />
          </Button>
          <div className="hidden lg:block">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-medium">
                {user?.avatar || "AM"}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sub Header with dashboard options */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-200 dark:bg-gray-700/50 dark:border-gray-600">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <h2 className="text-lg font-medium text-gray-800 dark:text-white">Team Performance Dashboard</h2>
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-300">Active</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="bg-white rounded-md border border-gray-300 inline-flex dark:bg-gray-800 dark:border-gray-600">
            <Button 
              variant="ghost" 
              className="flex items-center space-x-1 px-3 py-1.5 text-sm font-medium text-gray-700 focus:outline-none dark:text-gray-300"
            >
              <CalendarDays className="w-4 h-4 mr-1" />
              <span>Today</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-1">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </Button>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white border-gray-300 text-gray-700 p-1.5 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button className="bg-primary-600 text-white rounded-md px-3 py-1.5 text-sm font-medium">
            <Plus className="w-4 h-4 mr-1" />
            New Report
          </Button>
        </div>
      </div>
    </header>
  );
}
