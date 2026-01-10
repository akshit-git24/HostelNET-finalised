'use client';

import React, { useState, useEffect, useRef, KeyboardEvent, ChangeEvent } from 'react';
import {
  Plus,
  User,
  Bot,
  Sparkles,
  Paperclip,
  Mic,
  ArrowRight,
  Share2,
  Trash2,
  Leaf
} from 'lucide-react';
import Header from '@/components/Header';

interface Message {
  id: number;
  role: 'user' | 'bot';
  text: string;
  time: string;
}
const sendMessageToAI = async (message: string): Promise<string> => {
  const res = await fetch(
    `http://localhost:8013/roomieAI?query=${encodeURIComponent(message)}`
  );

  if (!res.ok) throw new Error('AI response failed');

  const data = await res.json();
  console.log("BACKEND RESPONSE:", data);
  return data.response;
};

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'bot',
      text: 'Hello! I am RoomieAI. How can I help you today?',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: 'user',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');

    try {
      const aiReply = await sendMessageToAI(userMsg.text);

      const botMsg: Message = {
        id: Date.now() + 1,
        role: 'bot',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 2,
          role: 'bot',
          text: 'Something went wrong. Please try again.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen bg-[#F7F9F7]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-green-100 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-lime-400 to-emerald-600 flex items-center justify-center">
            <Leaf className="text-white" />
          </div>
          <span className="font-bold text-lg">RoomieAI</span>
        </div>
      </aside>

      {/* Main Chat */}
      <main className="flex-1 flex flex-col">
        <Header />

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-10 py-10 space-y-8"
        >
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] px-6 py-4 rounded-3xl text-sm shadow ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white border border-green-100 text-slate-700 rounded-bl-none'
                }`}
              >
                {msg.text}
                <div className="text-[10px] mt-1 opacity-60 text-right">
                  {msg.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-6 border-t border-green-100 bg-white">
          <div className="flex items-center gap-3">
            <textarea
              rows={1}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask RoomieAI..."
              className="flex-1 resize-none rounded-xl border border-green-200 px-4 py-3 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!inputText.trim()}
              className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 disabled:opacity-40"
            >
              <ArrowRight />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
