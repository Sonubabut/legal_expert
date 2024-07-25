import React, { useState, useRef, useEffect, useCallback } from 'react';
import { TextField, Button, CircularProgress, IconButton, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { IoSend, IoMic, IoCopy, IoClose, IoTrash } from 'react-icons/io5';
import ReactMarkdown from 'react-markdown';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { getAIResponse } from '../../utils';
import annyang from 'annyang';
import { GoLaw } from "react-icons/go";
import './Chat.css';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [file, setFile] = useState(null);
  const [disclaimerOpen, setDisclaimerOpen] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const chatHistoryRef = useRef(null);

  const sampleQuestions = [
    { text: "Legal aspects that you should consider before buying a property?", icon: <GoLaw className="sample-question-icon" /> },
    { text: "What are my legal rights as an employee?", icon: <GoLaw className="sample-question-icon" /> },
    { text: "What rental protections laws in Santa Clara, CA?", icon: <GoLaw className="sample-question-icon" /> },
    { text: "What are my legal rights if I am arrested?", icon: <GoLaw className="sample-question-icon" /> }
  ];

  useEffect(() => {
    if (!isSending) {
      inputRef.current.focus();
    }
  }, [isSending]);

  useEffect(() => {
    chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
  }, [messages]);

  const handleSubmit = useCallback(async (event) => {
    event && event.preventDefault();
    if (!inputValue && !file) return;

    setIsSending(true);
    setError(null);

    const newMessage = {
      role: "user",
      content: inputValue,
      file: file ? URL.createObjectURL(file) : null
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);

    try {
      setIsTyping(true);
      const response = await getAIResponse(inputValue, file);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error(error);
      setError("An error occurred while processing your request.");
    } finally {
      setIsSending(false);
      setIsTyping(false);
      setInputValue("");
      setFile(null);
    }
  }, [inputValue, file]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !isSending) {
      handleSubmit(event);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    if (annyang) {
      annyang.addCommands({
        '*text': (text) => {
          setInputValue(text);
          handleSubmit();
        }
      });

      annyang.addCallback('start', () => setIsListening(true));
      annyang.addCallback('end', () => setIsListening(false));
      annyang.addCallback('error', () => setIsListening(false));
    }
  }, [handleSubmit]);

  const handleVoiceInput = () => {
    if (annyang) {
      if (isListening) {
        annyang.abort();
        setIsListening(false);
      } else {
        annyang.start();
        setIsListening(true);
      }
    } else {
      console.warn("Annyang is not supported in this browser.");
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleRetry = () => {
    setError(null);
    setIsSending(false);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleSampleQuestionClick = async (question) => {
    setInputValue(question);
    setTimeout(() => {
      handleSubmit(); // Automatically submit the question
    }, 0);
  };

  const handleCloseDisclaimer = () => {
    setDisclaimerOpen(false);
  };

  return (
    <div className="chat-container">
      <Dialog open={disclaimerOpen} onClose={handleCloseDisclaimer}>
        <DialogTitle>Disclaimer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            By using this chat application, you agree to the terms and conditions. The information provided is for general informational purposes only and is not a substitute for professional legal advice.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDisclaimer} color="primary">
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <div className="sample-questions">
        {sampleQuestions.map((question, index) => (
          <Card key={index} className="sample-question-card" onClick={() => handleSampleQuestionClick(question.text)}>
            <CardContent>
              {question.icon}
              {question.text}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="chat-history" ref={chatHistoryRef}>
        {messages.map((message, index) => (
          <div key={index} className={`chat-message ${message.role}`}>
            <div className="chat-message-avatar">
              <img
                src={
                  message.role === "user"
                    ? "https://test.digitalt3.com/wp-content/uploads/2024/06/legal_chat2.png"
                    : "https://test.digitalt3.com/wp-content/uploads/2024/06/legal_exp.png"
                }
                alt={message.role}
                width="40"
                height="40"
              />
            </div>
            <div className="chat-message-content">
              <div className="chat-message-text">
                {message.role === "assistant" ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  message.content
                )}
                {message.file && (
                  <a href={message.file} target="_blank" rel="noopener noreferrer">
                    <Button variant="contained" color="primary">
                      View File
                    </Button>
                  </a>
                )}
              </div>
              <div className="chat-message-timestamp">
                {new Date().toLocaleTimeString()}
              </div>
              <CopyToClipboard text={message.content}>
                <IconButton size="small" className="chat-copy-button">
                  <IoCopy />
                </IconButton>
              </CopyToClipboard>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="chat-typing-indicator">
            <span>Assistant is typing...</span>
          </div>
        )}
      </div>
      {error && (
        <div className="chat-error">
          <span>{error}</span>
          <Button variant="contained" color="primary" onClick={handleRetry}>
            Retry
          </Button>
        </div>
      )}
      <form className="chat-input" onSubmit={handleSubmit}>
        <TextField
          className="chat-input-field"
          placeholder="Type your message..."
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={isSending}
          inputRef={inputRef}
        />
        <IconButton onClick={handleVoiceInput} className={`chat-voice-button ${isListening ? 'listening' : ''}`}>
          {isListening ? <IoClose /> : <IoMic />}
        </IconButton>
        <input
          accept="*"
          className="chat-file-input"
          id="file-input"
          type="file"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-input">
          {/* <IconButton component="span">
            <IoCloudUpload />
          </IconButton> */}
        </label>
        <Button
          className="chat-submit-button"
          type="submit"
          disabled={isSending || (!inputValue && !file)}
        >
          {isSending ? <CircularProgress size={24} /> : <IoSend />}
        </Button>
        <IconButton onClick={handleClearChat} className="clear-chat-button">
          <IoTrash />
        </IconButton>
      </form>
    </div>
  );
};

export default Chat;
