import { Controller } from '@nestjs/common';
import { WebsitesService } from './websites.service';
import { websitesContract } from '@iglesiasbc/schemas';
import { tsRestHandler, TsRestHandler } from '@ts-rest/nest';

@Controller()
export class WebsitesController {
  constructor(private readonly websitesService: WebsitesService) {}

  @TsRestHandler(websitesContract.getWebsiteStart)
  getWebsiteStart() {
    return tsRestHandler(websitesContract.getWebsiteStart, async ({ query }) =>
      this.websitesService.getWebsiteStart(query),
    );
  }

  @TsRestHandler(websitesContract.getWebsiteEvents)
  getWebsiteEvents() {
    return tsRestHandler(websitesContract.getWebsiteEvents, async ({ query }) =>
      this.websitesService.getWebsiteEvents(query),
    );
  }

  @TsRestHandler(websitesContract.getWebsitePosts)
  getWebsitePosts() {
    return tsRestHandler(websitesContract.getWebsitePosts, async ({ query }) =>
      this.websitesService.getWebsitePosts(query),
    );
  }

  @TsRestHandler(websitesContract.getPost)
  getPost() {
    return tsRestHandler(websitesContract.getPost, async ({ query }) =>
      this.websitesService.getPost(query),
    );
  }

  @TsRestHandler(websitesContract.getCertificate)
  getCertificate() {
    return tsRestHandler(websitesContract.getCertificate, async ({ query }) =>
      this.websitesService.getCertificate(query),
    );
  }
}
