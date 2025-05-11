"use client"

import { useState, useEffect } from "react"
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { LeitnerSystem } from "@/lib/leitner"

interface NewsArticle {
  title: string
  summary: string
  translation: string
  url: string
  source: string
  date: string
  newWords: string[]
}

export default function NewsFeed() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: 1,
      spacing: 16,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news')
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const data = await response.json()
        setArticles(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  const addWordToFlashcards = async (word: string, translation: string) => {
    try {
      // In a real app, get the user ID from auth context
      const userId = 'test-user'
      const leitner = new LeitnerSystem(userId)
      
      await leitner.addFlashcard({
        word,
        translation,
        example: '', // Would need to get this from a dictionary API
        exampleTranslation: '',
      })

      // Show success message (in a real app, use a toast)
      console.log(`Added ${word} to flashcards`)
    } catch (err) {
      console.error('Failed to add word to flashcards:', err)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-dutch-red"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider">
        {articles.map((article, idx) => (
          <div key={article.url} className="keen-slider__slide">
            <Card className="h-full shadow-card hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg text-dutch-blue">{article.title}</h3>
                    <div className="flex items-center mt-1 text-sm text-gray-500">
                      <span>{article.source}</span>
                      <span className="mx-2">•</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" asChild className="text-dutch-blue">
                    <a href={article.url} target="_blank" rel="noopener noreferrer" aria-label="Open article">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>

                <div className="space-y-3">
                  <p className="text-gray-700">{article.summary}</p>

                  <div className="pt-2">
                    <p className="text-sm text-gray-500 italic">{article.translation}</p>
                  </div>

                  <div className="pt-2">
                    <div className="text-sm font-medium mb-1">New vocabulary:</div>
                    <div className="flex flex-wrap gap-2">
                      {article.newWords.map((word) => (
                        <Badge
                          key={word}
                          variant="outline"
                          className="bg-dutch-orange/10 text-dutch-orange border-dutch-orange/20 hover:bg-dutch-orange/20 cursor-pointer"
                          onClick={() => addWordToFlashcards(word, '')} // Would need translation
                        >
                          {word}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {instanceRef.current && (
        <div className="flex justify-center mt-4 gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => instanceRef.current?.prev()}
            disabled={currentSlide === 0}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => instanceRef.current?.next()}
            disabled={currentSlide === articles.length - 1}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
