import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserAuth } from 'src/utils/types';

@Injectable()
export class UserService {
    async create(createUserDto: CreateUserDto): Promise<number> {
        const { name, email, password, phone_number, business_name, address, postal_code } = createUserDto;
        const uniqueMail = await User.findOne({ where: { email: email } });
        if (uniqueMail) {
            throw new BadRequestException('El usuario ya existe');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone_number,
            business_name,
            address,
            postal_code,
        });
        return user.id;
    }

    async findAll(): Promise<User[]> {
        const users = await User.findAll();
        if (!users) {
            throw new NotFoundException('No se pudieron encontrar los usuarios');
        }
        return users;
    }

    async findOne(id: number): Promise<User> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return user;
    }

    async findByEmail(email: string): Promise<UserAuth | null> {
        return User.findOne({ where: { email } }) as unknown as UserAuth;
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await user.update(updateUserDto);
        return user;
    }

    async remove(id: number): Promise<void> {
        const user = await User.findByPk(id);
        if (!user) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await user.destroy();
    }
}
