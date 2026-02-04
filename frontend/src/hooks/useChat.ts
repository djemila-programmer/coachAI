import { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useUser } from '@/context/UserContext';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function useChat() {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('linguaflow_chat_history', []);
  const [isLoading, setIsLoading] = useState(false);
  const { settings, updateProgress, progress } = useUser();

  const sendMessage = async (content: string) => {
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiMessage: ChatMessage = {
      id: `msg_${Date.now() + 1}`,
      role: 'assistant',
      content: 'Réponse AI simulée',
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);

    updateProgress({ totalTimeMinutes: progress.totalTimeMinutes + 1 });
  };

  const clearHistory = () => setMessages([]);

  return { messages, sendMessage, isLoading, clearHistory };
}
