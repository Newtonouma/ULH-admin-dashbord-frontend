import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { EmailService } from './email.service';
import {
  LoginDto,
  RegisterDto,
  AuthResponseDto,
  TokenResponseDto,
  ForgotPasswordDto,
  ResetPasswordDto,
  ChangePasswordDto,
} from './dto/auth.dto';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  private refreshTokens: Set<string> = new Set();

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    try {
      const user = await this.usersService.create(registerDto);
      
      // Send welcome email (non-blocking)
      this.emailService.sendWelcomeEmail(user.email, user.username).catch(err => {
        console.warn('Failed to send welcome email:', err.message);
      });

      return this.generateTokens(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException('Failed to create user account');
    }
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(loginDto.usernameOrEmail, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    return this.generateTokens({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    if (!this.refreshTokens.has(refreshToken)) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOne(payload.sub);
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Generate new access token
      const accessToken = this.jwtService.sign(
        { sub: user.id, email: user.email, username: user.username, role: user.role },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      );

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    this.refreshTokens.delete(refreshToken);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour from now

    await this.usersService.updateResetToken(user.id, resetToken, resetTokenExpiry);

    // Send reset email
    try {
      await this.emailService.sendPasswordResetEmail(user.email, resetToken, user.username);
    } catch (error) {
      // Reset the token if email failed
      await this.usersService.clearResetToken(user.id);
      throw new BadRequestException('Failed to send password reset email');
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.usersService.findByResetToken(resetPasswordDto.token);
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Check if token is expired
    if (new Date() > user.resetTokenExpiry) {
      await this.usersService.clearResetToken(user.id);
      throw new BadRequestException('Reset token has expired');
    }

    // Update password
    user.password = resetPasswordDto.newPassword;
    await this.usersService.update(user.id, { password: user.password });

    // Clear reset token
    await this.usersService.clearResetToken(user.id);
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const fullUser = await this.usersService.findByIdWithPassword(userId);
    
    if (!fullUser) {
      throw new NotFoundException('User not found');
    }

    const isCurrentPasswordValid = await fullUser.validatePassword(changePasswordDto.currentPassword);
    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    await this.usersService.update(userId, { password: changePasswordDto.newPassword });
  }

  async validateUser(usernameOrEmail: string, password: string): Promise<User | null> {
    let user: User | null = null;

    // Check if it's an email or username
    if (usernameOrEmail.includes('@')) {
      user = await this.usersService.findByEmail(usernameOrEmail);
    } else {
      user = await this.usersService.findByUsername(usernameOrEmail);
    }

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }

  async getUserProfile(userId: number) {
    return this.usersService.findOne(userId);
  }

  private async generateTokens(user: { id: number; email: string; username: string; role: string }): Promise<AuthResponseDto> {
    const payload = { sub: user.id, email: user.email, username: user.username, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    // Store refresh token
    this.refreshTokens.add(refreshToken);

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    };
  }
}