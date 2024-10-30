import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Pagination, PaginationDto } from 'src/utils/common/pagination';
import { ICurrentUser } from 'src/utils/interface/currentUser.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { jwt_config } from 'src/app-config-module/config';

@Injectable()
export class UserService {
    private readonly logger = new Logger(UserService.name);
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ){}

    async findAllUsers(pagination: PaginationDto): Promise<User[]> {
        const { skip, limit } = Pagination.paginate(pagination.page, pagination.limit);

        try {
            return this.userRepository.find({ 
                skip, take: limit,
                relations: ['orders']
            })
        } catch (error) {
            this.logger.error(`Error finding all users: ${error.message}`);
            throw new BadRequestException('Could not retrieve users');
        }
    }

    async findById(id: number): Promise<User> {
        try {
            const user = await this.userRepository.findOne({
                where: { id },
                relations: ['orders'],
            });
            if (!user) throw new NotFoundException(`User not found`);

            return user;
        } catch (error) {
            this.logger.error(`Error retrieving user{id:${id}}: ${error.message}`);
            throw new BadRequestException('Could not retrieve user');
        }
    }

    async findByEmail(email: string): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ 
                where: { email },
                relations: ['orders'],
            });
            if (!user) throw new NotFoundException(`User not found`);
            return user;
        } catch (error) {
            this.logger.error(`Error retrieving user{email:${email}}: ${error.message}`);
            throw new BadRequestException('Could not retrieve user');
        }
    }

    async createUser(name: string, email: string, password: string): Promise<User> {
        try {
            const user = this.userRepository.create({ name, email, password });
            return this.userRepository.save(user);
        } catch (error) {
            this.logger.error(`Error creating user: ${error.message}`);
            throw new InternalServerErrorException('Failed to SignUp user');
        }
    }

    async updateUser(
        currentUser: ICurrentUser,
        updateUserDto: UpdateUserDto
    ): Promise<User> {
        try {
            const user = await this.userRepository.findOne({ 
                where: { id: parseInt(currentUser.userId) } 
            });
            if (!user) throw new NotFoundException(`User not found`);

            if (updateUserDto.name) {
                user.name = updateUserDto.name;
            }
            if (updateUserDto.password) {
                user.password = await bcrypt.hash(updateUserDto.password, parseInt(jwt_config.salt));
            }

            return await this.userRepository.save(user);
        } catch (error) {
            this.logger.error(`Could not update user: ${error.message}`);
            throw new InternalServerErrorException('Could not update user');
        }
    }
}
