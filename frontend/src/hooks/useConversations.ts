import { useState, useEffect } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Conversation {
  id: string;
  mode: 'free' | 'roleplay' | 'correction' | 'quiz';
  title: string;
  messages: Message[];
  updatedAt: number;
  isPinned: boolean;
  isTemporary?: boolean;
  description?: string;
}

const STORAGE_KEY = "linguaflow_conversations";
const ACTIVE_KEY = "linguaflow_active_conversation";

/* =================== UTILITAIRE UUID SAFE =================== */
const generateId = () => {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );
};
/* =========================================================== */

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const [activeConversationId, setActiveConversationId] = useState<string | null>(() => {
    return localStorage.getItem(ACTIVE_KEY);
  });

  const activeConversation = conversations.find(c => c.id === activeConversationId);
  const activeMessages = activeConversation?.messages || [];

  // 💾 Sauvegarde automatique
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    if (activeConversationId) {
      localStorage.setItem(ACTIVE_KEY, activeConversationId);
    }
  }, [activeConversationId]);

  const createConversation = (title: string, isTemp: boolean, mode: Conversation['mode']) => {
    const now = Date.now();

    const conv: Conversation = {
      id: generateId(),
      mode,
      title: title || 'Nouvelle conversation',
      messages: [],
      updatedAt: now,
      isPinned: false,
      isTemporary: isTemp,
    };

    setConversations(prev => [conv, ...prev]);
    setActiveConversationId(conv.id);
    return conv;
  };

  const addMessage = (convId: string, role: Message['role'], content: string) => {
    setConversations(prev =>
      prev.map(c => {
        if (c.id !== convId) return c;

        const newMessages = [
          ...c.messages,
          {
            id: generateId(),
            role,
            content,
            timestamp: Date.now(),
          },
        ];

        return {
          ...c,
          messages: newMessages,
          updatedAt: Date.now(),
          title:
            c.messages.length === 0 && role === 'user'
              ? content.slice(0, 30) + (content.length > 30 ? '…' : '')
              : c.title,
        };
      })
    );
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (id === activeConversationId) {
      setActiveConversationId(null);
    }
  };

  const renameConversation = (id: string, title: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === id ? { ...c, title } : c))
    );
  };

  const togglePin = (id: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === id ? { ...c, isPinned: !c.isPinned } : c
      )
    );
  };

  return {
    conversations,
    activeConversation,
    activeConversationId,
    activeMessages,
    setActiveConversationId,
    createConversation,
    addMessage,
    deleteConversation,
    renameConversation,
    togglePin,
  };
}
