import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useUser } from '@/context/UserContext';
import { useNavigate } from 'react-router-dom';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isLoading,
  placeholder = 'Écris ton message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const { token, settings } = useUser();
  const navigate = useNavigate();

  const isAuthenticated = !!token && !settings.isGuest;

  const handleSend = () => {
    if (!message.trim() || isLoading) return;

    // 🔒 Bloque l'envoi si non connecté
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    onSend(message.trim());
    setMessage('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-end gap-3 p-4 border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="flex-1 relative">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'min-h-[48px] max-h-32 resize-none rounded-2xl border-border bg-background',
            'focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all'
          )}
          disabled={isLoading}
        />
        <div className="absolute right-3 bottom-3 text-xs text-muted-foreground">
          {message.length}/500
        </div>
      </div>

      {/* Bouton envoyer */}
      <Button
        onClick={handleSend}
        disabled={!message.trim() || isLoading}
        className={cn(
          'gradient-primary text-primary-foreground rounded-full w-12 h-12',
          'shadow-glow hover:shadow-xl transition-all duration-300',
          'disabled:opacity-50 disabled:shadow-none'
        )}
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
