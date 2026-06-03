import React from "react";
import { useContext } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SocketContext } from "../context/SocketContext";

const TaskCard = ({ task, boardId }) => {
  const { deleteTask, updateTask } = useContext(SocketContext);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="bg-gray-700 p-4 rounded-lg cursor-grab active:cursor-grabbing hover:bg-gray-600 transition"
      >
        <h4 className="font-semibold text-white">{task.title}</h4>
        {task.description && (
          <p className="text-sm text-gray-400 mt-1">{task.description}</p>
        )}
        <div className="flex justify-between items-center mt-3">
          <span
            className={`text-xs px-2 py-1 rounded ${
              task.status === "todo"
                ? "bg-yellow-600"
                : task.status === "doing"
                  ? "bg-blue-600"
                  : "bg-green-600"
            }`}
          >
            {task.status}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteTask(task.id, boardId);
            }}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-2 py-1 rounded transition"
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
};

export default TaskCard;
