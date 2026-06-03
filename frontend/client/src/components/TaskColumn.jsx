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

  return (
    <>
      <div className="flex-1 bg-gray-800 rounded-lg p-4 border border-gray-700 min-h-96">
        <h3 className="text-xl font-bold mb-4 capitalize">
          {status === "todo" && "📝 To Do"}
          {status === "doing" && "⚙️ Doing"}
          {status === "done" && "✅ Done"}
        </h3>

        <SortableContext
          items={tasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} className="space-y-3 min-h-96">
            {tasks.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No tasks</p>
            ) : (
              tasks.map((task) => (
                <TaskCard key={task.id} task={task} boardId={boardId} />
              ))
            )}
          </div>
        </SortableContext>
      </div>
    </>
  );
};

export default TaskColumn;
