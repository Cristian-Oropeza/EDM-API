import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  public async getAllTasks(): Promise<Task[]> {
    const query = 'SELECT * FROM tasks';
    const result = await this.taskRepo.query(query);
    return result;
  }

  public async getTaskById(id: number): Promise<Task> {
    const query = 'SELECT * FROM tasks WHERE id = ?';
    const [result] = await this.taskRepo.query(query, [id]);

    if (!result)
      throw new HttpException(
        `Tarea con ID ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );

    return result;
  }

  public async insertTask(task: CreateTaskDto): Promise<Task> {
    const query = `INSERT INTO tasks (name, description, priority, user_id) 
                   VALUES (?, ?, ?, ?)`;
    const result = await this.taskRepo.query(query, [
      task.name,
      task.description,
      task.priority,
      task.user_id,
    ]);
    return this.getTaskById(result.insertId);
  }

  public async updateTask(id: number, taskUpdated: UpdateTaskDto): Promise<Task> {
    await this.taskRepo.query(
      `UPDATE tasks 
       SET name = ?, 
           description = ?, 
           priority = ?
       WHERE id = ?`,
      [taskUpdated.name, taskUpdated.description, taskUpdated.priority, id],
    );
    return this.getTaskById(id);
  }

  public async deleteTask(id: number): Promise<boolean> {
    const result = await this.taskRepo.query(
      'DELETE FROM tasks WHERE id = ?',
      [id],
    );
    return result.affectedRows > 0;
  }
}