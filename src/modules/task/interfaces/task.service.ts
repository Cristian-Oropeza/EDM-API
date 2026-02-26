import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskService {
  public getAllTasks(): string {
    return 'Obteniendo las tareas';
  }

  public getTaskById(id: string): string {
    return `Obteniendo la tarea con ID: ${id}`;
  }

  public insertTask(task: any): any {
    return task;
  }

  public updateTask(task: any): any {
    return task;
  }

  public deleteTask(id: string): string {
    return `Eliminando la tarea con ID: ${id}`;
  }
}
