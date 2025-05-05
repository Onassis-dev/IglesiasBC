import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import sql from 'src/utils/db';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { ChurchSchema } from '@iglesiasbc/schemas';
import { getUserData } from 'src/utils/getUserData';
import { res, error } from 'src/utils/response';

const defaultSongs = [
  {
    background: '#000000',
    slides: [
      'Sublime gracia del Señor\nQue a un infeliz salvó\nFui ciego mas hoy veo yo\nPerdido y Él me halló',
      'Su gracia me enseñó a temer\nMis dudas ahuyentó\nOh, cuán precioso fue a mi ser\nCuando él me transformó',
      'Ya libre soy, Dios me salvó\nY mis cadenas ya Él rompió\nY como un río fluye el perdón\nSublime gracia, inmenso amor',
      'En los peligros o aflicción\nQue yo he tenido aquí\nSu gracia siempre me libró\nY me guiará feliz',
      'Ya libre soy, Dios me salvó\nY mis cadenas ya Él rompió\nY como un río fluye el perdón\nSublime gracia, inmenso amor',
      'Ya libre soy, Dios me salvó\nY mis cadenas ya Él rompió\nY como un río fluye el perdón\nSublime gracia, inmenso amor',
      'Y cuando en Sión por siglos mil\nBrillando esté cuál sol\nY aún cantaré por siempre allí\nSu amor que me salvó\nSu amor que me salvó\nSu amor que me salvó',
      'Ya libre soy, Dios me salvó (ya Dios me salvó)\nY mis cadenas ya Él rompió (rompió)\nY como un río fluye el perdón (el perdón)\nSublime gracia, inmenso amor (inmenso amor)\nSublime gracia, inmenso amor',
      'Fue por amor, su gran amor\nSu gracia me salvó\nFue por amor, su gran amor\nSu gracia me salvó\nLo hizo por amor',
    ],
    text: '#FFFFFF',
    title: 'Sublime Gracia',
  },
  {
    background: '#000000',
    slides: [
      'Si tuvieras fe, si tuvieras fe\nComo un granito de mostaza\nEso dice el Señor',
      'Si tuvieras fe, si tuvieras fe\nComo un granito de mostaza\nEso dice el Señor',
      'Tú le dirías a las montañas\nMuévanse, muévanse, muévanse\nTú le dirías a las montañas\nMuévanse, muévanse, muévanse',
      'Y las montañas se moverán\nSe moverán, se moverán\nY las montañas se moverán\nSe moverán, se moverán',
      'Si tuvieras fe, si tuvieras fe\nComo un granito de mostaza\nEso dice el Señor',
      'Si tuvieras fe, si tuvieras fe\nComo un granito de mostaza\nEso dice el Señor',
      'Tú le dirías a los enfermos\nSánense, sánense, sánense\nTú le dirías a los enfermos\nSánense, sánense, sánense',
      'Y los enfermos se sanarán\nSe sanarán, se sanarán\nY los enfermos se sanarán\nSe sanarán, se sanarán',
    ],
    text: '#FFFFFF',
    title: 'Granito de mostaza',
  },
];

@Injectable()
export class ChurchesService {
  constructor(private readonly req: ContextProvider) {}

  async getChurch() {
    const [church] =
      await sql`select churches.plan, churches."expirationDate", churches.name from
      churches
      where churches.id = ${this.req.getChurchId()}`;

    return res(200, church);
  }

  async createChurch(body: z.infer<typeof ChurchSchema>) {
    const [church] =
      await sql`select 1 from churches where "ownerId" = ${this.req.getUserId()}`;

    if (church) {
      return error('Ya tienes registrada una iglesia', 400);
    }

    await sql.begin(async (sql) => {
      const [{ id }] =
        await sql`insert into "churches" (name, "ownerId") values (${body.name}, ${this.req.getUserId()}) returning id`;

      await sql`update permissions set selected = false where "userId" = ${this.req.getUserId()}`;

      await sql`insert into permissions ("churchId", "userId", selected, perm_website, perm_inventory, perm_finances, perm_members, perm_classes, perm_blog, perm_certificates, perm_presentations)
       values (${id}, ${this.req.getUserId()}, true, true,true,true,true, true, true, true, true)`;

      await sql`insert into presentations ${sql(
        defaultSongs.map((song) => ({
          ...song,
          churchId: id,
        })),
      )}`;
    });

    const data = await getUserData(this.req.getUserId());
    return res(200, data);
  }

  async editChurch(body: z.infer<typeof ChurchSchema>) {
    await sql`update "churches" set ${sql(body)} where id = ${this.req.getChurchId()} returning 1`;
    return res(200, null);
  }
}
