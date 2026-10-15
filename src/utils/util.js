import tasks from "../assets/tasks.png";
import projects from "../assets/projects.png";
import completedTasks from "../assets/completedTasks.png";
import pendingTasks from "../assets/pendingTasks.png";

export const statusOptions = [
  { label: "Active", value: "Active" },
  { label: "Inactive", value: "Inactive" },
];

export const priorityOptions = [
  { label: "Low", value: "Low" },
  { label: "Medium", value: "Low" },
  { label: "High", value: "Low" },
];

export const taskStatuses = [
  { id: "backlog", label: "Backlog", value: "backlog" },
  { id: "todo", label: "Todo", value: "Todo" },
  { id: "in-progress", label: "In Progress", value: "In Progress" },
  { id: "in-qa", label: "In QA", value: "In QA" },
  { id: "completed", label: "Completed", value: "Completed" },
];

export const projectMetrics = [
  {
    key: "totalProjects",
    label: "Total projects",
    aliases: ["totalprojects", "totalprojectcount", "projectcount"],
    icon: projects,
    tone: "purple",
  },
  {
    key: "totalTasks",
    label: "Total tasks",
    aliases: ["totaltasks", "totaltaskcount", "taskcount"],
    icon: tasks,
    tone: "blue",
  },
  {
    key: "pendingTasks",
    label: "Pending tasks",
    aliases: ["pendingtasks", "pendingtaskcount", "totaltodotasks"],
    icon: pendingTasks,
    tone: "amber",
  },
  {
    key: "completedTasks",
    label: "Completed tasks",
    aliases: ["completedtasks", "completedtaskcount", "completetasks"],
    icon: completedTasks,
    tone: "green",
  },
];
