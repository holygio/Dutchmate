"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

// Sample streak data - 1 represents a day with activity
const streakData = {
  "2023-08-01": 1,
  "2023-08-02": 1,
  "2023-08-03": 1,
  "2023-08-04": 1,
  "2023-08-05": 1,
  "2023-08-06": 0,
  "2023-08-07": 0,
  "2023-08-08": 1,
  "2023-08-09": 1,
  "2023-08-10": 1,
  "2023-08-11": 1,
  "2023-08-12": 1,
  "2023-08-13": 1,
  "2023-08-14": 1,
}

export default function StreakCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const formatDateString = (year: number, month: number, day: number) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const renderCalendar = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfMonth(year, month)

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8"></div>)
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(year, month, day)
      const hasStreak = streakData[dateString] === 1

      days.push(
        <div
          key={day}
          className={`h-8 w-8 flex items-center justify-center rounded-full text-sm transition-transform hover:scale-110
            ${hasStreak ? "bg-dutch-red text-white" : "text-gray-600 hover:bg-slate-100"}`}
        >
          {day}
        </div>,
      )
    }

    return days
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevMonth}
          className="h-8 w-8 rounded-full"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-sm font-medium">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-8 w-8 rounded-full"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={index} className="text-xs font-medium text-gray-500">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>

      <div className="mt-4 flex items-center justify-center text-sm">
        <div className="flex items-center mr-4">
          <div className="h-3 w-3 rounded-full bg-dutch-red mr-1"></div>
          <span className="text-gray-600">Active</span>
        </div>
        <div className="flex items-center">
          <div className="h-3 w-3 rounded-full border border-gray-300 mr-1"></div>
          <span className="text-gray-600">Inactive</span>
        </div>
      </div>
    </div>
  )
}
