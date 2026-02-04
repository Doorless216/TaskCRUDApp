import { useEffect, useState } from "react";
import { getTodoListItems, createTodoListItem, updateTodoListItem, deleteTodoListItem, type TodoListItemDto } from "../api";
export default function TodoListItemsPage() {
  const [items, setItems] = useState<TodoListItemDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  useEffect(() => {
    getTodoListItems()
      .then((data) => setItems(data))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
  if (!newName.trim()) return; // Don't allow empty names
  
  setCreating(true);
  setError(null);
  
  try {
    const newItem = await createTodoListItem({
      name: newName,
      description: newDescription || null
    });
    
    // Add the new item to the list
    setItems([...items, newItem]);
    
    // Clear the form
    setNewName("");
    setNewDescription("");
  } catch (e) {
    setError(String(e));
  } finally {
    setCreating(false);
  }
}

function startEdit(item: TodoListItemDto) {
  setEditingId(item.id);
  setEditName(item.name);
  setEditDescription(item.description || "");
}

function cancelEdit() {
  setEditingId(null);
  setEditName("");
  setEditDescription("");
}

async function saveEdit() {
  if (editingId === null || !editName.trim()) return;
  
  setSavingEdit(true);
  setError(null);
  
  try {
    await updateTodoListItem(editingId, {
      name: editName,
      description: editDescription || null
    });
    
    // Update the item in the list
    setItems(items.map(item => 
      item.id === editingId 
        ? { ...item, name: editName, description: editDescription || null }
        : item
    ));
    
    cancelEdit();
  } catch (e) {
    setError(String(e));
  } finally {
    setSavingEdit(false);
  }
}

async function deleteRow(id: number) {
  if (deletingId !== null) return;

  const ok = window.confirm("Delete this item?");
  if (!ok) return;

  setDeletingId(id);
  setError(null);

  try {
    await deleteTodoListItem(id);

    if (editingId === id) {
      cancelEdit();
    }

    // Remove the item from the list
    setItems(items.filter(item => item.id !== id));
  } catch (e) {
    setError(String(e));
  } finally {
    setDeletingId(null);
  }
}

  if (loading) return <div style={{ padding: 16 }}>Loading...</div>;
  if (error) return <div style={{ padding: 16 }}>Error: {error}</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Todo List Items</h1>
    <div style={{ marginBottom: 24, padding: 16, border: "1px solid #ccc", borderRadius: 8 }}>
        <h2>Add New Item</h2>
        
        <div style={{ marginBottom: 8 }}>
          <label>
            Name (required):
            <br />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ width: 300, padding: 4 }}
              disabled={creating}
            />
          </label>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>
            Description:
            <br />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              style={{ width: 300, padding: 4 }}
              disabled={creating}
            />
          </label>
        </div>

        <button
          onClick={handleCreate}
          disabled={creating || !newName.trim()}
        >
          {creating ? "Adding..." : "Add Item"}
        </button>
      </div>
      <table cellPadding={8} style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Id</th>
            <th align="left">Name</th>
            <th align="left">Description</th>
            <th align="left">Complete</th>
            <th align="left">Actions</th>
          </tr>
        </thead>
        <tbody>
        {items.map((x) => (
            <tr 
            key={x.id} 
            onClick={() => startEdit(x)} 
            style={{ cursor: "pointer" }}
            >
            <td>{x.id}</td>
            <td>
                {editingId === x.id ? (
                    <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    style={{ width: "100%" }}
                    disabled={savingEdit}
                    />
                ) : (
                    x.name
                )}
            </td>
            <td>{x.description || "(no description)"}</td>
            <td>{x.isComplete ? "✓" : "○"}</td>
            <td>
            {editingId === x.id ? (
                <div style={{ display: "flex", gap: 8 }}>
                <button
                    disabled={savingEdit || !editName.trim()}
                    onClick={(e) => { e.stopPropagation(); saveEdit(); }}
                >
                    {savingEdit ? "Saving..." : "Save"}
                </button>
                <button
                    disabled={savingEdit}
                    onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                >
                    Cancel
                </button>
                </div>
            ) : (
                <button
                disabled={deletingId === x.id}
                onClick={(e) => { e.stopPropagation(); deleteRow(x.id); }}
                >
                {deletingId === x.id ? "Deleting..." : "Delete"}
                </button>
            )}
        </td>
            </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
}