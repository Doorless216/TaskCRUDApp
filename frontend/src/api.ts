export type TodoListItemDto = {
  id: number;
  name: string;
  description: string | null;
  isComplete: boolean;
};

const apiBaseUrl = "https://localhost:7274";

// GET all items
export async function getTodoListItems(): Promise<TodoListItemDto[]> {
  const response = await fetch(`${apiBaseUrl}/api/TodoListItems`);

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

// CREATE new item
export async function createTodoListItem(item: { name: string; description: string | null }): Promise<TodoListItemDto> {
  const response = await fetch(`${apiBaseUrl}/api/TodoListItems`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: item.name,
      description: item.description,
      isComplete: false
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

// UPDATE existing item
export async function updateTodoListItem(id: number, item: { name: string; description: string | null }): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/TodoListItems/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      name: item.name,
      description: item.description,
      isComplete: false
    }),
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}

// DELETE item
export async function deleteTodoListItem(id: number): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/api/TodoListItems/${id}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}