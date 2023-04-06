import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader component', () => {
     it('renders Loader', () => {
      const { container } =   render(<Loader />);
      expect(container.firstChild).toHaveClass('loader')
    });
});
