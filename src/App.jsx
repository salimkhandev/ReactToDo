import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import AddTaskIcon from "@mui/icons-material/AddTask";
import ClearIcon from "@mui/icons-material/Clear";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import { IconButton } from "@mui/material";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Checkbox from '@mui/material/Checkbox';
import Snackbar from "@mui/material/Snackbar";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./App.css"; // Make sure to import your CSS file

export default function App() {
  const [notes, setNotes] = useState([]);
  const [check, setCheck] = useState();
  const [search, setSearch] = useState("");
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode !== null) {
      console.log("this is the stored value", storedDarkMode);
      return storedDarkMode === 'true';
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [reset, setReset] = useState(false);

  const [completedNotes, setCompletedNotes] = useState({});
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const [showCompleted, setShowCompleted] = useState(false);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        console.log('PWA installed');
      }
      setDeferredPrompt(null);
    } catch (error) {
      console.error('Error installing app:', error);
    }
  };

  useEffect(() => {
    // Detect iOS (since it does not support beforeinstallprompt)
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);

    // Listen for beforeinstallprompt event
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault(); // Prevent auto prompt
      setDeferredPrompt(event);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", (event) =>
        setDeferredPrompt(null)
      );
    };
  }, []);

  useEffect(() => {
    const locals = localStorage.getItem("ReactTodo");
    const checkCompleted = localStorage.getItem("checkCompleted");
    if (locals) {
      const conToArray = locals.split(",");
      setNotes(conToArray);
    }
    if (checkCompleted) {
      setCompletedNotes(JSON.parse(checkCompleted));
    }
  }, []);

  const handleReset = () => {
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
        Swal.fire("Deleted!", "Your all notes has been deleted.", "success");
        localStorage.removeItem("ReactTodo");
        localStorage.removeItem("checkCompleted");
        setCompletedNotes({});
        setNotes([]);
        setReset(true);
      }
    });
  };

  const onDelete = (note, key) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this note?",
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
        const deletes = notes.filter((item) => item !== note);
        setNotes(deletes);

        localStorage.setItem("ReactTodo", deletes.join(","));
        setCompletedNotes((prev) => {
          const updateState = {
            ...prev,
            [key]: false,
          };

          localStorage.setItem("checkCompleted", JSON.stringify(updateState));
          return updateState;
        });

        setSnackbar({ open: true, message: "Note deleted" });
      }
    });
  };

  const handleCheckboxChange = (key) => {
    setCompletedNotes((prev) => {
      const updateState = {
        ...prev,
        [key]: !prev[key],
      };

      localStorage.setItem("checkCompleted", JSON.stringify(updateState));
      return updateState;
    });
  };

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const filtered = notes
    .map((note, index) => ({ note, index }))
    .filter(({ note, index }) => {
      if (showCompleted) {
        return (
          completedNotes[index] &&
          note.toLowerCase().includes(search.toLowerCase())
        );
      }
      return note.toLowerCase().includes(search.toLowerCase());
    });

  console.log("The filtered items are ", filtered);

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
      setSnackbar({ open: true, message: "Note added" });
    } else {
      setCheck("Cannot be empty!");
      setTimeout(() => {
        setCheck("");
      }, 2000);
    }
  };

  const handleEdit = (key) => {
    setEditing(key);
    setEditText(notes[key]);
  };

  const handleSave = (key) => {
    Swal.fire({
      title: "Save changes?",
      text: "Do you want to save the changes to this note?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, save it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedNotes = [...notes];
        updatedNotes[key] = editText;
        setNotes(updatedNotes);
        localStorage.setItem("ReactTodo", updatedNotes.join(","));
        setEditing(null);
        setSnackbar({ open: true, message: "Note edited" });
      }
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ open: false, message: "" });
  };

  const handleDarkModeToggle = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", JSON.stringify(newMode));
      return newMode;
    });
  };

  // Helper function to check if there are any completed notes
  const hasCompletedNotes = () => {
    return Object.values(completedNotes).some((completed) => completed);
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className={`relative p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-sm ${
        darkMode ? `bg-gray-800/90 text-white` : `bg-white/90 text-black`
      }`}>
        {(deferredPrompt || isIOS) && (
          <button
            onClick={handleInstallClick}
            className={`relative right-[-430px] top-[0px] flex items-center gap-2 px-6 py-3 rounded-full shadow-lg 
              transition-all duration-300 transform hover:scale-105 active:scale-95
              ${darkMode 
                ? 'bg-gradient-to-r from-blue-600 to-purple-700 text-white' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
              }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 11h-2v-4h2v4zm0-6h-2V5h2v2z"/>
            </svg>
            Install TaskTame
          </button>
        )}

        <div className="flex justify-between items-center mb-6">
          <h1
            style={{ fontFamily: "'Saira Condensed', sans-serif" }}
            className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"
          >
            TaskTame
          </h1>
          <Button
            variant="contained"
            size="small"
            className="rounded-full"
            sx={{
              background: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
              boxShadow: 'none',
              '&:hover': {
                background: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
              }
            }}
            onClick={handleDarkModeToggle}
          >
            {darkMode ? (
              <WbSunnyIcon className="text-yellow-400" />
            ) : (
              <DarkModeIcon className="text-gray-600" />
            )}
          </Button>
        </div>
        <form onSubmit={toSubmit} className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <input
              type="text"
              className={`flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${darkMode
                  ? `bg-gray-700 border-gray-600 text-white`
                  : `bg-white border-gray-200 text-black`
                }`}
              placeholder="Add a new task..."
            />
            <button
              type="submit"
              className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <div className="flex items-center gap-1">
                <AddTaskIcon /> Add
              </div>
            </button>
          </div>
          <div className={`flex items-center rounded-lg border ${darkMode
              ? 'bg-gray-700 border-gray-600'
              : 'bg-white border-gray-200'
            }`}>
            <SearchIcon className="ml-3 text-gray-400" />
            <input
              type="text"
              onChange={handleChange}
              placeholder="Search tasks..."
              className={`flex-1 p-3 rounded-lg focus:outline-none ${darkMode
                  ? `bg-gray-700 text-white`
                  : `bg-white text-black`
                }`}
            />
          </div>
        </form>
        {check && (
          <Alert severity="warning" className="text-red-600 text-center mb-4">
            {check}
          </Alert>
        )}
        <div className="flex gap-2 mt-4">
          <Button
            size="small"
            startIcon={<ClearIcon />}
            sx={{
              display: reset || notes.length === 0 ? "none" : "inline-flex",
              borderRadius: '9999px',
              textTransform: 'none',
              marginBottom:'23px',
              backgroundColor: darkMode ? 'rgba(239,83,80,0.1)' : 'rgba(239,83,80,0.1)',
              color: '#ef5350',
              '&:hover': {
                backgroundColor: 'rgba(239,83,80,0.2)',
              },
            }}
            onClick={handleReset}
          >
            Clear all
          </Button>
          {hasCompletedNotes() && (
            <Button
              sx={{
                display: reset || notes.length === 0 ? "none" : "inline-flex",
                borderRadius: '9999px',
                textTransform: 'none',
                backgroundColor: darkMode ? 'rgba(102,187,106,0.1)' : 'rgba(102,187,106,0.1)',
                color: '#66bb6a',
                '&:hover': {
                  backgroundColor: 'rgba(102,187,106,0.2)',
                },
              }}
              onClick={() => setShowCompleted(!showCompleted)}
            >
              {showCompleted ? "Show all" : "Show Completed"}
            </Button>
          )}
        </div>
        <ul className="space-y-3">
          {filtered.map(({ note, index }) => (
            <li
              key={index}
              className={`flex items-center justify-between rounded-xl p-4 transition-all ${darkMode
                  ? 'bg-gray-700/50 hover:bg-gray-700'
                  : 'bg-gray-50 hover:bg-gray-100'
                }`}
            >
              <div className="flex items-center flex-1 gap-2">
                <div className="flex items-center min-w-[40px]">
                  <div
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${darkMode
                        ? 'bg-gray-600 text-gray-300'
                        : 'bg-gray-200 text-gray-600'
                      }`}
                  >
                    {index + 1}
                  </div>
                  <Checkbox
                    checked={completedNotes[index]}
                    onChange={() => handleCheckboxChange(index)}
                    icon={<CircleOutlinedIcon />}
                    checkedIcon={<CheckCircleIcon />}
                    sx={{
                      color: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                      '&.Mui-checked': {
                        color: '#10B981', // Modern green color
                      },
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: 'transparent'
                      },
                      padding: '4px'
                    }}
                  />
                </div>

                {editing === index ? (
                  <BaseTextareaAutosize
                    minRows={2}
                    placeholder="Edit here"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className={`w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none ${darkMode
                        ? 'bg-gray-600 text-white'
                        : 'bg-white text-black'
                      }`}
                    style={{
                      border: "1px solid rgba(99, 102, 241, 0.3)",
                      resize: "none",
                    }}
                  />
                ) : (
                  <span
                    className={`flex-1 text-base ${completedNotes[index]
                        ? `line-through opacity-50 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                        : ''
                      }`}
                  >
                    {note}
                  </span>
                )}
              </div>

              <div className="flex gap-1">
                {editing === index ? (
                  <IconButton
                    onClick={() => handleSave(index)}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(16, 185, 129, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(16, 185, 129, 0.2)',
                      }
                    }}
                  >
                    <SaveIcon sx={{ fontSize: 20, color: '#10B981' }} />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={() => handleEdit(index)}
                    size="small"
                    sx={{
                      backgroundColor: darkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      '&:hover': {
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      }
                    }}
                  >
                    <EditIcon sx={{ fontSize: 20, color: '#3B82F6' }} />
                  </IconButton>
                )}
                <IconButton
                  onClick={() => onDelete(note, index)}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    }
                  }}
                >
                  <DeleteOutlineOutlinedIcon sx={{ fontSize: 20, color: '#EF4444' }} />
                </IconButton>
              </div>
            </li>
          ))}
        </ul>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          message={snackbar.message}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        />
        {isIOS && (
          <p>📲 On iOS, tap &quot;Share&quot; → &quot;Add to Home Screen&quot; to install this PWA.</p>
        )}
      </div>
    </div>
  );
}
