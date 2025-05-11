import { render, screen, fireEvent } from '@testing-library/react';
import Flashcard from '@/components/flashcard';

describe('Flashcard', () => {
  const mockProps = {
    word: 'huis',
    translation: 'house',
    example: 'Ik woon in een groot huis.',
    exampleTranslation: 'I live in a big house.',
    onGrade: jest.fn(),
  };

  it('renders the word on the front side', () => {
    render(<Flashcard {...mockProps} />);
    expect(screen.getByText('huis')).toBeInTheDocument();
    expect(screen.getByText('Ik woon in een groot huis.')).toBeInTheDocument();
  });

  it('flips to show translation when clicked', () => {
    render(<Flashcard {...mockProps} />);
    
    // Initially, translation should not be visible
    expect(screen.queryByText('house')).not.toBeVisible();
    
    // Click the card
    fireEvent.click(screen.getByText('huis'));
    
    // Translation should now be visible
    expect(screen.getByText('house')).toBeVisible();
    expect(screen.getByText('I live in a big house.')).toBeVisible();
  });

  it('flips back to front when clicked again', () => {
    render(<Flashcard {...mockProps} />);
    
    // Click to flip to back
    fireEvent.click(screen.getByText('huis'));
    // Click to flip to front
    fireEvent.click(screen.getByText('house'));
    
    // Should show front content
    expect(screen.getByText('huis')).toBeVisible();
    expect(screen.queryByText('house')).not.toBeVisible();
  });
}); 