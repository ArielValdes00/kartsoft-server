import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@Controller('/:userId/employees')
@UseGuards(JwtAuthGuard)
export class EmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Post()
    create(@Param('userId') userId: string, @Body() createEmployeeDto: CreateEmployeeDto) {
        return this.employeeService.create(userId, createEmployeeDto);
    }

    @Get()
    findAll(@Param('userId') userId: string) {
        return this.employeeService.findAll(userId);
    }

    @Put(':id')
    update(@Param('userId') userId: string, @Param('id') id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
        return this.employeeService.update(userId, id, updateEmployeeDto);
    }

    @Delete(':id')
    remove(@Param('userId') userId: string, @Param('id') id: string) {
        return this.employeeService.remove(userId, id);
    }
}

@Controller('employee')
@UseGuards(JwtAuthGuard)
export class SpecificEmployeeController {
    constructor(private readonly employeeService: EmployeeService) { }

    @Get(':id') 
    findOne(@Param('id') id: string) {
        return this.employeeService.getOne(id);
    }
}
