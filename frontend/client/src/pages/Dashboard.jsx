import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";
import Modal from "../components/Modal";

import TaskColumn from "../components/TaskColumn";
import { DndContext, closestCorners } from "@dnd-kit/core";
import { handleDragEnd } from "../utils/dragHandlers";

const Dashboard = () => {
  const {
    boards,
    tasks,
    currentBoardId,
    loadBoards,
    loadTasks,
    createBoard,
    deleteBoard,
    createTask,
    deleteTask,
    updateTask,
  } = useContext(SocketContext);

  const [boardTitle, setBoardTitle] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [boardModalOpen, setBoardModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState(null);

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
      await createTask(
        currentBoardId,
        taskTitle,
        taskDesc,
        taskDueDate,
        taskPriority,
      );
      setTaskTitle("");
      setTaskDesc("");
      setTaskDueDate("");
      setTaskPriority("medium");
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
            onClick={() => setBoardModalOpen(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-6 transition"
          >
            + New Board
          </button>

          <div className="space-y-2">
            {boards.map((board) => (
              <div
                key={board.id}
                onClick={() => loadTasks(board.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition flex justify-between items-start cursor-pointer ${
                  currentBoardId === board.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-gray-200"
                }`}
              >
                <div className="flex-1">
                  <h3 className="font-semibold">{board.title}</h3>
                  <p className="text-sm text-gray-400">
                    {tasks.filter((t) => t.board_id === board.id).length} tasks
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBoardToDelete(board.id);
                    setDeleteModalOpen(true);
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm ml-2"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8 overflow-hidden">
          {currentBoardId ? (
            <>
              <h2 className="text-4xl font-bold mb-8">
                {boards.find((b) => b.id === currentBoardId)?.title}
              </h2>

              {/* Create Task Form */}
              <div className="bg-gray-800 p-4 md:p-5 lg:p-6 rounded-lg mb-4 md:mb-6 lg:mb-8 border border-gray-700">
                <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4">
                  ✨ Add New Task
                </h3>
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

                {/* Due Date */}
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Priority */}
                <select
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>

                <button
                  onClick={handleCreateTask}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition"
                >
                  Create Task
                </button>
              </div>

              {/* Tasks List */}
              {/* Tasks List */}
              <DndContext
                collisionDetection={closestCorners}
                onDragEnd={(event) =>
                  handleDragEnd(event, tasks, currentBoardId, updateTask)
                }
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 flex-1 overflow-y-auto">
                  {" "}
                  {/* ← RESPONSIVE! */}
                  <TaskColumn
                    status="todo"
                    tasks={tasks.filter((t) => t.status === "todo")}
                    boardId={currentBoardId}
                  />
                  <TaskColumn
                    status="doing"
                    tasks={tasks.filter((t) => t.status === "doing")}
                    boardId={currentBoardId}
                  />
                  <TaskColumn
                    status="done"
                    tasks={tasks.filter((t) => t.status === "done")}
                    boardId={currentBoardId}
                  />
                </div>
              </DndContext>
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

        {/* Modal per creare board */}
        <Modal
          isOpen={boardModalOpen}
          title="Create New Board"
          message="Enter board name:"
          confirmText="Create"
          cancelText="Cancel"
          hasInput={true}
          inputValue={boardTitle}
          onInputChange={setBoardTitle}
          inputPlaceholder="Board name..."
          onConfirm={() => {
            if (boardTitle.trim()) {
              createBoard(boardTitle, "");
              setBoardTitle("");
              setBoardModalOpen(false);
            }
          }}
          onCancel={() => {
            setBoardModalOpen(false);
            setBoardTitle("");
          }}
        />

        {/* Modal per eliminare board */}
        <Modal
          isOpen={deleteModalOpen}
          title="Delete Board"
          message="Sei sicuro? Verranno eliminate anche tutte le task!"
          confirmText="Delete"
          cancelText="Cancel"
          isDanger={true}
          onConfirm={() => {
            if (boardToDelete) {
              deleteBoard(boardToDelete);
              setDeleteModalOpen(false);
              setBoardToDelete(null);
            }
          }}
          onCancel={() => {
            setDeleteModalOpen(false);
            setBoardToDelete(null);
          }}
        />
      </div>
    </>
  );
};

export default Dashboard;
