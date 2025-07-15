import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Rick from './Pages/Rick';
import Shop from './Pages/Shop';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Rick />} />
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
