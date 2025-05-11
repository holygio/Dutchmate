"use client"

import type React from "react"

import { Flame, Brain, CircleCheck, TrendingUp } from "lucide-react"

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        icon={<Flame className="h-5 w-5 text-dutch-blue" />}
        title="Current Streak"
        value="7"
        unit="days"
        trend={
          <>
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span>+3 this week</span>
          </>
        }
        isStreak={true}
        progress={50}
      />

      <KpiCard
        icon={<Brain className="h-5 w-5 text-dutch-blue" />}
        title="Words Mastered"
        value="120"
        unit="words"
        trend={
          <>
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span>+12 this week</span>
          </>
        }
        progress={24}
      />

      <KpiCard
        icon={<CircleCheck className="h-5 w-5 text-dutch-blue" />}
        title="XP This Week"
        value="350"
        unit="points"
        trend={
          <>
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span>+120 from last week</span>
          </>
        }
        progress={70}
      />

      <KpiCard
        icon={<Newspaper className="h-5 w-5 text-dutch-blue" />}
        title="News Articles Read"
        value="8"
        unit="articles"
        trend={
          <>
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span>+2 this week</span>
          </>
        }
        progress={80}
      />
    </div>
  )
}

interface KpiCardProps {
  icon: React.ReactNode
  title: string
  value: string
  unit: string
  trend: React.ReactNode
  progress: number
  isStreak?: boolean
}

function KpiCard({ icon, title, value, unit, trend, progress, isStreak = false }: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center mb-3">
        <div className="bg-dutch-blue/10 p-2 rounded-full mr-3">
          {isStreak && Number.parseInt(value) >= 7 ? <div className="animate-flame-pulse">{icon}</div> : icon}
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600">{title}</div>
          <div className="text-2xl font-bold text-gray-800">
            {value} <span className="text-sm font-normal text-gray-500">{unit}</span>
          </div>
        </div>
      </div>

      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-dutch-red rounded-full" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="mt-2 text-xs text-gray-500 flex items-center">{trend}</div>
    </div>
  )
}

function Newspaper(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
      <path d="M18 14h-8" />
      <path d="M15 18h-5" />
      <path d="M10 6h8v4h-8V6Z" />
    </svg>
  )
}
