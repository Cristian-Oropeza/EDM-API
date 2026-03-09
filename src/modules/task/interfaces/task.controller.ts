import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { UpdateTaskDto } from '../dto/update-task.dto';

@Controller('/api/task')
export class TaskController {
  constructor(private tasksvc: TaskService) {}

  @Get('')
  async getAllTasks(): Promise<Task[]> {
    return await this.tasksvc.getAllTasks();
  }

  @Get(':id')
  public async getTaskById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Task> {
    const result = await this.tasksvc.getTaskById(id);

    if (result == undefined) {
      throw new HttpException(
        `Tarea con ID ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }

  @Post('')
  public insertTask(@Body() task: CreateTaskDto): Promise<Task> {
    const result = this.tasksvc.insertTask(task);

    if (!result) {
      throw new HttpException(
        'Error al insertar la tarea',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return result;
  }

  @Put(':id')
  public async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
  ): Promise<Task> {
    return await this.tasksvc.updateTask(id, task);
  }

  @Delete(':id')
  public async deleteTask(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    try {
      await this.tasksvc.deleteTask(id);
    } catch (error) {
      throw new HttpException(
        `Error al eliminar la tarea con ID ${id}, no se puede eliminar`,
        HttpStatus.NOT_FOUND,
      );
    }
    return true;
  }
}