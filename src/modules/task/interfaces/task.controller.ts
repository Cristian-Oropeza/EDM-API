import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from '../dto/create-task.dto';

@Controller('/api/task')
export class TaskController {
  constructor(public readonly taskSvc: TaskService) {}

  //! https:localhost:3000/api/task
  @Get()
  public getAllTasks(): string {
    return this.taskSvc.getAllTasks();
  }

  //! https:localhost:3000/api/task/1
  @Get(':id')
  public getTaskById(@Param('id') id: string): string {
    return this.taskSvc.getTaskById(id);
  }

  @Post()
  public insertTask(@Body() task: CreateTaskDto): any {
    console.error('insert', task);
    return this.taskSvc.insertTask(task);
  }

  @Put()
  public updateTask(task: any): any {
    return this.taskSvc.updateTask(task);
  }

  @Delete(':id')
  public deleteTask(id: string): string {
    return this.taskSvc.deleteTask(id);
  }
}
