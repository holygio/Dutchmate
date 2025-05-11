"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function MoodSelector() {
  const [mood, setMood] = useState<string>("normal")

  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case "energetic":
        return "😃"
      case "normal":
        return "😐"
      case "tired":
        return "😫"
      default:
        return "😐"
    }
  }

  const handleMoodChange = (newMood: string) => {
    setMood(newMood)

    // In a real app, this would adjust session length/difficulty
    if (newMood === "tired") {
      console.log("Activating Tired Mode: serving 3 easiest cards")
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="text-lg border-dutch-blue/20 hover:bg-dutch-blue/5 cta-hover"
          aria-label="Select your mood"
        >
          {getMoodEmoji(mood)} <span className="ml-2 text-sm">How are you feeling?</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleMoodChange("energetic")}>
          <span className="text-lg mr-2">😃</span> Energetic
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleMoodChange("normal")}>
          <span className="text-lg mr-2">😐</span> Normal
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleMoodChange("tired")}>
          <span className="text-lg mr-2">😫</span> Tired
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
