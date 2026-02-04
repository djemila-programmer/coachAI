import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageCircle,
  Theater,
  Pencil,
  Target,
  Menu,
  Copy,
  RefreshCw,
  ThumbsUp,
  User,
  Bot,
} from 'lucide-react';

import { AppLayout } from '@/components/layout/AppLayout';
import { ChatBubble } from '@/components/chat/ChatBubble';
import { ChatInput } from '@/components/chat/ChatInput';
import ConversationSidebar from '@/components/chat/ConversationSidebar';
import { useConversations } from '@/hooks/useConversations';
import { useUser } from '@/context/UserContext';
import { sendToAI } from '@/services/api';
import { cn } from '@/lib/utils';

type Mode = 'free' | 'roleplay' | 'correction' | 'quiz';

const modes: Record<Mode, { title: string; icon: any }> = {
  free: { title: 'Conversation libre', icon: MessageCircle },
  roleplay: { title: 'Jeu de rôle', icon: Theater },
  correction: { title: 'Correction', icon: Pencil },
  quiz: { title: 'Quiz', icon: Target },
};

export default function Chat() {
  const navigate = useNavigate();
  const { settings } = useUser();

  const {
    conversations,
    activeConversation,
    activeConversationId,
    activeMessages,
    createConversation,
    addMessage,
    setActiveConversationId,
    deleteConversation,
    renameConversation,
    togglePin,
  } = useConversations();

  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, isLoading]);

  useEffect(() => {
    if (!activeConversationId && conversations.length > 0) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId, setActiveConversationId]);

  const handleCreateConversation = (mode: Mode) => {
    const conv = createConversation('Nouvelle conversation', false, mode);
    setActiveConversationId(conv.id);
    setIsSidebarOpen(false);
  };

  const ensureConversation = (): string => {
    if (activeConversationId) return activeConversationId;
    const conv = createConversation('Nouvelle conversation', false, 'free');
    return conv.id;
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const convId = ensureConversation();
    addMessage(convId, 'user', content);
    setIsLoading(true);

    try {
      const response = await sendToAI({
        message: content,
        language: settings.languageToLearn,
        level: settings.userLevel,
      });

      const aiReply = response.reply || "Désolé, je n'ai pas compris.";
      addMessage(convId, 'assistant', aiReply);
    } catch (err) {
      console.error('Erreur IA:', err);
      addMessage(
        convId,
        'assistant',
        'Désolé, une erreur est survenue. Veuillez réessayer.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = () => {
    const lastUserMessage = [...activeMessages]
      .reverse()
      .find(m => m.role === 'user');

    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  const ModeIcon = activeConversation
    ? modes[activeConversation.mode].icon
    : MessageCircle;

  return (
    <AppLayout>
      <div className="flex h-screen bg-muted/20">
        <aside
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-80 bg-background border-r transform transition-transform duration-300',
            'lg:translate-x-0 lg:static',
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <ConversationSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelect={(id) => {
              setActiveConversationId(id);
              setIsSidebarOpen(false);
            }}
            onCreate={handleCreateConversation}
            onDelete={deleteConversation}
            onRename={renameConversation}
            onTogglePin={togglePin}
          />
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <div
          className={cn(
            'flex-1 flex flex-col transition-all duration-300',
            'lg:ml-80',
            isSidebarOpen ? 'ml-80' : 'ml-0'
          )}
        >
          <header className="flex items-center justify-between gap-4 px-4 py-3 border-b bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3 min-w-0">
              <button
                className="lg:hidden p-2 rounded-lg text-muted-foreground hover:bg-muted"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>

              <ModeIcon className="w-5 h-5 text-primary" />
              <div className="min-w-0">
                <h1 className="font-semibold text-base truncate">
                  {activeConversation
                    ? modes[activeConversation.mode].title
                    : 'Nouvelle conversation'}
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  {activeConversation?.description ||
                    'Posez vos questions ou commencez à discuter avec l\'IA.'}
                </p>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto">
            <div className="max-w-3xl mx-auto w-full px-4 py-6 space-y-6">
              {activeMessages.map((m) => (
                <div key={m.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    {m.role === 'user' ? (
                      <User className="w-5 h-5" />
                    ) : (
                      <Bot className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <ChatBubble
                      role={m.role}
                      content={m.content}
                      timestamp={new Date(m.timestamp)}
                    />

                    {m.role === 'assistant' && (
                      <div className="flex gap-4 text-muted-foreground text-sm">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(m.content);
                            setCopiedId(m.id);
                            setTimeout(() => setCopiedId(null), 1500);
                          }}
                          className="hover:text-foreground flex items-center gap-1"
                        >
                          <Copy className="w-4 h-4" />
                          {copiedId === m.id ? 'Copié !' : 'Copier'}
                        </button>

                        <button
                          onClick={handleRegenerate}
                          className="hover:text-foreground flex items-center gap-1"
                        >
                          <RefreshCw className="w-4 h-4" /> Régénérer
                        </button>

                        <button
                          onClick={() => {
                            setLikedMessages((prev) => {
                              const newSet = new Set(prev);
                              if (newSet.has(m.id)) {
                                newSet.delete(m.id);
                              } else {
                                newSet.add(m.id);
                              }
                              return newSet;
                            });
                          }}
                          className="hover:text-foreground flex items-center gap-1"
                        >
                          <ThumbsUp
                            className={cn(
                              'w-4 h-4',
                              likedMessages.has(m.id) && 'text-primary'
                            )}
                          />
                          {likedMessages.has(m.id) ? 'Aimé' : 'Like'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <ChatBubble
                  role="assistant"
                  content=""
                  timestamp={new Date()}
                  isTyping={true}
                />
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          <div className="border-t bg-background">
            <div className="max-w-3xl mx-auto w-full p-3">
              <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}