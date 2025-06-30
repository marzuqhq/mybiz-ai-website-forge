
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Bot, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import sdk from '@/lib/sdk';
import AIChatService, { ChatMessage } from '@/lib/ai-chat-service';

interface ChatContext {
  currentPage: string;
  websiteData?: any;
  userHistory: ChatMessage[];
  businessInfo?: any;
}

const EnhancedLiveChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [context, setContext] = useState<ChatContext>({
    currentPage: window.location.pathname,
    userHistory: [],
  });
  const [aiChatService, setAiChatService] = useState<AIChatService | null>(null);
  const [conversationId, setConversationId] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Initialize AI Chat Service
  useEffect(() => {
    initializeAIChat();
  }, []);

  const initializeAIChat = async () => {
    try {
      // Get current website context
      const websites = await sdk.get('websites');
      const currentWebsite = websites[0]; // Assuming first website for demo
      
      if (currentWebsite) {
        const chatService = new AIChatService(currentWebsite.id);
        const memory = await chatService.initializeChat(currentWebsite.id);
        
        setAiChatService(chatService);
        setConversationId(memory.conversationId);
        
        // Load chat history from sessionStorage
        const savedMessages = sessionStorage.getItem('chat-messages');
        if (savedMessages) {
          try {
            const parsed = JSON.parse(savedMessages);
            setMessages(parsed.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            })));
          } catch (error) {
            console.error('Failed to load chat history:', error);
          }
        }

        // Initialize with welcome message if no history
        if (!savedMessages || JSON.parse(savedMessages).length === 0) {
          const welcomeResponse = await chatService.generateResponse('hello', memory.conversationId);
          const welcomeMessage: ChatMessage = {
            id: 'welcome-' + Date.now(),
            content: welcomeResponse,
            sender: 'bot',
            timestamp: new Date()
          };
          setMessages([welcomeMessage]);
        }
      }
    } catch (error) {
      console.error('Failed to initialize AI chat:', error);
      // Fallback welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome-' + Date.now(),
        content: `👋 Hello! I'm your AI assistant. I can help you with questions about our website, products, and services. How can I assist you today?`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  };

  // Save messages to sessionStorage
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chat-messages', JSON.stringify(messages));
    }
  }, [messages]);

  // Update context when page changes
  useEffect(() => {
    const newContext = {
      ...context,
      currentPage: window.location.pathname,
    };
    setContext(newContext);
    sessionStorage.setItem('chat-context', JSON.stringify(newContext));
  }, [window.location.pathname]);

  // Auto-scroll to bottom
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !aiChatService || !conversationId) return;

    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));
      
      const aiResponse = await aiChatService.generateResponse(userMessage.content, conversationId);
      
      const botMessage: ChatMessage = {
        id: 'bot-' + Date.now(),
        content: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: ChatMessage = {
        id: 'error-' + Date.now(),
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment, or feel free to contact our support team directly.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const minimizeChat = () => {
    setIsMinimized(true);
  };

  const clearChat = async () => {
    setMessages([]);
    setContext({ currentPage: window.location.pathname, userHistory: [] });
    sessionStorage.removeItem('chat-messages');
    sessionStorage.removeItem('chat-context');
    
    // Clear AI memory and reinitialize
    if (aiChatService && conversationId) {
      aiChatService.clearMemory(conversationId);
      await initializeAIChat();
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="lg"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 h-[600px] shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16' : ''}`}>
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistant
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Online</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={minimizeChat}
                className="text-white hover:bg-white/10 h-8 w-8 p-0"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleChat}
                className="text-white hover:bg-white/10 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex flex-col h-[500px] p-0">
              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.sender === 'user' ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-purple-500 text-white'
                    }`}>
                      {message.sender === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-[80%] ${
                      message.sender === 'user' ? 'text-right' : ''
                    }`}>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.sender === 'user'
                          ? 'bg-blue-500 text-white ml-auto'
                          : 'bg-white border shadow-sm'
                      }`}>
                        {message.sender === 'bot' ? (
                          <div className="prose prose-sm max-w-none">
                            <ReactMarkdown
                              components={{
                                code: ({ children, className }) => {
                                  const match = /language-(\w+)/.exec(className || '');
                                  const language = match ? match[1] : '';
                                  
                                  if (language) {
                                    return (
                                      <div className="rounded-md overflow-hidden text-sm bg-gray-900">
                                        <SyntaxHighlighter
                                          style={vscDarkPlus as any}
                                          language={language}
                                          PreTag="div"
                                        >
                                          {String(children).replace(/\n$/, '')}
                                        </SyntaxHighlighter>
                                      </div>
                                    );
                                  }
                                  
                                  return (
                                    <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                            >
                              {message.content}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      <div className={`text-xs text-gray-500 mt-1 ${
                        message.sender === 'user' ? 'text-right' : ''
                      }`}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-white border shadow-sm rounded-2xl px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t bg-white">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isTyping}
                    className="bg-blue-500 hover:bg-blue-600 h-10 w-10 p-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    Press Enter to send, Shift+Enter for new line
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearChat}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Clear Chat
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default EnhancedLiveChat;
