import { useContext, useEffect } from "react";
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

  return <div></div>;
};

export default Dashboard;
