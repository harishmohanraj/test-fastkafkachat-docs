import { render, screen, fireEvent } from '@testing-library/react';
import ChatBox from './ChatBox';

describe('ChatBox component', () => {
    
    it('renders ChatBox container', () => {
    const chatLog = [
      {
        role: "assistant",
        content:
          "Hi, I'm Capt'n AI, a chat bot that specializes in optimizing Google Ads campaigns. How can I help you today?",
        htmlContent:
          "Hi, I'm Capt'n AI, a chat bot that specializes in optimizing Google Ads campaigns. How can I help you today?",
      },
    ]
    render(<ChatBox chatLog={chatLog}/>);
    const linkElement = screen.getByText(/Submit/i);
    expect(linkElement).toBeInTheDocument();
    
});

it('renders OpenAISVGLogo if message.user is assistant', () => {
    const chatLog = [
      {
        role: "assistant",
        content:
          "Hello!",
        htmlContent:
          "Hello!",
      },
    ]
    const { container } = render(<ChatBox chatLog={chatLog}/>);
    expect(container.querySelector('.avatar').innerHTML).toContain('<div class=\"w-1\">');
    expect(container.querySelector('.avatar').innerHTML).not.toContain('<div>You');

});

it('renders "You" if message.user is not assistant', () => {
    const chatLog = [
      {
        role: "user",
        content:
          "Who are you",
        htmlContent:
          "Who are you",
      },
    ]
    const { container } = render(<ChatBox chatLog={chatLog}/>);
    expect(container.querySelector('.avatar').innerHTML).toContain('<div>You');
    expect(container.querySelector('.avatar').innerHTML).not.toContain('<div class=\"w-1\">');
});

 it('calls setChatInput with the input value when the input value changes', () => {
    const setChatInput = jest.fn();
    const chatInput = 'Hello!';
    const { getByPlaceholderText } = render(
      <ChatBox chatLog={[]} setChatInput={setChatInput} handleSubmit={() => {}} chatInput={chatInput} />
    );
    const input = getByPlaceholderText('Type your message here!');
    const newValue = 'Goodbye!';
    fireEvent.change(input, { target: { value: newValue } });
    expect(setChatInput).toHaveBeenCalledWith(newValue);
  });

});
