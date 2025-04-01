import { HttpException, Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import Stripe from 'stripe';
import sql from 'src/utils/db';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { res } from 'src/utils/response';
import { z } from 'zod';
import { CheckoutSchema } from '@iglesiasbc/schemas';

dotenv.config();

const productLevels = {
  prod_Pb7zSCh5dqa1Wm: 1,
  prod_Pb7ykz67VzOBEK: 2,
  prod_QZTWzhVQHIpd9h: 1,
  prod_QZTUwdNGb4rEo1: 2,
  prod_Ra1XwAALSE1uVu: 1,
  prod_Ra1ZEXiI0Uabxn: 2,
};

const products = {
  'base-monthly': process.env.STRIPE_PRODUCT_BASE_MONTHLY,
  'base-yearly': process.env.STRIPE_PRODUCT_BASE_YEARLY,
  'pro-monthly': process.env.STRIPE_PRODUCT_PRO_MONTHLY,
  'pro-yearly': process.env.STRIPE_PRODUCT_PRO_YEARLY,
};

@Injectable()
export class PaymentsService {
  constructor(private readonly req: ContextProvider) {}

  async webhooks(req) {
    const body = req.rawBody;
    const stripe = new Stripe(process.env.STRIPE_API_KEY);
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.log(err);

      throw new HttpException(`Webhook Error: ${(err as any).message}`, 400);
    }

    const paymentIntent = event.data.object;
    let customerId;
    let userId;
    let subscriptionExpirationDate;

    let productId;
    let subscription;

    if (event.type === 'checkout.session.completed') {
      subscription = await stripe.subscriptions.retrieve(
        paymentIntent.subscription,
      );

      customerId = paymentIntent.customer;
      userId = paymentIntent.metadata.userId;
      productId = subscription.plan.product;
      subscriptionExpirationDate = new Date(
        subscription.current_period_end * 1000,
      );

      try {
        const [church] =
          await sql`update "churches" set "stripeId" = ${customerId}, "plan" = ${productLevels[productId]}, "expirationDate" = ${subscriptionExpirationDate} where "ownerId" = ${userId} returning "id"`;
        if (!church) {
          console.log('No se encontro la iglesia de dueno:' + userId);
          throw new HttpException(null, 500);
        }
      } catch (err) {
        console.log(err);
        throw new HttpException(null, 500);
      }
      return;
    }

    if (event.type === 'customer.subscription.updated') {
      customerId = paymentIntent.customer;
      subscriptionExpirationDate = new Date(
        paymentIntent.current_period_end * 1000,
      );
      productId = paymentIntent.plan.product;

      try {
        await sql`update "churches" set "plan" = ${productLevels[productId]}, "expirationDate" = ${subscriptionExpirationDate} where "stripeId" = ${customerId} `;
        return;
      } catch (err) {
        console.log('No se encontro la iglesia de stripeId:' + customerId);
        throw new HttpException(null, 500);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      customerId = paymentIntent.customer;

      try {
        await sql`update "churches" set "plan" = 0, "expirationDate" = null, "stripeId" = null where "stripeId" = ${customerId} `;
        return;
      } catch (err) {
        console.log('No se encontro la iglesia de stripeId:' + customerId);
        throw new HttpException(null, 500);
      }
    }

    console.log(`Unhandled event type ${event.type}`);
    return;
  }

  async checkout(body: z.infer<typeof CheckoutSchema>, headers: any) {
    const stripe = new Stripe(process.env.STRIPE_API_KEY);

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      allow_promotion_codes: true,
      metadata: {
        userId: this.req.getUserId(),
      },
      customer_email: body.email,
      payment_method_types: ['card'],
      locale: 'es',
      line_items: [
        {
          price: products[body.product],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      return_url: headers.origin,
    });

    return res(200, { clientSecret: session.client_secret });
  }

  async portal(headers: any) {
    const stripe = new Stripe(process.env.STRIPE_API_KEY);

    const [{ stripeId }] =
      await sql`select "stripeId" from "churches" where "ownerId" = ${this.req.getUserId()}`;
    if (!stripeId) {
      return res(400, { message: 'No tienes una suscripción' });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: stripeId,
      return_url: headers.origin,
      locale: 'es',
    });

    return res(200, { id: portalSession.id, url: portalSession.url });
  }
}
