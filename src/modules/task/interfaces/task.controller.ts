import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { Task } from '../entities/task.entity';

@Controller('/api/task')
export class TaskController {
  constructor(public readonly taskSvc: TaskService) {}

  @Get()
  public getAllTasks(): Promise<Task[]> {
    return this.taskSvc.getAllTasks();
  }

  @Get(':id')
  public getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskSvc.getTaskById(parseInt(id));
  }

  @Post()
  public insertTask(@Body() task: CreateTaskDto): Promise<Task> {
    return this.taskSvc.insertTask(task);
  }

  @Put(':id')
  public updateTask(
    @Param('id') id: string,
    @Body() task: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskSvc.updateTask(parseInt(id), task);
  }

  @Delete(':id')
  public async deleteTask(@Param('id') id: string): Promise<boolean> {
    const result = await this.taskSvc.deleteTask(parseInt(id));

    if (!result)
      throw new HttpException(
        'No se puede eliminar la tarea',
        HttpStatus.NOT_FOUND,
      );

    return result;
  }
}