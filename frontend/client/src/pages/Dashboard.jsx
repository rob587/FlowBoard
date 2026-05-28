import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";

const Dashboard = () => {
  const {
    boards,
    tasks,
    currentBoardId,
    loadBoards,
    loadTasks,
    createBoard,
    createTask,
    deleteTask,
  } = useContext(SocketContext);

  const [boardTitle, setBoardTitle] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

  useEffect(() => {
    loadBoards();
  }, []);

  const handleCreateBoard = async () => {
    if (boardTitle.trim()) {
      await createBoard(boardTitle, "");
      setBoardTitle("");
    }
  };

  const handleCreateTask = async () => {
    if (taskTitle.trim() && currentBoardId) {
      await createTask(currentBoardId, taskTitle, taskDesc);
      setTaskTitle("");
      setTaskDesc("");
    }
  };

  return (
    <>
      <div className="flex h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 border-r border-gray-700 p-6 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-8 text-blue-400">
            📋 FlowBoard
          </h1>

          <button
            onClick={() => {
              const title = prompt("Board title?");
              if (title) {
                setBoardTitle(title);
                createBoard(title, "");
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-6 transition"
          >
            + New Board
          </button>

          <div className="space-y-2">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => loadTasks(board.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition ${
                  currentBoardId === board.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
              >
                <h3 className="font-semibold">{board.title}</h3>
                <p className="text-sm text-gray-400">{tasks.length} tasks</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-8">
          {currentBoardId ? (
            <>
              <h2 className="text-4xl font-bold mb-8">
                {boards.find((b) => b.id === currentBoardId)?.title}
              </h2>

              {/* Create Task Form */}
              <div className="bg-gray-800 p-6 rounded-lg mb-8 border border-gray-700">
                <h3 className="text-xl font-bold mb-4">✨ Add New Task</h3>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="2"
                />
                <button
                  onClick={handleCreateTask}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Create Task
                </button>
              </div>

              {/* Tasks List */}
              <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
                <h3 className="text-2xl font-bold mb-4">
                  Tasks ({tasks.length})
                </h3>
                <div className="space-y-3">
                  {tasks.length === 0 ? (
                    <p className="text-gray-400">No tasks yet. Create one!</p>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-gray-700 p-4 rounded-lg flex justify-between items-center hover:bg-gray-600 transition"
                      >
                        <div>
                          <h4 className="font-semibold">{task.title}</h4>
                          {task.description && (
                            <p className="text-sm text-gray-400">
                              {task.description}
                            </p>
                          )}
                          <span
                            className={`inline-block mt-2 text-xs px-2 py-1 rounded ${
                              task.status === "todo"
                                ? "bg-yellow-600"
                                : task.status === "doing"
                                  ? "bg-blue-600"
                                  : "bg-green-600"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                        <button
                          onClick={() => deleteTask(task.id, currentBoardId)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  👈 Select a board to start
                </h2>
                <p className="text-gray-400">
                  Or create a new one from the sidebar
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
