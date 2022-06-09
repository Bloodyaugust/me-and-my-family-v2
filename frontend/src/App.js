import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './home/Home';
import Login from './login/Login';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Me and My Family</h1>
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
