import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import NotFoundPage from '../../pages/NotFoundPage';

describe('NotFoundPage Component', () => {
  it('renders the 404 message', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );

    // Assuming the page contains something like "404" or "Not Found"
    expect(screen.getByText(/404/i) || screen.getByText(/Not Found/i)).toBeInTheDocument();
  });
});
