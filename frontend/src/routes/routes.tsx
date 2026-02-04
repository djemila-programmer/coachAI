// src/routes/routes.tsx
import { Routes, Route } from 'react-router-dom';

import Landing from '@/pages/Landing';
import Chat from '@/pages/Chat';
import Auth from '@/pages/Auth';
import Exercises from '@/pages/Exercises';
import Review from '@/pages/Review';
import Progress from '@/pages/Progress';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/chat" element={<Chat />} />
      <Route path="/exercises" element={<Exercises />} />
      <Route path="/review" element={<Review />} />
      <Route path="/progress" element={<Progress />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
