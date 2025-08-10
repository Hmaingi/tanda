import { defineStore } from 'pinia';

export interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  status: 'pending' | 'inProgress' | 'completed';
}

export const useTaskStore = defineStore('task', {
  state: () => ({
    tasks: [] as Task[],
    nextId: 1,
  }),
  actions: {
    addTask(task: Omit<Task, 'id'>) {
      this.tasks.push({ ...task, id: this.nextId++ });
    },
    deleteTask(id: number) {
      this.tasks = this.tasks.filter(task => task.id !== id);
    },
    updateTask(updated: Task) {
      const index = this.tasks.findIndex(task => task.id === updated.id);
      if (index !== -1) {
        this.tasks[index] = updated;
      }
    },
  },
});
