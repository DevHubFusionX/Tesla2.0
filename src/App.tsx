import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { queryClient } from './lib/queryClient';
import { AppRoutes } from './routes';
import { DevPanel } from './components/DevPanel';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AppRoutes />
        <DevPanel />
      </Router>
      <Toaster position="bottom-right" theme="light" closeButton richColors />
    </QueryClientProvider>
  );
}

export default App;
