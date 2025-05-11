"use client"

import { CircleCheck, Flame, Brain, TrendingUp } from "lucide-react"

export default function ProgressStats() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="bg-dutch-blue/10 p-2 rounded-full mr-3">
            <Flame className="h-5 w-5 text-dutch-blue animate-flame-pulse" />
          </div>
          <div>
            <div className="text-sm font-medium text-gray-600">Current Streak</div>
            <div className="text-2xl font-bold text-gray-800">7 days</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Best</div>
          <div className="font-medium">14 days</div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">Words Mastered</span>
            <span className="text-sm font-medium text-gray-600">120/500</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-dutch-red rounded-full" style={{ width: "24%" }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">XP This Week</span>
            <span className="text-sm font-medium text-gray-600">350/500</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-dutch-red rounded-full" style={{ width: "70%" }}></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-600">News Articles Read</span>
            <span className="text-sm font-medium text-gray-600">8/10</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-dutch-red rounded-full" style={{ width: "80%" }}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-2">
        <div className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors">
          <div className="flex items-center mb-1">
            <Brain className="h-4 w-4 text-dutch-blue mr-1" />
            <span className="text-sm font-medium text-gray-600">Vocabulary</span>
          </div>
          <div className="text-xl font-bold text-gray-800">120</div>
          <div className="text-xs text-gray-500 flex items-center">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span>+12 this week</span>
          </div>
        </div>

        <div className="bg-slate-50 rounded-lg p-3 hover:bg-slate-100 transition-colors">
          <div className="flex items-center mb-1">
            <CircleCheck className="h-4 w-4 text-dutch-blue mr-1" />
            <span className="text-sm font-medium text-gray-600">Completed</span>
          </div>
          <div className="text-xl font-bold text-gray-800">42</div>
          <div className="text-xs text-gray-500 flex items-center">
            <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
            <span>+5 sessions</span>
          </div>
        </div>
      </div>
    </div>
  )
}
