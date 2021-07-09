import "./App.css";
import { useEffect, useState } from "react";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({
    subject: "",
    details: "",
  });
  useEffect(() => {
    (async () => {
      try {
        //
        const res = await fetch(`${process.env.REACT_APP_API_URL}`);
        const data = await res.json();
        setTodos(data);
      } catch (error) {
        //
        console.error(error);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });
      const data = await response.json();
      setTodos([...todos, data]);
      // clear input after submission
      setNewTodo({
        subject: "",
        details: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  const handleDelete = async (e, id, idx) => {
    // make del req to api
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_URL}${id}`,
        // `https://todos-by-prescott.herokuapp.com/todos/${id}`,

        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const data = res.json();
      // remove todo item from todos
      const copyTodos = [...todos];
      // remove item at index
      copyTodos.splice(idx, 1);
      // setTodos
      setTodos(copyTodos);
      console.log("todo data: ", data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="App">
      <header id="header">
        <h1 className="title">Todo List:</h1>
      </header>

      <hr></hr>
      <div className="main">
        <div className="list grid-container">
          {todos.map((todo, idx) => (
            <div key={todo.id} className="list-item-container">
              <div className="list-item">
                {/* <label className="checkmark-container">
                  <input type="checkbox" checked="checked"></input>
                  <span className="checkmark"></span>
                </label> */}
                <p className="li-subj">{todo.subject} </p>
                <p>&nbsp;</p>
                <p>&nbsp;</p>
                <p className="li-details"> | {todo.details}</p>
              </div>

              <div className="btn-wrapper del-btn-wrapper">
                <button
                  className="btn del-btn"
                  onClick={(e) => {
                    handleDelete(e, todo.id, idx);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <hr></hr>
        <div className="add-container flex-col">
          <div className="add-title-wrapper">
            <div className="add-title">Add new items:</div>
          </div>
          <form className="add-form" onSubmit={handleSubmit}>
            <label className="subj-wrapper subj-label">
              Subject:{" "}
              <input
                className="subj-input"
                type="text"
                name="subject"
                value={newTodo.subject}
                onChange={handleChange}
              />
            </label>
            <label className="details-wrapper details-label">
              Details:{" "}
              <input
                className="details-input"
                type="text"
                name="details"
                value={newTodo.details}
                onChange={handleChange}
              />
            </label>
            <div className="btn-wrapper submit-btn-wrapper">
              <input className="btn submit-btn" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
