import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Leftover from './Leftover';
import { getLeftovers } from '../api/product';
import { useAuth } from '../context/AuthContext';
import { BrowserRouter } from 'react-router-dom';

jest.mock('../api/product', () => ({
  getLeftovers: jest.fn(),
}));

jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('../components/ProductCard', () => {
  return function MockProductCard({ product }) {
    return <div data-testid="product-card">{product.name}</div>;
  };
});

describe('Leftover Page UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue({
      user: { firstName: 'Test', lastName: 'User', role: 'EMPLOYER' },
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <Leftover />
      </BrowserRouter>
    );
  };

  it('renders default threshold (10) and fetches data', async () => {
    getLeftovers.mockResolvedValue([]);
    
    await act(async () => {
      renderComponent();
    });

    expect(getLeftovers).toHaveBeenCalledWith(10);
    expect(screen.getByText('Отчёт по остаткам')).toBeInTheDocument();
    
    expect(screen.getByText('Всё отлично!')).toBeInTheDocument();
  });

  it('changes threshold and fetches new data on button click', async () => {
    getLeftovers.mockResolvedValue([]);
    
    await act(async () => {
      renderComponent();
    });

    const btn20 = screen.getByRole('button', { name: /Меньше 20 штук/i });
    
    await act(async () => {
      userEvent.click(btn20);
    });

    expect(getLeftovers).toHaveBeenCalledWith(20);
    
    const btn30 = screen.getByRole('button', { name: /Меньше 30 штук/i });
    await act(async () => {
      userEvent.click(btn30);
    });

    expect(getLeftovers).toHaveBeenCalledWith(30);
  });

  it('renders ProductCards when products are returned', async () => {
    getLeftovers.mockResolvedValue([
      { barcode: '123', name: 'Product 1' },
      { barcode: '456', name: 'Product 2' },
    ]);

    await act(async () => {
      renderComponent();
    });

    await waitFor(() => {
      expect(screen.getAllByTestId('product-card')).toHaveLength(2);
    });
    
    expect(screen.getByText('Product 1')).toBeInTheDocument();
  });
});
