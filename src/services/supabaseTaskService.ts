import { Task } from '../types/Task';
import { supabase, toTask } from './supabaseClient';
import { AuthService } from './authService';

export class SupabaseTaskService {
  static async getTasks(): Promise<Task[]> {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data.map(toTask);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  // Static method to save a new task to the database
  static async saveTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task | null> {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) return null;

      const newTaskData = {
        title: task.title,
        description: task.description || null,
        status: task.status,
        due_date: task.dueDate?.toISOString() || null,
        user_id: user.id
      };

      // Inserting the new task into the database and selecting the inserted data
      const { data, error } = await supabase
        .from('tasks')
        .insert([newTaskData])
        .select()
        .single();

      // Checking for errors and throwing if any
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Returning the inserted task data transformed to the Task interface, or null if insertion failed
      return data ? toTask(data) : null;
    } catch (error) {
      console.error('Error saving task:', error);
      return null;
    }
  }

  // Static method to update an existing task in the database
  static async updateTask(taskId: string, updates: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Task | null> {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) return null;

      // Creating an update object with the provided updates
      const updateData: Record<string, any> = {};
      
      // Dynamically adding updates to the updateData object
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate?.toISOString() || null;

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', taskId)
        .eq('user_id', user.id) // Only update if the task belongs to the user
        .select('*')
        .single();

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      // Returning the updated task data transformed to the Task interface, or null if update failed
      return data ? toTask(data) : null;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  }

  // Static method to delete a task from the database
  static async deleteTask(taskId: string): Promise<boolean> {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) return false;

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id); // Only delete if the task belongs to the user

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  }
} 