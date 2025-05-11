import { Suspense } from "react"
import { Newspaper, BookOpen, Trophy, BarChart3, Calendar, Menu } from "lucide-react"
import FlashcardSection from "@/components/flashcard-section"
import NewsFeed from "@/components/news-feed"
import ProgressStats from "@/components/progress-stats"
import LeaderboardWidget from "@/components/leaderboard-widget"
import StreakCalendar from "@/components/streak-calendar"
import LoadingSpinner from "@/components/loading-spinner"
import { DashboardHeader } from "@/components/dashboard-header"
import { MoodSelector } from "@/components/mood-selector"
import { KpiCards } from "@/components/kpi-cards"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 max-w-screen-xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-y-4">
          <h1 className="text-3xl font-bold">Welkom bij DutchMate! 🌷</h1>
          <div className="flex items-center gap-4">
            <MoodSelector />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-gradient-to-b from-dutch-blue/5 to-white">
                <div className="py-6">
                  <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                  <ProgressStats />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="mb-8 animate-slide-up">
          <KpiCards />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main learning area - 2/3 width on desktop */}
          <div className="md:col-span-2 space-y-8">
            {/* Today's learning card */}
            <div className="bg-white rounded-xl shadow-card p-6 animate-slide-up" style={{ animationDelay: "100ms" }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-dutch-blue" />
                  Today's Flashcards
                </h2>
              </div>

              <Suspense fallback={<LoadingSpinner />}>
                <FlashcardSection />
              </Suspense>
            </div>

            {/* News section - collapsible on mobile */}
            <details
              className="collapsible-section bg-white rounded-xl shadow-card p-6 animate-slide-up open"
              style={{ animationDelay: "200ms" }}
            >
              <summary className="text-xl font-semibold flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Newspaper className="mr-2 h-5 w-5 text-dutch-blue" />
                  Dutch News Summaries
                </div>
                <div className="md:hidden text-sm text-gray-500">Tap to expand</div>
              </summary>

              <Suspense fallback={<LoadingSpinner />}>
                <NewsFeed />
              </Suspense>
            </details>
          </div>

          {/* Sidebar - 1/3 width on desktop, hidden on mobile (moved to sheet) */}
          <div className="space-y-8 hidden md:block">
            {/* Progress stats */}
            <div className="bg-white rounded-xl shadow-card p-6 animate-slide-up" style={{ animationDelay: "300ms" }}>
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <BarChart3 className="mr-2 h-5 w-5 text-dutch-blue" />
                Your Progress
              </h2>
              <ProgressStats />
            </div>

            {/* Streak calendar */}
            <div className="bg-white rounded-xl shadow-card p-6 animate-slide-up" style={{ animationDelay: "400ms" }}>
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <Calendar className="mr-2 h-5 w-5 text-dutch-blue" />
                Streak Calendar
              </h2>
              <StreakCalendar />
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-xl shadow-card p-6 animate-slide-up" style={{ animationDelay: "500ms" }}>
              <h2 className="text-xl font-semibold flex items-center mb-4">
                <Trophy className="mr-2 h-5 w-5 text-dutch-blue" />
                Leaderboard
              </h2>
              <LeaderboardWidget />
            </div>
          </div>
        </div>

        {/* Mobile-only collapsible sections */}
        <div className="md:hidden space-y-8 mt-8">
          <details
            className="collapsible-section bg-white rounded-xl shadow-card p-6 animate-slide-up"
            style={{ animationDelay: "400ms" }}
          >
            <summary className="text-xl font-semibold flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-dutch-blue" />
                Streak Calendar
              </div>
              <div className="text-sm text-gray-500">Tap to expand</div>
            </summary>
            <div className="pt-4">
              <StreakCalendar />
            </div>
          </details>

          <details
            className="collapsible-section bg-white rounded-xl shadow-card p-6 animate-slide-up"
            style={{ animationDelay: "500ms" }}
          >
            <summary className="text-xl font-semibold flex items-center justify-between">
              <div className="flex items-center">
                <Trophy className="mr-2 h-5 w-5 text-dutch-blue" />
                Leaderboard
              </div>
              <div className="text-sm text-gray-500">Tap to expand</div>
            </summary>
            <div className="pt-4">
              <LeaderboardWidget />
            </div>
          </details>
        </div>
      </main>
    </div>
  )
}
