import { render, fireEvent, screen, waitFor, act } from '@testing-library/react';
import App from './App';

describe('App component', () => {
    
    let originalFetch;

    beforeEach(() => {
        originalFetch = global.fetch;
        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({
                message: "Hello from mock response!"
            })
        }));
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });
    
    it('renders learn react link', () => {
      render(<App />);
      const linkElement = screen.getByText(/Submit/i);
      expect(linkElement).toBeInTheDocument();
    });
    
   it("handleSubmit sends a message and receives a response", async () => {        
        // Render the component
        render(<App />);
               
        // Fill out the chat input and submit the form
        const chatInput = screen.getByPlaceholderText('Type your message here!');
        fireEvent.change(chatInput, { target: { value: 'Hello, world!' } });        
        const submitButton = screen.getByText('Submit');
        fireEvent.click(submitButton);
        
        const loader = screen.getByTestId("loader");
        expect(loader).toBeInTheDocument();

        // Wait for the loading state to resolve and the response to be displayed
        await waitFor(() => {
          expect(loader).not.toBeInTheDocument();
          expect(screen.getByText(/Hello from mock response!/i)).toBeInTheDocument();
        });       
    });
});

