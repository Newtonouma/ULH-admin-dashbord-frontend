import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CausesModule } from './causes/causes.module';
import { Cause } from './causes/cause.entity';
import { EventsModule } from './events/events.module';
import { Event } from './events/event.entity';
import { TeamsModule } from './teams/teams.module';
import { Team } from './teams/team.entity';
import { GalleryModule } from './gallery/gallery.module';
import { Gallery } from './gallery/gallery.entity';
import { DonationsModule } from './donations/donations.module';
import { Donation } from './donations/donation.entity';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DATABASE_HOST') || 'localhost',
        port: parseInt(
          configService.get<string>('DATABASE_PORT') || '5432',
          10,
        ),
        username: configService.get<string>('DATABASE_USER') || 'postgres',
        password: configService.get<string>('DATABASE_PASSWORD') || '9530',
        database: configService.get<string>('DATABASE_NAME') || 'universal-lighthouse',
        entities: [Cause, Event, Team, Gallery, Donation, User],
        synchronize: configService.get<string>('NODE_ENV') === 'development',
        migrations: ['dist/migrations/*{.ts,.js}'],
        migrationsRun: configService.get<string>('NODE_ENV') === 'production',
        logging: configService.get<string>('NODE_ENV') === 'development',
        ssl: false, // Disabled for local development
        cache: false,
      }),
    }),

    CausesModule,
    EventsModule,
    TeamsModule,
    GalleryModule,
    DonationsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
