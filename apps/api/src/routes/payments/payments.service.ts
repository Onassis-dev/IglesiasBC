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
    let userEmail;
    let userId;
    let subscriptionExpirationDate;
    let productId;
    let subscription;

    let completed = false;

    if (event.type === 'checkout.session.completed') {
      subscription = await stripe.subscriptions.retrieve(
        paymentIntent.subscription,
      );

      customerId = paymentIntent.customer;
      userId = paymentIntent.metadata.userId;
      productId = subscription.plan.product;
      userEmail = paymentIntent.customer_email;
      subscriptionExpirationDate = new Date(
        subscription.current_period_end * 1000,
      );

      try {
        const [userExists] =
          await sql`select 1 from "users" where "id" = ${userId} OR "email" = ${userEmail}`;
        if (!userExists) {
          console.log('No se encontro el usuario');
          throw new HttpException(null, 500);
        }
        await sql`update "users" set "stripeId" = ${customerId}, "plan" = ${productLevels[productId]}, "expirationDate" = ${subscriptionExpirationDate} where "id" = ${userId}`;
      } catch (err) {
        console.log(err);
        throw new HttpException(null, 500);
      }
      completed = true;
    }

    if (event.type === 'customer.subscription.updated') {
      customerId = paymentIntent.customer;
      subscriptionExpirationDate = new Date(
        paymentIntent.current_period_end * 1000,
      );
      productId = paymentIntent.plan.product;

      try {
        await sql`update "users" set "plan" = ${productLevels[productId]}, "expirationDate" = ${subscriptionExpirationDate} where "stripeId" = ${customerId} `;
        completed = true;
      } catch (err) {
        console.log('No se encontro el usuario');
        throw new HttpException(null, 500);
      }
    }

    if (event.type === 'customer.subscription.deleted') {
      customerId = paymentIntent.customer;

      try {
        await sql`update "users" set "plan" = 0, "expirationDate" = null, "stripeId" = null where "stripeId" = ${customerId} `;
        completed = true;
      } catch (err) {
        console.log('No se encontro el usuario');
        throw new HttpException(null, 500);
      }
    }

    if (!completed) console.log(`Unhandled event type ${event.type}`);
    return;
  }

  async checkout(body: z.infer<typeof CheckoutSchema>, headers: any) {
    const stripe = new Stripe(process.env.STRIPE_API_KEY);

    const [{ email }] =
      await sql`select email from "users" where id = ${this.req.getUserId()}`;
    if (!email) {
      return res(400, { message: 'No tienes una cuenta' });
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      metadata: {
        userId: this.req.getUserId(),
      },
      customer_email: email,
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
      await sql`select "stripeId" from "users" where id = ${this.req.getUserId()}`;
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
