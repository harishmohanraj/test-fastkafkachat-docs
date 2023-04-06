import "./normal.css";
import "./App.css";
import { useState } from "react";
import ChatBox from "./ChatBox";
import Loader from "./Loader";
import Modal from "./Modal";

function App() {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatLog, setChatLog] = useState([
    {
      role: "assistant",
      content:
        "Hi, I'm Fastkafka AI. How can I help you today?"
    },
  ]);

  // clear chats
  // function clearChat() {
  //   setChatLog([
  //     {
  //       role: "assistant",
  //       content:
  //       "Hi, I'm Fastkafka AI. How can I help you today?"
  //     },
  //   ]);
  // }

  async function handleSubmit(e) {
    e.preventDefault();

    // Check if chatInput is empty
    if (chatInput.length === 0) {
      return;
    }

    let chatLogNew = [...chatLog, { role: "user", content: `${chatInput}` }];
    // console.log(chatLogNew)
    setChatInput("");
    setChatLog(chatLogNew);

    try {
      setLoading(true);
      const loc = window.location;
      const baseUrl = `${loc.protocol}//${loc.hostname}${
        loc.hostname === "0.0.0.0" ? ":4000" : ""
      }`;
      // console.log(`loc.hostname = ${loc.hostname}`);
      // console.log(`baseUrl = ${baseUrl}`);

      const serverChatLog = chatLogNew.map(({role, content}) => ({role, content}));
      const response = await fetch(baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // message_history: serverChatLog,
          user_query: serverChatLog.at(-1)["content"]
        }),
      });
      const data = await response.json();
      setChatLog([
        ...chatLogNew,
        { role: "assistant", content: `${data}`},
      ]);

      setLoading(false);

      var scrollToTheBottomChatLog =
        document.getElementsByClassName("chat-log")[0];
      scrollToTheBottomChatLog.scrollTop =
        scrollToTheBottomChatLog.scrollHeight;
    } catch (error) {
      setLoading(false);
      console.error("Error processing request:", error);
      // setErrorMessage(`${error}.\n\nPlease try again later.`);
      setShowModal(true);
    }
  }

  function handleModalOk() {
    setShowModal(false);
  }

  return (
    <div className={`App ${loading ? "loading" : ""}`}>
      <>
        <ChatBox
          chatInput={chatInput}
          chatLog={chatLog}
          setChatInput={setChatInput}
          handleSubmit={handleSubmit}
        />
      </>
      {loading && <Loader />}
      {showModal && <Modal handleModalOk={handleModalOk} />}
    </div>
  );
}

export default App;