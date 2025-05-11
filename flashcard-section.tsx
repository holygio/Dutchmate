"use client"

import { useState, useEffect } from "react"
import { Volume2, ThumbsUp, ThumbsDown, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import FlashcardComponent from "@/components/flashcard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { leitnerSystem } from "@/lib/firebase"
import type { Flashcard } from "@/lib/firebase"
import { useAuth } from "@/hooks/use-auth"
import { useToast } from "@/components/ui/use-toast"

export default function FlashcardSection() {
  const [cards, setCards] = useState<Flashcard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (!user) return

    const loadDueCards = async () => {
      try {
        setLoading(true)
        const dueCards = await leitnerSystem.getDueFlashcards(user.uid)
        setCards(dueCards)
      } catch (error) {
        console.error('Error loading flashcards:', error)
        toast({
          title: "Error",
          description: "Failed to load flashcards. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDueCards()
  }, [user])

  const handleGrade = async (grade: "easy" | "hard") => {
    if (!user || !cards.length) return

    const currentCard = cards[currentCardIndex]
    
    try {
      await leitnerSystem.updateFlashcardBox(user.uid, currentCard.id, grade === "easy")
      
      // Move to next card or reset if we're at the end
      if (currentCardIndex < cards.length - 1) {
        setCurrentCardIndex(currentCardIndex + 1)
      } else {
        // Reload cards if we've gone through all of them
        const newDueCards = await leitnerSystem.getDueFlashcards(user.uid)
        setCards(newDueCards)
        setCurrentCardIndex(0)
      }
    } catch (error) {
      console.error('Error updating flashcard:', error)
      toast({
        title: "Error",
        description: "Failed to update flashcard progress. Please try again.",
        variant: "destructive",
      })
    }
  }

  const playPronunciation = async () => {
    if (!cards.length || isPlaying) return

    try {
      setIsPlaying(true)
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cards[currentCardIndex].word }),
      });

      if (!response.ok) {
        throw new Error('Failed to get audio');
      }

      const { audioUrl } = await response.json();
      const audio = new Audio(audioUrl);
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        toast({
          title: "Error",
          description: "Failed to play pronunciation. Please try again.",
          variant: "destructive",
        });
      };

      await audio.play();
    } catch (error) {
      console.error('Error playing pronunciation:', error);
      setIsPlaying(false);
      toast({
        title: "Error",
        description: "Failed to play pronunciation. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dutch-blue"></div>
      </div>
    )
  }

  if (!cards.length) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium">No cards due for review!</h3>
        <p className="text-gray-500 mt-2">Check back later for more cards to review.</p>
      </div>
    )
  }

  const currentCard = cards[currentCardIndex]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{cards.length - currentCardIndex} cards remaining</span>
        <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1 rounded-full">
          <Clock className="h-4 w-4 text-dutch-blue" />
          <span className="text-sm text-gray-600">Box {currentCard.box}</span>
          <span className="text-sm text-gray-500">•</span>
          <span className="text-sm text-gray-600">
            {currentCardIndex + 1}/{cards.length}
          </span>
        </div>
      </div>

      <FlashcardComponent
        word={currentCard.word}
        translation={currentCard.translation}
        example={currentCard.example}
        exampleTranslation={currentCard.exampleTranslation}
        onGrade={handleGrade}
      />

      <div className="flex justify-between pt-4">
        <div className="flex items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={playPronunciation}
                  disabled={isPlaying}
                  className={isPlaying ? 'opacity-50' : ''}
                  aria-label="Listen to pronunciation"
                >
                  <Volume2 className="h-5 w-5 text-dutch-blue" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Listen to pronunciation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleGrade("hard")}
                  className="h-10 w-10 rounded-full border-dutch-red/20 text-dutch-red hover:bg-dutch-red/5 hover:text-dutch-red cta-hover"
                  aria-label="Hard"
                >
                  <ThumbsDown className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark as hard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  onClick={() => handleGrade("easy")}
                  className="h-10 w-10 rounded-full bg-dutch-orange hover:bg-dutch-orange/90 text-white cta-hover"
                  aria-label="Easy"
                >
                  <ThumbsUp className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Mark as easy</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </div>
  )
}
