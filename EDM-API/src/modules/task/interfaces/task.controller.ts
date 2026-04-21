import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../entities/task.entity';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LogsService } from 'src/modules/logs/interfaces/logs.service';

@Controller('/api/task')
@UseGuards(AuthGuard)
export class TaskController {
  constructor(
    private tasksvc: TaskService,
    private readonly logsSvc: LogsService,
  ) {}

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
  public async insertTask(
    @Body() task: CreateTaskDto,
    @Req() req: any,
  ): Promise<Task> {
    try {
      return await this.tasksvc.insertTask({ ...task, user_id: req.user.id });
    } catch (error: any) {
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
    @Req() req: any,
  ): Promise<Task> {
    const result = await this.tasksvc.getTaskById(id);

    if (!result) {
      throw new HttpException(
        { message: `Tarea con ID ${id} no encontrada`, errorCode: 'TASK_NOT_FOUND' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (result.user_id !== req.user.id) {
      await this.logsSvc.createLog({
        status_code: 403,
        path: `/api/task/${id}`,
        error: 'Intento de editar tarea ajena',
        error_code: 'FORBIDDEN_TASK_UPDATE',
        session_id: req.user.id,
      });
      throw new ForbiddenException({
        message: 'No tienes permiso para editar esta tarea',
        errorCode: 'FORBIDDEN_TASK_UPDATE',
      });
    }

    return await this.tasksvc.updateTask(id, task);
  }

  @Delete(':id')
  public async deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: any,
  ): Promise<boolean> {
    const result = await this.tasksvc.getTaskById(id);

    if (!result) {
      throw new HttpException(
        { message: `Tarea con ID ${id} no encontrada`, errorCode: 'TASK_NOT_FOUND' },
        HttpStatus.NOT_FOUND,
      );
    }

    if (result.user_id !== req.user.id) {
      await this.logsSvc.createLog({
        status_code: 403,
        path: `/api/task/${id}`,
        error: 'Intento de eliminar tarea ajena',
        error_code: 'FORBIDDEN_TASK_DELETE',
        session_id: req.user.id,
      });
      throw new ForbiddenException({
        message: 'No tienes permiso para eliminar esta tarea',
        errorCode: 'FORBIDDEN_TASK_DELETE',
      });
    }

    await this.tasksvc.deleteTask(id);
    return true;
  }
}