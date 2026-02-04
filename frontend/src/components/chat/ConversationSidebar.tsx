import { useState } from 'react';
import {
  Plus,
  Pin,
  PinOff,
  MoreVertical,
  Trash2,
  Edit2,
  MessageCircle,
  BookCheck,
  Theater,
  X,
  Check,
  Sparkles,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/* ================= TYPES ================= */

export interface Conversation {
  id: string;
  title: string;
  mode: 'free' | 'roleplay' | 'correction' | 'quiz';
  isPinned?: boolean;
  updatedAt: number; // ✅ TIMESTAMP
}

interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onCreate: (mode: Conversation['mode']) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onTogglePin: (id: string) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

/* ================= CONFIG ================= */

const modeIcons = {
  free: MessageCircle,
  roleplay: Theater,
  correction: Edit2,
  quiz: BookCheck,
};

const modeLabels = {
  free: 'Conversation libre',
  roleplay: 'Jeu de rôle',
  correction: 'Correction',
  quiz: 'Quiz',
};

const modeColors = {
  free: 'text-primary',
  roleplay: 'text-purple-500',
  correction: 'text-orange-500',
  quiz: 'text-green-500',
};

/* ================= COMPONENT ================= */

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelect,
  onCreate,
  onDelete,
  onRename,
  onTogglePin,
  onClose,
  isMobile,
}: ConversationSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [showNewMenu, setShowNewMenu] = useState(false);

  /* ================= HELPERS ================= */

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();

    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "Aujourd'hui";
    if (days === 1) return 'Hier';
    if (days < 7) return `Il y a ${days} jours`;

    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
    });
  };

  const startEdit = (conv: Conversation) => {
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const saveEdit = () => {
    if (editingId && editTitle.trim()) {
      onRename(editingId, editTitle.trim());
    }
    setEditingId(null);
  };

  /* ================= RENDER ================= */

  return (
    <div
      className={cn(
        'flex flex-col h-full bg-card border-r border-border',
        isMobile ? 'w-full' : 'w-72'
      )}
    >
      {/* HEADER */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Conversations</h2>
          {isMobile && onClose && (
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        <Button
          onClick={() => setShowNewMenu(!showNewMenu)}
          className="w-full rounded-xl"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouvelle conversation
        </Button>

        {showNewMenu && (
          <div className="mt-2 rounded-xl border overflow-hidden">
            {(Object.keys(modeIcons) as Conversation['mode'][]).map((mode) => {
              const Icon = modeIcons[mode];
              return (
                <button
                  key={mode}
                  onClick={() => {
                    onCreate(mode);
                    setShowNewMenu(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted"
                >
                  <Icon className={cn('w-4 h-4', modeColors[mode])} />
                  <span>{modeLabels[mode]}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* LIST */}
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Sparkles className="mx-auto mb-2 opacity-50" />
            <p>Aucune conversation</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const Icon = modeIcons[conv.mode];
            const isActive = conv.id === activeConversationId;
            const isEditing = editingId === conv.id;

            return (
              <div
                key={conv.id}
                className={cn(
                  'group flex items-center gap-2 p-3 rounded-xl cursor-pointer',
                  isActive ? 'bg-primary/10' : 'hover:bg-muted'
                )}
                onClick={() => !isEditing && onSelect(conv.id)}
              >
                <Icon className={cn('w-4 h-4', modeColors[conv.mode])} />

                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <div className="flex gap-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit();
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                        className="h-7"
                      />
                      <Button size="icon" variant="ghost" onClick={saveEdit}>
                        <Check className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p className="truncate font-medium">{conv.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(conv.updatedAt)}
                      </p>
                    </>
                  )}
                </div>

                {conv.isPinned && <Pin className="w-3 h-3 text-primary" />}

                {!isEditing && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => startEdit(conv)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Renommer
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onTogglePin(conv.id)}>
                        {conv.isPinned ? <PinOff className="w-4 h-4 mr-2" /> : <Pin className="w-4 h-4 mr-2" />}
                        {conv.isPinned ? 'Désépingler' : 'Épingler'}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => onDelete(conv.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
