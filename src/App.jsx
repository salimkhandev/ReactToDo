import { useState, useEffect } from "react";

import Button from "@mui/material/Button";
import SearchIcon from "@mui/icons-material/Search";
import "./App.css"; // Make sure to import your CSS file
import Alert from "@mui/material/Alert";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import Swal from "sweetalert2";
import { red } from "@mui/material/colors";
import AddTaskIcon from "@mui/icons-material/AddTask";
export default function App() {
  const [notes, setNotes] = useState([]);
  const [check, setCheck] = useState();
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [reset, setReset] = useState(false);
   const [completedNotes, setCompletedNotes] = useState({});
   

  useEffect(() => {



    const locals = localStorage.getItem("ReactTodo");
    const checkCompleted = localStorage.getItem("checkCompleted");
    if (locals) {
      const conToArray = locals.split(",");

      setNotes(conToArray);
    }
    if (checkCompleted) {
  setCompletedNotes(JSON.parse(checkCompleted))
}

  }, []);

  const Handlereset=()=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        title: "text-lg", // Tailwind class for larger text
        content: "text-sm", // Tailwind class for smaller text
        popup: "w-80", // Tailwind class for width
      },
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "Your item has been deleted.", "success");
        localStorage.removeItem("ReactTodo");
        localStorage.removeItem("checkCompleted");
        setCompletedNotes("");
        setNotes([]);
        setReset(true);
      }
    });
    
  }

  const onDelete = (note,key) => {
    const deletes = notes.filter((item) => item !== note);
    setNotes(deletes);


    localStorage.setItem("ReactTodo", deletes.join(","));
     setCompletedNotes((prev) => {
      const updateState = {
      ...prev,
      [key]: false,

    }

    localStorage.setItem('checkCompleted', JSON.stringify(updateState))
    return updateState
  })

  }




  const handleCheckboxChange = (key) => {
    setCompletedNotes((prev) => {
      const updateState = {
      ...prev,
      [key]: !prev[key],

    }

    console.log(updateState); 
    localStorage.setItem('checkCompleted', JSON.stringify(updateState))
    return updateState
  }

  );


  };

  const handleChange = (e) => {
    setSearch(e.target.value);
      // setReset(true);
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
      setReset(false);
      localStorage.setItem("ReactTodo", [...notes, value].join(","));
      e.target[0].value = "";
    } else {
      setCheck("cannot be empy!");
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
            startIcon={
              darkMode ? (
                <WbSunnyIcon style={{ color: "white" }} />
              ) : (
                <DarkModeIcon style={{ color: "gray" }} />
              )
            }
            onClick={() => {
              setDarkMode(!darkMode);
            }}
            className="pl-2  float-right"
          ></Button>
          <h1
            style={{ fontFamily: "'Saira Condensed', sans-serif" }}
            className="text-2xl font-bold mb-4 text-center"
          >
            TaskTame
          </h1>

          <form onSubmit={toSubmit} className="mb-4">
            <div className="flex items-center mb-2">
              <input
                type="text"
                className={`flex-1 p-2 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  darkMode ? `text-black` : `text-black`
                }`}
                placeholder="Add a new note"
              />

              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                <AddTaskIcon className="pr-1" />
                Add
              </button>
            </div>
            <div className="flex items-center bg-white mb-2 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
              <SearchIcon className="ml-2 text-gray-500" />
              <input
                type="text"
                onChange={handleChange}
                placeholder="Search notes"
                className={`flex-1 p-2 focus:outline-none ${
                  darkMode ? `text-black` : `text-black`
                }`}
              />
            </div>
          </form>
          {check && (
            <Alert severity="warning" className="text-red-600 text-center mb-4">
              {check}
            </Alert>
          )}
          <Button
            // variant="outlined"
            // color="error"
            startIcon={<ClearIcon />}
            onClick={Handlereset}
            sx={{
              display: reset || notes.length === 0 ? "none" : "inline-flex",
              px: 1,
              py: 1,
              borderRadius: "0.5rem",
              color: "#d32f2f",
              "&:hover": {
                backgroundColor: "#ef5350",
                color: "black", // equivalent to Tailwind's bg-red-600
              },
              border: "1px solid red",
            }}
          >
            Clear all notes
          </Button>
          <ul>
            {filtered.map((note, key) => (
              <li
                className="flex justify-between items-center  p-2 border-b last:border-b-0"
                key={key}
              >
                <div className=" flex">
                  <span className="pr-1">{key + 1}</span>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={completedNotes[key]}
                    onChange={() => handleCheckboxChange(key)}
                  />
                </div>
                <span
                  className={` flex-auto min-w-0 max-w-full break-words border border-gray-300 m-1 p-2  ${
                    completedNotes[key]
                      ? "line-through font-bold text-green-500"
                      : ""
                  }`}
                >
                  {note}
                </span>

                <div className=" flex">
                  <Button
                    variant="text"
                    style={{ color: "red", textTransform: "capitalize" }}
                    onClick={() => onDelete(note, key)}
                    startIcon={<DeleteOutlineOutlinedIcon />}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
