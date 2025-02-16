import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import PropTypes from "prop-types";

import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import {
  disconnectSocket,
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../../socket";
import { useSelector } from "react-redux";
import Markdown from "markdown-to-jsx";

import { getWebContainer } from "../../webContainer";
import { lazy, Suspense } from "react";

const WorkSpace = lazy(() => import("./WorkSpace"));
const Collaborators = lazy(() => import("./Collaborators"));
const Add_Collaborators = lazy(() => import("./Add_Collaborators"));

const Chat = ({ project, users }) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(project.messages);
  const messagesEndRef = useRef(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [openFiles, setOpenFiles] = useState([]);
  const [filetree, setfiletree] = useState(project.fileTree || {});
  const [webContainer, setWebContainer] = useState(null);
  const { user } = useSelector((state) => state.user);
  const { id: project_id } = useParams();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["project"] });
    setCurrentFile(null);
    setOpenFiles([]);
    setfiletree(project.fileTree || {});
    setMessages(project.messages);
  }, [project_id, project, queryClient, user]);

  useEffect(() => {
    const socket = initializeSocket(project_id);
    setSocket(socket);
    socket.on("connect", () => console.log("✅ Connected to WebSocket"));

    receiveMessage("project-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      scrollToBottom();
    });

    return () => {
      socket.off("project-message");
      disconnectSocket();
    };
  }, [project_id]);

  useEffect(() => {
    getWebContainer().then((container) => {
      setWebContainer(container);
      console.log("✅ WebContainer booted.");
    });
  }, [project_id]);

  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (latestMessage?.sender?.email === "gemini@ai.com") {
      try {
        const aiMessage = JSON.parse(latestMessage.message);
        if (aiMessage?.fileTree && webContainer) {
          webContainer.mount(aiMessage.fileTree);

          setfiletree((prevFileTree) => {
            const updatedFileTree = { ...prevFileTree, ...aiMessage.fileTree };
            saveFileTree(updatedFileTree); // ✅ Save the updated tree after setting it
            return updatedFileTree;
          });
        }
      } catch (error) {
        console.error("❌ Error parsing AI message:", error);
      }
    }
  }, [messages, webContainer, project_id]); // ✅ Remove `filetree` from dependencies

  async function saveMessageToDB(messageData) {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/project/chat-message`,
        messageData,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (error) {
      console.error("❌ Error storing message:", error);
    }
  }

  async function handlesendMessage() {
    if (!message.trim()) return;

    const newMessage = {
      project_id,
      sender: { email: user?.email },
      message,
    };

    sendMessage("project-message", newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    scrollToBottom();

    await saveMessageToDB(newMessage);
  }

  async function saveFileTree(ft) {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/project/file-tree`,
        { project_id, fileTree: ft },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  function scrollToBottom() {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }

  function writeAIMessage(message) {
    const aiMessage = JSON.parse(message);
    return (
      <div className="break-words w-full text-lg whitespace-pre-wrap bg-gray-800 text-white rounded-md p-4">
        <Markdown>{aiMessage.text}</Markdown>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-85px)] bg-gray-900 text-white">
      <div className="w-1/3 border-r border-gray-700 flex flex-col h-full bg-gray-800 shadow-lg rounded-lg">
        <div className="top w-full h-14 bg-blue-600 text-white font-semibold px-3 flex justify-between items-center rounded-t-lg">
          <Add_Collaborators users={users} project={project} />
          <Collaborators users={project?.user} />
        </div>
        <div className="message-box flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex flex-col max-w-full ${
                msg.sender?.email === user?.email
                  ? "self-end items-end"
                  : "self-start items-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-xl max-w-[80%] shadow-md ${
                  msg.sender?.email === user?.email
                    ? "bg-blue-500 text-white rounded-tr-none"
                    : "bg-gray-700 text-gray-200 rounded-tl-none"
                }`}
              >
                <p className="text-xs text-white">{msg.sender?.email}</p>
                {msg.sender?.email === "gemini@ai.com" ? (
                  writeAIMessage(msg.message)
                ) : (
                  <p className="break-words w-full font-bold text-lg">
                    {msg.message}
                  </p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="bottom h-16 w-full bg-gray-700 flex items-center px-2 gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 p-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter message..."
          />
          <button
            onClick={handlesendMessage}
            className="h-12 w-12 flex items-center justify-center bg-blue-600 rounded-full hover:bg-blue-500 transition"
          >
            🚀
          </button>
        </div>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <WorkSpace
          fileTree={filetree}
          currentFile={currentFile}
          setCurrentFile={setCurrentFile}
          setFileTree={setfiletree}
          openFiles={openFiles}
          setOpenFiles={setOpenFiles}
          webContainer={webContainer}
          socket={socket}
          saveFileTree={saveFileTree}
        />
      </Suspense>
      ;
    </div>
  );
};

export default Chat;

Chat.propTypes = {
  project: PropTypes.object.isRequired,
  users: PropTypes.array.isRequired,
};
