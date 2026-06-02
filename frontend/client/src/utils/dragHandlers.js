export const handleDragEnd = async (event, TaskSignal, boardId, updateTask) => {
  const { active, over } = event;

  if (!over) return;

  const taskId = active.id;
  const newColumnStatus = over.id.replace("column-", "");

  const task = TaskSignal.find((t) => t.id === taskId);

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
