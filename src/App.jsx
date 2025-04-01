import { BrowserRouter as Router, Routes, Route, Links } from "react-router-dom";
import Login from "./Components/Login";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>} />
      </Routes>
    </Router>
  );
}

export default App;
