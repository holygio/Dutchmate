import { NextRequest } from 'next/server';
import { GET } from '@/app/api/news/route';

// Mock fetch
global.fetch = jest.fn();

// Mock OpenAI
jest.mock('openai', () => {
  return {
    default: jest.fn().mockImplementation(() => ({
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: JSON.stringify({
                    summary: "Dit is een test samenvatting. Het bevat drie zinnen. Het is in het Nederlands.",
                    translation: "This is a test summary. It contains three sentences. It is in Dutch.",
                    newWords: ["samenvatting", "zinnen", "Nederlands"],
                  }),
                },
              },
            ],
          }),
        },
      },
    })),
  };
});

describe('News API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch and process news articles', async () => {
    const mockArticles = {
      articles: [
        {
          title: 'Test Article',
          description: 'Test Description',
          url: 'https://test.com',
          source: { name: 'Test Source' },
          publishedAt: '2024-01-01T12:00:00Z',
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockArticles),
    });

    const request = new NextRequest('http://localhost/api/news');
    const response = await GET(request);
    const data = await response.json();

    expect(data).toHaveLength(1);
    expect(data[0]).toMatchObject({
      title: 'Test Article',
      summary: expect.any(String),
      translation: expect.any(String),
      url: 'https://test.com',
      source: 'Test Source',
      date: expect.any(String),
      newWords: expect.arrayContaining(['samenvatting', 'zinnen', 'Nederlands']),
    });
  });

  it('should handle API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const request = new NextRequest('http://localhost/api/news');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ error: 'Failed to fetch news' });
  });
}); 