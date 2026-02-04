import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/HomePages";
import TodoListItemsPage from "./pages/TodoListItemsPages";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: 16 }}>
        <nav style={{ marginBottom: 16 }}>
          <Link to="/" style={{ marginRight: 12 }}>Home</Link>
          <Link to="/items">Todo Items</Link>
        </nav>

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/items" element={<TodoListItemsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
