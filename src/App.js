import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Rick from './Pages/Rick';
import Rick2 from './Pages/Rick2';
import Shop from './Pages/Shop';
import Shop2 from './Pages/Shop2';
import Terminal from './Pages/Terminal';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Rick />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop2" element={<Shop2 />} />
          <Route path="/terminal" element={<Terminal />} />
          <Route path="/rick2" element={<Rick2 />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
