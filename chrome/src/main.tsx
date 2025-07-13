// packages
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// contexts/providers
import { TodoListProvider } from './contexts/todo.context.tsx';
// components
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TodoListProvider>
      <App />
    </TodoListProvider>
  </StrictMode>,
);