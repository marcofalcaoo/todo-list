export interface Todo {
  id?: number;
  user_id?: number;
  title: string;
  description?: string;
  completed: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TodoResponse {
  success: boolean;
  todo?: Todo;
  todos?: Todo[];
  message?: string;
}

export interface CreateTodoRequest {
  title: string;
  description?: string;
  completed?: boolean;
}

export interface UpdateTodoRequest {
  title?: string;
  description?: string;
  completed?: boolean;
}
