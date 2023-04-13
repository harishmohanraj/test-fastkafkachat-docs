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
        "Hi, I'm FastKafka AI. How can I help you today?"
    },
    {
      role: "user",
      content: "How do I consume messages from a Kafka topic using FastKafka?"
    },
    {
      role: "assistant",
      content:
      `To consume messages using FastKafka from a Kafka topic, you can follow these steps:

1. Define the structure of the messages using pydantic.

\`\`\`python
from pydantic import BaseModel, Field

class HelloWorld(BaseModel):
    msg: str = Field(
        ...,
        example="Hello",
        description="Demo hello world message",
    )
\`\`\`

2. Create a FastKafka app instance, specifying the Kafka bootstrap server information.

\`\`\`python
from fastkafka import FastKafka

kafka_brokers = {
    "demo_broker": {
        "url": "<url_of_your_kafka_bootstrap_server>",
        "description": "local demo kafka broker",
        "port": "<port_of_your_kafka_bootstrap_server>",
    }
}

app = FastKafka(kafka_brokers=kafka_brokers)
\`\`\`

3. Define a consumer function and decorate it with \`@consumes\`.

\`\`\`python
from fastkafka._components.logger import get_logger

logger = get_logger(__name__)

@app.consumes("hello_world")
async def on_hello_world(msg: HelloWorld):
    logger.info(f"Got msg: {msg}")
\`\`\`
4. Run the FastKafka app.

\`\`\`
fastkafka run --num-workers=1 --kafka-broker=demo_broker your_module_name:app
\`\`\`
      `
    },
  ]);

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
          query_str: serverChatLog.at(-1)["content"]
        }),
      });
      const data = await response.json();
      // console.log(data)
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