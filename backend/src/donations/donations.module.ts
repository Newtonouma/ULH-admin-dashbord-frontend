import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Donation } from './donation.entity';
import { Cause } from '../causes/cause.entity';
import { DonationsService } from './donations.service';
import { DonationsController } from './donations.controller';
import { PaypalService } from './paypal.service';

@Module({
  imports: [TypeOrmModule.forFeature([Donation, Cause])],
  providers: [DonationsService, PaypalService],
  controllers: [DonationsController],
  exports: [DonationsService],
})
export class DonationsModule {}
