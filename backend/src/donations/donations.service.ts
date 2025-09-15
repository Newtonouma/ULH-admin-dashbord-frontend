import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Donation } from './donation.entity';
import { Cause } from '../causes/cause.entity';
import { PaypalService } from './paypal.service';

@Injectable()
export class DonationsService {
  constructor(
    @InjectRepository(Donation)
    private readonly donationRepo: Repository<Donation>,
    @InjectRepository(Cause)
    private readonly causeRepo: Repository<Cause>,
    private readonly paypalService: PaypalService,
  ) {}

  async createDonation(data: {
    amount: number;
    donorName?: string;
    donorEmail?: string;
    causeId: string;
  }): Promise<Donation> {
    const cause = await this.causeRepo.findOne({ where: { id: data.causeId } });
    if (!cause) throw new NotFoundException('Cause not found');
    cause.raised = Number(cause.raised) + Number(data.amount);
    await this.causeRepo.save(cause);
    const donation = this.donationRepo.create({
      amount: data.amount,
      donorName: data.donorName,
      donorEmail: data.donorEmail,
      cause,
    });
    return this.donationRepo.save(donation);
  }

  async verifyPaypalPayment(orderId: string): Promise<boolean> {
    return this.paypalService.verifyOrder(orderId);
  }

  async captureAndVerifyPaypalPayment(orderId: string): Promise<boolean> {
    const captureResult = await this.paypalService.captureOrder(orderId);
    return captureResult && captureResult.status === 'COMPLETED';
  }
}
