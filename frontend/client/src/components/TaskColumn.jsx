import React from "react";
import { useContext } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const TaskColumn = ({ status, tasks, boardId }) => {
  const { setNodeRef } = useDroppable({
    id: `column-${status}`,
  });

  // Colori per colonne
  const getColumnColor = (status) => {
    switch (status) {
      case "todo":
        return "border-yellow-500/50 bg-yellow-900/10";
      case "doing":
        return "border-blue-500/50 bg-blue-900/10";
      case "done":
        return "border-green-500/50 bg-green-900/10";
      default:
        return "border-gray-600 bg-gray-800";
    }
  };

  return (
    <div
      className={`flex-1 rounded-xl p-5 border-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 min-h-96 flex flex-col ${getColumnColor(
        status,
      )}`}
    >
      {/* Header */}
      <div className="mb-4 pb-3 border-b border-gray-700">
        <h3 className="text-lg font-bold capitalize flex items-center gap-2">
          {status === "todo" && "Da fare"}
          {status === "doing" && "In progresso"}
          {status === "done" && "Completato"}
          <span className="ml-auto text-sm bg-gray-700 px-2 py-1 rounded">
            {tasks.length}
          </span>
        </h3>
      </div>

      {/* Tasks Container - scrollable */}
      <SortableContext
        items={tasks.map((t) => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className="space-y-3 flex-1 overflow-y-auto overflow-x-hidden pr-2"
        >
          {tasks.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <p className="text-gray-500 text-sm">
                {status === "todo" && "Nessuna task. Crea una!"}
                {status === "doing" && "Niente di urgente "}
                {status === "done" && "Buon lavoro!"}
              </p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard key={task.id} task={task} boardId={boardId} />
            ))
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default TaskColumn;
