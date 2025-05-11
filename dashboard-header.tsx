"use client"

import { useState } from "react"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
      <div className="container mx-auto px-4 py-3 max-w-screen-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="mr-2 md:mr-6">
              <span className="text-xl font-bold text-dutch-red">DutchMate</span>
              <Badge variant="outline" className="ml-2 text-xs border-dutch-blue text-dutch-blue">
                2.0
              </Badge>
            </div>

            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-dutch-red font-medium border-b-2 border-dutch-red pb-1">
                Dashboard
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-dutch-red border-b-2 border-transparent hover:border-dutch-red/50 pb-1 transition-colors"
              >
                Flashcards
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-dutch-red border-b-2 border-transparent hover:border-dutch-red/50 pb-1 transition-colors"
              >
                News
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-dutch-red border-b-2 border-transparent hover:border-dutch-red/50 pb-1 transition-colors"
              >
                Progress
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-dutch-orange"></span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <span className="text-sm">You've completed 7 days streak! 🔥</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span className="text-sm">New Dutch news available</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full" aria-label="User menu">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <span className="h-5 w-5 flex flex-col justify-center gap-1">
                  <span className="h-0.5 w-5 bg-gray-600 block"></span>
                  <span className="h-0.5 w-5 bg-gray-600 block"></span>
                  <span className="h-0.5 w-5 bg-gray-600 block"></span>
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <nav className="pt-4 pb-3 space-y-2 md:hidden">
            <a href="#" className="block py-2 px-3 text-dutch-red font-medium rounded-md bg-dutch-red/5">
              Dashboard
            </a>
            <a href="#" className="block py-2 px-3 text-gray-600 hover:text-dutch-red hover:bg-dutch-red/5 rounded-md">
              Flashcards
            </a>
            <a href="#" className="block py-2 px-3 text-gray-600 hover:text-dutch-red hover:bg-dutch-red/5 rounded-md">
              News
            </a>
            <a href="#" className="block py-2 px-3 text-gray-600 hover:text-dutch-red hover:bg-dutch-red/5 rounded-md">
              Progress
            </a>
          </nav>
        )}
      </div>
    </header>
  )
}
