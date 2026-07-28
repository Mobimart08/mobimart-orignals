import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import CartPage from '../../pages/CartPage';

describe('CartPage Component', () => {
  it('renders the cart header', () => {
    render(
      <BrowserRouter>
        <CartPage />
      </BrowserRouter>
    );

    // Assuming the page contains "Cart" or "Shopping Cart"
    expect(screen.getByText(/Cart/i)).toBeInTheDocument();
  });
});
