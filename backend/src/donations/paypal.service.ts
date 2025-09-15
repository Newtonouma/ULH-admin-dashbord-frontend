import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

@Injectable()
export class PaypalService {
  private clientId = process.env.PAYPAL_CLIENT_ID;
  private clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  private apiUrl = 'https://api-m.sandbox.paypal.com'; // Use sandbox for testing

  async getAccessToken(): Promise<string | null> {
    const basicAuth = Buffer.from(
      `${this.clientId}:${this.clientSecret}`,
    ).toString('base64');
    const tokenRes = await fetch(`${this.apiUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });
    const tokenData = await tokenRes.json();
    return tokenData.access_token || null;
  }

  async createOrder(
    amount: string,
    causeId: string,
    returnUrl: string,
    cancelUrl: string,
  ): Promise<string | null> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) return null;
    const orderRes = await fetch(`${this.apiUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: { value: amount, currency_code: 'USD' },
            custom_id: causeId,
          },
        ],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      }),
    });
    const orderData = await orderRes.json();
    const approvalUrl = orderData.links?.find(
      (l: any) => l.rel === 'approve',
    )?.href;
    return approvalUrl || null;
  }

  async verifyOrder(orderId: string): Promise<boolean> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) return false;
    const orderRes = await fetch(
      `${this.apiUrl}/v2/checkout/orders/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const orderData = await orderRes.json();
    return orderData.status === 'COMPLETED';
  }

  async captureOrder(orderId: string): Promise<any> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) return null;
    const captureRes = await fetch(
      `${this.apiUrl}/v2/checkout/orders/${orderId}/capture`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return captureRes.json();
  }
}
