import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Home from './home/Home';
import Login from './login/Login';
import { SessionProvider } from './session/SessionProvider';
import './App.css';

export const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header className="app-header">
          <h1>Me and My Family</h1>
        </header>
        <BrowserRouter>
          <SessionProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </SessionProvider>
        </BrowserRouter>
      </div>
    </QueryClientProvider>
  );
}

export default App;
