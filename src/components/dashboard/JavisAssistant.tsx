"use client"

import { Mic, Send, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export const JavisAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm Javis, your smart assistant. How can I help?", sender: 'bot' as const }
  ]);

  const handleSend = () => {
    if (message.trim()) {
      setMessages(prev => [...prev, { id: Date.now(), text: message, sender: 'user' as const }]);
      setMessage('');
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, text: "I've noted that. Anything else?", sender: 'bot' as const }]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-card rounded-lg border shadow-lg flex flex-col max-h-96">
      <div className="p-3 border-b flex items-center gap-2">
        <Bot className="h-5 w-5" />
        <h4 className="font-medium">Javis Assistant</h4>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto h-6 w-6"
          onClick={() => setIsListening(!isListening)}
        >
          <Mic className={`h-4 w-4 ${isListening ? 'text-red-500' : ''}`} />
        </Button>
      </div>
      
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {(messages || []).map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-2 rounded-lg ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
              <p className="text-sm">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-3 border-t flex gap-2">
        <Input 
          value={message} 
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button size="icon" onClick={handleSend} disabled={!message.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};