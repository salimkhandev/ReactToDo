import { useState, useEffect } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import "./App.css"; // Make sure to import your CSS file
import Alert from "@mui/material/Alert";
import DarkModeIcon from "@mui/icons-material/DarkMode";

export default function App() {
  const [notes, setNotes] = useState([]);
  const [check, setCheck] = useState();
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(true);


  useEffect(() => {
    const locals = localStorage.getItem("ReactTodo");
    if (locals) {
      const conToArray = locals.split(",");
      setNotes(conToArray);
    }
  }, []);

  const onDelete = (note) => {
    const deletes = notes.filter((item) => item !== note);
    setNotes(deletes);
    localStorage.setItem("ReactTodo", deletes.join(","));
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filtered = notes.filter((item) => {
    return item.toLowerCase().includes(search.toLowerCase());
  });

  const toSubmit = (e) => {
    e.preventDefault();
    const value = e.target[0].value.trim();

    if (notes.includes(value)) {
      setCheck("Note already exists!");
      setTimeout(() => {
        setCheck("");
      }, 2000);
    } else if (value !== "") {
      setNotes([...notes, value]);
      localStorage.setItem("ReactTodo", [...notes, value].join(","));
      e.target[0].value = "";
    } else {
      setCheck("Cannot be too short");
      setTimeout(() => {
        setCheck("");
      }, 2000);
    }
  };

  return (
    <div
      className={`${
        darkMode ? `bg-gray-900  text-white` : `bg-gray-300 text-black`
      }`}
    >
      <div className="min-h-screen  flex items-center justify-center p-4">
        <div
          className={` p-6 rounded-lg shadow-lg w-full max-w-md ${
            darkMode ? `bg-gray-800  text-white` : `bg-gray-100 text-black`
          }`}
        >
          <Button
            variant="text"
            size="small"
            color="primary"
            startIcon={<DarkModeIcon />}
            onClick={() => {
              setDarkMode(!darkMode);
            }}
            className="pl-2  float-right"
          ></Button>
          <h1 className="text-2xl font-bold mb-4 text-center">TaskTame</h1>

          <form onSubmit={toSubmit} className="mb-4">
            <div className="flex items-center mb-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add a new note"
              />

              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="flex items-center bg-white mb-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <SearchIcon className="ml-2 text-gray-500" />
              <input
                type="text"
                onChange={handleChange}
                placeholder="Search notes"
                className="flex-1 p-2 focus:outline-none"
              />
            </div>
          </form>
          {check && (
            <Alert severity="warning" className="text-red-600 text-center mb-4">
              {check}
            </Alert>
          )}
          <ul>
            {filtered.map((note, key) => (
              <li
                className="flex justify-between items-center p-2 border-b last:border-b-0"
                key={key}
              >
                {note}
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<DeleteIcon />}
                  onClick={() => onDelete(note)}
                  className="text-red-500 hover:text-red-700"
                  style={{ textTransform: "capitalize" }}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
