import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from '../user/user.entity';
import { RegisterDto } from '../../dto/register.dto';

import { LoginDto } from '../../dto/login.dto';
import { RefreshToken } from './refresh-token/refresh-token.entity';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenDto } from '../../dto/refresh-token.dto';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: Repository<RefreshToken>,

    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
       console.log(
    'JWT_SECRET:',
    this.configService.get('JWT_SECRET'),
  );
  }

  async register(registerDto: RegisterDto) {
    const {
      email,
      password,
      firstName,
      lastName,
      employeeId,
      phone,
      department,
      designation,
    } = registerDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({
      where: {
        email,
      },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered.');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepository.create({
      email,
      passwordHash: hashedPassword,
      firstName,
      lastName,
      employeeId,
      phone,
      department,
      designation,
    });

    const savedUser = await this.userRepository.save(user);

    const { passwordHash, ...userData } = savedUser;

    return {
      success: true,
      message: 'User registered successfully.',
      data: savedUser,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new BadRequestException('Your account has been deactivated.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    user.lastLoginAt = new Date();

    await this.userRepository.save(user);

    const tokens = await this.generateTokens(user);

    const { passwordHash, ...userData } = user;

    return {
      success: true,
      message: 'Login successful.',
      user: userData,
      ...tokens,
    };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    // Generate Access Token
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
    });

    // Generate Refresh Token
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    // Calculate Expiry Date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    // Save Refresh Token
    const refreshTokenEntity = this.refreshTokenRepository.create({
      user,
      token: refreshToken,
      expiresAt,
    });

    await this.refreshTokenRepository.save(refreshTokenEntity);

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    // Find refresh token
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
      relations: {
        user: true,
      },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // Check expiration
    if (storedToken.expiresAt < new Date()) {
      await this.refreshTokenRepository.remove(storedToken);
      throw new UnauthorizedException('Refresh token expired.');
    }

    // Verify JWT
    try {
      await this.jwtService.verifyAsync(refreshToken);
    } catch {
      await this.refreshTokenRepository.remove(storedToken);
      throw new UnauthorizedException('Invalid refresh token.');
    }

    // Remove old refresh token (Token Rotation)
    await this.refreshTokenRepository.remove(storedToken);

    // Generate new tokens
    const tokens = await this.generateTokens(storedToken.user);
    return {
      success: true,
      message: 'Token refreshed successfully.',
      ...tokens,
    };
  }

  async logout(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;
    const storedToken = await this.refreshTokenRepository.findOne({
      where: { token: refreshToken },
    });
    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
    //Remove refresh token
    await this.refreshTokenRepository.remove(storedToken);
    return { success: true, message: 'Logout successful.' };
  }

  async me(user: User) {
    const dbUser = await this.userRepository.findOne({
      where: { id: user.id },
      relations: {
        favorites: true,
        folders: true,
        documents: true,
      }, // Optional: remove if not needed
    });
    if (!dbUser) {
      throw new UnauthorizedException('User not found.');
    }
    const { passwordHash, ...userData } = dbUser;
    return { success: true, data: userData };
  }
}
