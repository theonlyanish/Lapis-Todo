import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskStatus } from '../types/Task';

// Define the interface for TaskFormProps
export interface TaskFormProps {
  selectedTask: Task | null;
  onSubmit: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  initialDueDate?: Date | null;
  parentId?: string | null;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  selectedTask,
  onSubmit,
  onUpdate,
  onDelete,
  initialDueDate,
  parentId
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [dueDate, setDueDate] = useState<string>('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  // Log props for debugging
  console.log('TaskForm props:', { selectedTask, parentId, initialDueDate });

  // Focus the input when the component mounts
  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  // useEffect hook to populate form fields with selectedTask data
  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || '');
      setStatus(selectedTask.status);
      setDueDate(selectedTask.dueDate ? new Date(selectedTask.dueDate).toISOString().split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setDueDate(initialDueDate ? new Date(initialDueDate).toISOString().split('T')[0] : '');
      // Focus the title input when creating a new task
      titleInputRef.current?.focus();
    }
  }, [selectedTask, initialDueDate]);

  // Function to handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      title,
      description,
      status,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      parentId: parentId || undefined
    };

    console.log('Submitting form data:', { formData, selectedTask, parentId });

    if (selectedTask && selectedTask.id && onUpdate) {
      // If we have a selected task with a valid ID, use onUpdate
      onUpdate(selectedTask.id, formData);
    } else {
      // If no selected task or empty ID, use onSubmit for new task
      onSubmit(formData);
    }
    
    // Clear form if no task was selected
    if (!selectedTask) {
      setTitle('');
      setDescription('');
      setStatus('To Do');
      setDueDate('');
    }
  };

  // Generate a unique key for the form to force re-render when switching between new task and edit mode
  const formKey = selectedTask ? `edit-${selectedTask.id}` : parentId ? `new-subtask-${parentId}` : 'new-task';

  // Determine the form title based on whether we're creating a subtask or editing a task
  const formTitle = parentId ? 'Add Subtask' : selectedTask?.id ? 'Edit Task' : '';

  // JSX for the form
  return (
    <form key={formKey} onSubmit={handleSubmit} className="task-form">
      {formTitle && <h2>{formTitle}</h2>}
      <div className="form-group">
        <label>Task:</label>
        <input
          ref={titleInputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder={parentId ? "Enter subtask title" : "Enter task title"}
          className="form-input"
          autoFocus={!selectedTask} // Add autoFocus when creating new task
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          className="form-input description-input"
          rows={4}
        />
      </div>

      <div className="form-group">
        <label>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TaskStatus)}
          required
          className="form-input status-select"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="form-group">
        <label>Due date</label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="form-input"
          placeholder="dd-mm-yyyy"
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="add-task-btn">
          {selectedTask ? 'Save changes' : 'Add task'}
        </button>
        {selectedTask && onDelete && (
          <button 
            type="button"
            className="delete-task-btn"
            onClick={() => onDelete(selectedTask.id)}
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </form>
  );
};
