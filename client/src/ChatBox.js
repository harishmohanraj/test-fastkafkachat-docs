import ReactMarkdown from 'react-markdown'
import SyntaxHighlighter from 'react-syntax-highlighter';
import { githubGist } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import OpenAISVGLogo from './OpenAISVGLogo'

// Primary Chat Window
const ChatBox = ({chatLog, setChatInput, handleSubmit, chatInput}) =>
  <section className="chatbox">
      <div className="chat-log">
        {chatLog.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </div>
        <div className="chat-input-holder">
      <form className="form" onSubmit={handleSubmit}>
          <input 
          rows="1"
          value={chatInput}
          onChange={(e)=> setChatInput(e.target.value)}
          placeholder={"Type your question here!"}
          className="chat-input-textarea" ></input>
          <button className="submit" type="submit">Submit</button>
          </form>
        </div>
      </section>

// Individual Chat Message
const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.role === "assistant" && "chatgpt"}`}>
    <div className="chat-message-center">
      <div className={`avatar ${message.role === "assistant" && "chatgpt"}`}>
        {message.role === "assistant" ? <OpenAISVGLogo /> : <div>You</div>}
      </div>
      <div className="message">
        <ReactMarkdown
          children={message.content}
          components={{
            code({node, inline, className, children, ...props}) {
              return !inline ? (
                <SyntaxHighlighter
                  {...props}
                  children={String(children).replace(/\n$/, '')}
                  style={githubGist}
                  PreTag="div"
                />
                ) : (
                  <code {...props} className={className}>
                    {children}
                  </code>
                )
            }
          }}
        />
      </div>
    </div>
  </div>
  )
}

export default ChatBox