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

  return;
};

export default TaskCard;
