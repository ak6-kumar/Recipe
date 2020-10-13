import React from "react";
import Button from '@material-ui/core/Button'
import {Controlled as CodeMirror} from 'react-codemirror2'
 




function Todo({ todo, index, completeTodo, removeTodo }) {
  return (
    <div className="row">
    <div className="todo col-8">
      {todo.text}
    </div>
    <div className="col-4">
        <Button variant="outlined" size='small' onClick={() => removeTodo(index)}>x</Button>
      </div>
    </div>
  );
}

function TodoForm({ addTodo }) {
  const [value, setValue] = React.useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!value) return;
    addTodo(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        className="input"
        value={value}
        placeholder="Add your step here"
        onChange={e => setValue(e.target.value)}
      />
    </form>
  );
}

export default function Test() {
  const [todos, setTodos] = React.useState([]);

  const addTodo = text => {
    const newTodos = [...todos, { text }];
    setTodos(newTodos);
  };

  const completeTodo = index => {
    const newTodos = [...todos];
    newTodos[index].isCompleted = true;
    setTodos(newTodos);
  };

  const removeTodo = index => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    <div className="app">
      <div className="todo-list">
        {todos.map((todo, index) => (
          <Todo
            key={index}
            index={index}
            todo={todo}
            completeTodo={completeTodo}
            removeTodo={removeTodo}
          />
        ))}
        <TodoForm addTodo={addTodo} />
      </div>
    </div>
  );
}

