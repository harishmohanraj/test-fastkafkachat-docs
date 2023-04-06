import { render, screen } from '@testing-library/react';
import Modal from './Modal';

describe('Modal component', () => {
    it('renders Modal', () => {
      render(<Modal />);
      const modalElement = screen.getByTestId("modal");
      expect(modalElement).toBeInTheDocument();
    });
});
