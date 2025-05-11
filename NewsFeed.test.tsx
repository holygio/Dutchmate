import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { screen, waitFor } from '@testing-library/dom'
import '@testing-library/jest-dom'
import NewsFeed from '@/components/news-feed'
import { LeitnerSystem } from '@/lib/leitner'

// Mock fetch
global.fetch = jest.fn()

// Mock LeitnerSystem
jest.mock('@/lib/leitner', () => ({
  LeitnerSystem: jest.fn().mockImplementation(() => ({
    addFlashcard: jest.fn().mockResolvedValue({}),
  })),
}))

const MockedLeitnerSystem = LeitnerSystem as jest.MockedClass<typeof LeitnerSystem>

describe('NewsFeed', () => {
  const mockArticles = [
    {
      title: 'Test Article 1',
      summary: 'Test Summary 1',
      translation: 'Test Translation 1',
      url: 'https://test1.com',
      source: 'Test Source 1',
      date: '2024-01-01',
      newWords: ['word1', 'word2'],
    },
    {
      title: 'Test Article 2',
      summary: 'Test Summary 2',
      translation: 'Test Translation 2',
      url: 'https://test2.com',
      source: 'Test Source 2',
      date: '2024-01-02',
      newWords: ['word3', 'word4'],
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockArticles),
    })
  })

  it('renders loading state initially', () => {
    render(<NewsFeed />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders articles after loading', async () => {
    render(<NewsFeed />)

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument()
    })

    expect(screen.getByText('Test Summary 1')).toBeInTheDocument()
    expect(screen.getByText('Test Translation 1')).toBeInTheDocument()
    expect(screen.getByText('word1')).toBeInTheDocument()
  })

  it('handles API errors', async () => {
    ;(global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'))

    render(<NewsFeed />)

    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument()
    })

    expect(screen.getByText('Try Again')).toBeInTheDocument()
  })

  it('adds word to flashcards when clicked', async () => {
    const user = userEvent.setup()
    render(<NewsFeed />)

    await waitFor(() => {
      expect(screen.getByText('word1')).toBeInTheDocument()
    })

    await user.click(screen.getByText('word1'))

    expect(MockedLeitnerSystem).toHaveBeenCalledWith('test-user')
    const mockInstance = MockedLeitnerSystem.mock.results[0].value
    expect(mockInstance.addFlashcard).toHaveBeenCalledWith({
      word: 'word1',
      translation: '',
      example: '',
      exampleTranslation: '',
    })
  })

  it('navigates between articles', async () => {
    const user = userEvent.setup()
    render(<NewsFeed />)

    await waitFor(() => {
      expect(screen.getByText('Test Article 1')).toBeInTheDocument()
    })

    // Initially, prev button should be disabled
    const prevButton = screen.getByRole('button', { name: /previous/i })
    expect(prevButton).toBeDisabled()

    // Click next
    const nextButton = screen.getByRole('button', { name: /next/i })
    await user.click(nextButton)

    await waitFor(() => {
      expect(screen.getByText('Test Article 2')).toBeInTheDocument()
    })

    // Now prev button should be enabled and next button disabled
    expect(prevButton).toBeEnabled()
    expect(nextButton).toBeDisabled()
  })
}) 