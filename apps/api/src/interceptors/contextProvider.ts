import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class ContextProvider {
  constructor(@Inject(REQUEST) private readonly req) {}

  getChurchId() {
    return this.req.churchId;
  }

  getPlan() {
    return this.req.plan;
  }

  getUserId() {
    return this.req.userId;
  }
}
