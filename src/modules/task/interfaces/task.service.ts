import { Inject, Injectable } from '@nestjs/common';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class TaskService {
  constructor(
    @Inject('MYSQL_CONNECTION') private mysql: any,
    private prisma: PrismaService,
  ) {}

  public async getAllTasks(): Promise<Task[]> {
    const task = await this.prisma.task.findMany({ orderBy: { name: 'asc' } });
    return task;
  }

  public async getTaskById(id: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({ where: { id } });
    return task;
  }

  public async insertTask(task: CreateTaskDto): Promise<Task> {
    const newTask = await this.prisma.task.create({ data: task });
    return newTask;
  }

  public async updateTask(id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
    const task = await this.prisma.task.update({
      where: { id },
      data: taskUpdate,
    });
    return task;
  }

  public async deleteTask(id: number): Promise<Task> {
    const task = await this.prisma.task.delete({ where: { id } });
    return task;
  }

  //Git commit -m "Configuración para tareas"
}