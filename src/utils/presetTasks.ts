import { Task, TaskStatus } from '../types/Task';

const generatePresetTask = (
  title: string,
  description: string,
  status: TaskStatus,
  dueDate?: Date,
  subtasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] = []
): Omit<Task, 'id' | 'createdAt' | 'updatedAt'> => ({
  title,
  description,
  status,
  dueDate,
  subtasks: [],
  isSubtask: false
});

export const getPresetTasks = (): Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  return [
    generatePresetTask(
      '👋 Welcome to Taskr!',
      'This is a demo task to help you get started. You can click on any task to edit it, or click the checkbox to mark it as complete.',
      'To Do'
    ),
    generatePresetTask(
      '✨ Create Subtasks',
      'Click the "+ Add subtask" button on any task to create subtasks. Try organizing your work into smaller, manageable pieces!',
      'To Do',
      tomorrow,
      [
        {
          title: '📝 This is a subtask',
          description: 'Subtasks help break down complex tasks into smaller pieces',
          status: 'To Do'
        }
      ]
    ),
    generatePresetTask(
      '🎯 Try Different Views',
      'Use the view selector above to switch between Normal, Kanban, and Calendar views. Each view offers a different way to organize your tasks!',
      'In Progress',
      nextWeek
    ),
    generatePresetTask(
      '🌙 Dark Mode Available',
      'Click the theme toggle in the top right corner to switch between light and dark modes.',
      'Completed'
    )
  ];
};

export const hasSeenPresetTasks = (): boolean => {
  return localStorage.getItem('hasSeenPresetTasks') === 'true';
};

export const markPresetTasksAsSeen = (): void => {
  localStorage.setItem('hasSeenPresetTasks', 'true');
};

export const resetPresetTasksState = (): void => {
  localStorage.removeItem('hasSeenPresetTasks');
}; 