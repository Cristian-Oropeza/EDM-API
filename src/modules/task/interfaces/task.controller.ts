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
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Controller('/api/task')
@UseGuards(AuthGuard) // ← agregado, protege todos los endpoints de task
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

    if (!result) {
      throw new HttpException(
        { message: `Tarea con ID ${id} no encontrada`, errorCode: 'TASK_NOT_FOUND' },
        HttpStatus.NOT_FOUND,
      );
    }

    return result;
  }

  @Post('')
  public async insertTask(@Body() task: CreateTaskDto): Promise<Task> {
    try {
      return await this.tasksvc.insertTask(task);
    } catch (error: any) {
      // P2003 = foreign key constraint, el user_id no existe
      if (error?.code === 'P2003') {
        throw new HttpException(
          { message: `El usuario con ID ${task.user_id} no existe`, errorCode: 'USER_NOT_FOUND' },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        { message: 'Error al insertar la tarea', errorCode: 'TASK_CREATE_ERROR' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  public async updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() task: UpdateTaskDto,
  ): Promise<Task> {
    const result = await this.tasksvc.getTaskById(id);

    if (!result) {
      throw new HttpException(
        { message: `Tarea con ID ${id} no encontrada`, errorCode: 'TASK_NOT_FOUND' },
        HttpStatus.NOT_FOUND,
      );
    }

    return await this.tasksvc.updateTask(id, task);
  }

  @Delete(':id')
  public async deleteTask(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<boolean> {
    const result = await this.tasksvc.getTaskById(id);

    if (!result) {
      throw new HttpException(
        { message: `Tarea con ID ${id} no encontrada`, errorCode: 'TASK_NOT_FOUND' },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.tasksvc.deleteTask(id);
    return true;
  }
}