"use client"
import { useState } from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background relative">
      {/* Mobile sidebar backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-200 ease-in-out md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-y-auto bg-muted/20 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
