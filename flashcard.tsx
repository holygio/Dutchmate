"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface FlashcardProps {
  word: string
  translation: string
  example: string
  exampleTranslation: string
  onGrade: (grade: "easy" | "hard") => void
}

export default function Flashcard({ word, translation, example, exampleTranslation, onGrade }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="relative w-full h-64 perspective cursor-pointer" onClick={handleFlip}>
      <div
        className={`relative w-full h-full transform-style-3d card-flip-transition ${isFlipped ? "rotate-y-180" : ""}`}
      >
        {/* Front of card */}
        <Card
          className={`absolute w-full h-full backface-hidden ${isFlipped ? "invisible" : ""} shadow-card hover:shadow-lg transition-shadow`}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <h3 className="text-3xl font-bold text-dutch-red mb-4">{word}</h3>
            <p className="text-gray-600 text-center italic">{example}</p>
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">Tap to flip</div>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card
          className={`absolute w-full h-full backface-hidden rotate-y-180 ${isFlipped ? "" : "invisible"} shadow-card hover:shadow-lg transition-shadow`}
        >
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <h3 className="text-3xl font-bold text-dutch-red mb-2">{translation}</h3>
            <p className="text-gray-600 text-center mb-4">{word}</p>
            <div className="border-t border-gray-100 pt-4 w-full">
              <p className="text-gray-600 text-center italic">{exampleTranslation}</p>
              <p className="text-gray-500 text-center text-sm mt-2">{example}</p>
            </div>
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">Tap to flip back</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
