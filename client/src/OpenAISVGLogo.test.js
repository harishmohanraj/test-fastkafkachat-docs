import { render, screen } from '@testing-library/react';
import OpenAISVGLogo from './OpenAISVGLogo';

describe('OpenAISVGLogo component', () => {
    it('renders OpenAISVGLogo', () => {
      const { container } =   render(<OpenAISVGLogo />);
      expect(container.firstChild).toHaveClass('w-1')
    });
});
