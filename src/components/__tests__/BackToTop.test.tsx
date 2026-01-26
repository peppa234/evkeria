import { render, screen, fireEvent } from '@testing-library/react';
import { BackToTop } from '../BackToTop';

// Mock window.scrollTo
const mockScrollTo = jest.fn();
window.scrollTo = mockScrollTo;

describe('BackToTop', () => {
  beforeEach(() => {
    mockScrollTo.mockClear();
    // Reset scroll position
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  it('should not be visible initially when scrollY is 0', () => {
    render(<BackToTop />);
    const button = screen.queryByLabelText('Back to top');
    expect(button).toHaveClass('opacity-0');
    expect(button).toHaveClass('pointer-events-none');
  });

  it('should become visible when scrolling down', () => {
    render(<BackToTop />);
    
    // Simulate scroll
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 400,
    });
    
    fireEvent.scroll(window);
    
    const button = screen.getByLabelText('Back to top');
    expect(button).toHaveClass('opacity-100');
    expect(button).not.toHaveClass('pointer-events-none');
  });

  it('should scroll to top when clicked', () => {
    render(<BackToTop />);
    
    // Make button visible
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 400,
    });
    fireEvent.scroll(window);
    
    const button = screen.getByLabelText('Back to top');
    fireEvent.click(button);
    
    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });

  it('should have correct aria-label', () => {
    render(<BackToTop />);
    const button = screen.getByLabelText('Back to top');
    expect(button).toBeInTheDocument();
  });
});
