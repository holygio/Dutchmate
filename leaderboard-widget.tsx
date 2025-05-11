"use client"
import { Medal } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample leaderboard data
const leaderboardData = {
  weekly: [
    { id: 1, name: "Emma", xp: 1250, avatar: "/placeholder.svg", initials: "EM" },
    { id: 2, name: "Liam", xp: 980, avatar: "/placeholder.svg", initials: "LI" },
    { id: 3, name: "Olivia", xp: 875, avatar: "/placeholder.svg", initials: "OL" },
    { id: 4, name: "Noah", xp: 760, avatar: "/placeholder.svg", initials: "NO" },
    { id: 5, name: "Ava", xp: 650, avatar: "/placeholder.svg", initials: "AV" },
  ],
  monthly: [
    { id: 1, name: "Liam", xp: 4250, avatar: "/placeholder.svg", initials: "LI" },
    { id: 2, name: "Emma", xp: 3980, avatar: "/placeholder.svg", initials: "EM" },
    { id: 3, name: "Noah", xp: 3275, avatar: "/placeholder.svg", initials: "NO" },
    { id: 4, name: "Olivia", xp: 2760, avatar: "/placeholder.svg", initials: "OL" },
    { id: 5, name: "Ava", xp: 2150, avatar: "/placeholder.svg", initials: "AV" },
  ],
}

export default function LeaderboardWidget() {
  return (
    <Tabs defaultValue="weekly">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="weekly">Weekly</TabsTrigger>
        <TabsTrigger value="monthly">Monthly</TabsTrigger>
      </TabsList>

      <TabsContent value="weekly" className="space-y-2">
        {leaderboardData.weekly.map((user, index) => (
          <LeaderboardRow
            key={user.id}
            rank={index + 1}
            name={user.name}
            xp={user.xp}
            avatar={user.avatar}
            initials={user.initials}
          />
        ))}
      </TabsContent>

      <TabsContent value="monthly" className="space-y-2">
        {leaderboardData.monthly.map((user, index) => (
          <LeaderboardRow
            key={user.id}
            rank={index + 1}
            name={user.name}
            xp={user.xp}
            avatar={user.avatar}
            initials={user.initials}
          />
        ))}
      </TabsContent>
    </Tabs>
  )
}

interface LeaderboardRowProps {
  rank: number
  name: string
  xp: number
  avatar: string
  initials: string
}

function LeaderboardRow({ rank, name, xp, initials }: LeaderboardRowProps) {
  // Determine medal color for top 3
  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-amber-700"
      default:
        return "text-gray-300"
    }
  }

  return (
    <div
      className={`flex items-center p-2 rounded-lg transition-colors hover:bg-slate-50 ${rank <= 3 ? "bg-dutch-red/5" : ""}`}
    >
      <div className="w-8 flex justify-center">
        {rank <= 3 ? (
          <Medal className={`h-5 w-5 ${getMedalColor(rank)}`} />
        ) : (
          <span className="text-gray-500 font-medium">{rank}</span>
        )}
      </div>

      <Avatar className="h-8 w-8 mr-2 border-2 border-white shadow-sm">
        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={name} />
        <AvatarFallback className="bg-dutch-blue/10 text-dutch-blue">{initials}</AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="font-medium text-sm">{name}</div>
      </div>

      <div className="text-sm font-medium">{xp.toLocaleString()} XP</div>
    </div>
  )
}
