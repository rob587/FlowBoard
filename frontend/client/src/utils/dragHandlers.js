export const handleDragEnd = async (event, tasks, boardId, updateTask) => {
  const { active, over } = event;

  if (!over) return;

  const taskId = active.id;
  // conversione a stringa e estraggo lo status
  const overIdString = String(over.id);
  // se non è una colonna viene skippata
  if (!overIdString.includes("column-")) return;

  const newColumnStatus = overIdString.replace("column-", "");

  const task = tasks.find((t) => t.id === taskId);

  if (!task) return;

  if (task.status === newColumnStatus) return;

  console.log(
    `La Task ${taskId} è stata impostata da ${task.status} a ${newColumnStatus}`,
  );

  await updateTask(
    taskId,
    task.title,
    task.description,
    newColumnStatus,
    task.position,
  );
};
