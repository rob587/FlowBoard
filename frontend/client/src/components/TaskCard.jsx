import React from "react";
import { useContext, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SocketContext } from "../context/SocketContext";
import Modal from "./Modal";

const TaskCard = ({ task, boardId }) => {
  const { deleteTask, updateTask } = useContext(SocketContext);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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

  // Funzione per formattare la data
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT", {
      day: "numeric",
      month: "short",
    });
  };

  const isOverdue = (dateStr) => {
    if (!dateStr) return false;
    const today = new Date();
    const dueDate = new Date(dateStr);
    return dueDate < today;
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-600";
      case "medium":
        return "bg-yellow-600";
      case "high":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const getPriorityEmoji = (priority) => {
    switch (priority) {
      case "low":
        return "🟢";
      case "medium":
        return "🟡";
      case "high":
        return "🔴";
      default:
        return "⚪";
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition"
      >
        {/* Draggable Section */}
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing"
        >
          <h4 className="font-semibold text-white">{task.title}</h4>
          {task.description && (
            <p className="text-sm text-gray-400 mt-1">{task.description}</p>
          )}
        </div>

        {/* Priority + Due Date Row */}
        <div className="flex gap-2 mt-3 flex-wrap">
          {/* Priority Badge */}
          <span
            className={`text-xs px-2 py-1 rounded ${getPriorityColor(
              task.priority,
            )}`}
          >
            {getPriorityEmoji(task.priority)} {task.priority}
          </span>

          {/* Due Date Badge */}
          {task.due_date && (
            <span
              className={`text-xs px-2 py-1 rounded ${
                isOverdue(task.due_date) ? "bg-red-600" : "bg-blue-600"
              }`}
            >
              📅 {formatDate(task.due_date)}
            </span>
          )}
        </div>

        {/* Status + Delete Button */}
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
            onClick={() => setDeleteModalOpen(true)}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-2 py-1 rounded transition"
          >
            Delete
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        title="Eliminazione Task"
        message="Sei sicuro di voler eliminare questa task?"
        confirmText="Cancella"
        cancelText="Indietro"
        isDanger={true}
        onConfirm={() => {
          deleteTask(task.id, boardId);
          setDeleteModalOpen(false);
        }}
        onCancel={() => {
          setDeleteModalOpen(false);
        }}
      />
    </>
  );
};

export default TaskCard;
