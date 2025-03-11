import { Controller, Query, Get } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { ZodPiPe } from 'src/interceptors/validation/validation.pipe';
import { getPostSchema, getWebsiteSchema } from './websites.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Websites')
@Controller('websites')
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  @Get('start')
  getWebsiteStart(@Query(new ZodPiPe(getWebsiteSchema)) query) {
    return this.websitesService.getWebsiteStart(query);
  }

  @Get('services')
  getWebsiteServices(@Query(new ZodPiPe(getWebsiteSchema)) query) {
    return this.websitesService.getWebsiteServices(query);
  }

  @Get('events')
  getWebsiteEvents(@Query(new ZodPiPe(getWebsiteSchema)) query) {
    return this.websitesService.getWebsiteEvents(query);
  }

  @Get('posts')
  getWebsitePosts(@Query(new ZodPiPe(getWebsiteSchema)) query) {
    return this.websitesService.getWebsitePosts(query);
  }

  @Get('post')
  getPost(@Query(new ZodPiPe(getPostSchema)) query) {
    return this.websitesService.getPost(query);
  }
}
