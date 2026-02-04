import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div style={{ padding: 16 }}>
      <h1>Home</h1>
      <p>Welcome to the Todo List App!</p>
      <p>Use the button below to view your todo items.</p>

      <Link to="/items">
        <button>View Todo Items</button>
      </Link>
    </div>
  );
}