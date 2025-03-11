import { formatMonths } from 'src/utils/commonUtils';
import { HttpException, Injectable } from '@nestjs/common';
import sql from 'src/utils/db';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { getUserData } from 'src/utils/getUserData';

@Injectable()
export class DashboardService {
  constructor(private readonly req: ContextProvider) {}

  async getOwner() {
    const churchId = this.req.getChurchId();
    const { ownerId } = (
      await sql`SELECT "ownerId" from churches where id = ${churchId}`
    )[0];

    if (ownerId !== this.req.getUserId()) throw new HttpException('', 403);

    const userData = await getUserData(this.req.getUserId());

    const stats = (
      await sql`
      SELECT 
        SUM(CASE WHEN financescategories."isIncome" = true THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN financescategories."isIncome" = false THEN amount ELSE 0 END) as expense,
        (SELECT count(*) from members  WHERE "churchId" = ${this.req.getChurchId()} and "positionId" not in (2, 7)) as members,
        (SELECT count(*) FROM certificates WHERE "churchId" = ${churchId}) as certificates,
        (SELECT count(*) FROM subjects 
          JOIN classes ON subjects."classId" = classes.id
          WHERE classes."churchId" = ${churchId}) as students,
        (SELECT SUM(price * amount) FROM inventory WHERE "churchId" = ${churchId}) as inventory,
        (SELECT count(*) FROM postviews
          JOIN posts ON posts.id = postviews."postId"
          WHERE posts."churchId" = ${churchId}) as blog,
        (SELECT count(*) FROM websiteviews
          JOIN websites ON websites.id = websiteviews."websiteId"
          WHERE websites."churchId" = ${churchId}) as website
      FROM transactions
      JOIN financescategories ON financescategories.id = transactions."categoryId"
      JOIN treasuries ON treasuries.id = transactions."treasuryId"
      WHERE treasuries."churchId" = ${churchId}`
    )[0];

    stats.balance = stats.income - stats.expense;

    const lastMembers =
      await sql`SELECT name, (SELECT name from positions where id = "positionId") as position from members where "churchId" = ${churchId} order by id desc limit 6`;

    const lastCertificates =
      await sql`SELECT "memberName" as name, (SELECT name from certificatetypes where id = "certificateTypeId") as type from certificates where "churchId" = ${churchId} order by id desc limit 6`;

    const lastSubjects =
      await sql`SELECT "title" from subjects where (SELECT "churchId" from classes where id = "classId") = ${churchId} order by id desc limit 6`;

    const lastMovements =
      await sql`SELECT "concept", date, amount, (SELECT "isIncome" from financescategories where id = "categoryId") from transactions where (SELECT "churchId" from treasuries where id = "treasuryId") = ${churchId} order by id desc limit 8`;

    const lastMaterials =
      await sql`SELECT "name", amount, price from inventory where "churchId" = ${churchId} order by id desc limit 8`;

    const members = await sql`
      SELECT 
        date_trunc('month', created) AS month, 
        COUNT(*) as "Registros"
      FROM 
        members 
      WHERE 
        "churchId" = ${churchId} 
        AND created >= date_trunc('month', current_date) - interval '4 months'
      GROUP BY 
        month
      ORDER BY 
        month;
    `;

    const movements = await sql`
    SELECT 
      month, 
      SUM(CASE WHEN "isIncome" THEN amount ELSE 0 END) AS "Ingresos",
      SUM(CASE WHEN NOT "isIncome" THEN amount ELSE 0 END) AS "Egresos"
    FROM (
      SELECT 
        date_trunc('month', t.date) AS month,
        t.amount,
        fc."isIncome"
      FROM 
        transactions t
      INNER JOIN 
        treasuries tr ON tr.id = t."treasuryId"
      INNER JOIN 
        financescategories fc ON fc.id = t."categoryId"
      WHERE 
        tr."churchId" = ${churchId}
        AND t.date >= date_trunc('month', current_date) - interval '4 months'
    ) AS subquery
    GROUP BY 
      month
    ORDER BY 
      month;`;

    return {
      stats,
      lastMembers,
      lastCertificates,
      lastSubjects,
      lastMovements,
      lastMaterials,
      members: formatMonths(members, ['Registros']),
      movements: formatMonths(movements, ['Egresos', 'Ingresos']),
      userData,
    };
  }

  async getUser() {
    const churchId = this.req.getChurchId();

    const userData = await getUserData(this.req.getUserId());

    const stats = (
      await sql`
      SELECT 
      ${userData.perm_members ? sql`(SELECT count(*) from members  WHERE "churchId" = ${this.req.getChurchId()} and "positionId" not in (2, 7)) as members,` : sql``}
      ${userData.perm_certificates ? sql`(SELECT count(*) FROM certificates WHERE "churchId" = ${churchId}) as certificates,` : sql``}
      ${userData.perm_finances ? sql`COALESCE(SUM(CASE WHEN financescategories."isIncome" = true THEN amount ELSE 0 END), 0) as income,` : sql``}
      ${userData.perm_finances ? sql`COALESCE(SUM(CASE WHEN financescategories."isIncome" = false THEN amount ELSE 0 END), 0) as expense,` : sql``}
      ${userData.perm_inventory ? sql`COALESCE((SELECT SUM(price * amount) FROM inventory WHERE "churchId" = ${churchId}), 0) as inventory,` : sql``}

      ${
        userData.perm_classes
          ? sql` (SELECT count(*) FROM subjects 
          JOIN classes ON subjects."classId" = classes.id
          WHERE classes."churchId" = ${churchId}) as students,`
          : sql``
      }
      ${
        userData.perm_blog
          ? sql`(SELECT count(*) FROM postviews
          JOIN posts ON posts.id = postviews."postId"
          WHERE posts."churchId" = ${churchId}) as blog,`
          : sql``
      }
          ${
            userData.perm_website
              ? sql`(SELECT count(*) FROM websiteviews
            JOIN websites ON websites.id = websiteviews."websiteId"
            WHERE websites."churchId" = ${churchId}) as website`
              : sql``
          }

      FROM transactions
      JOIN financescategories ON financescategories.id = transactions."categoryId"
      JOIN treasuries ON treasuries.id = transactions."treasuryId"
      WHERE treasuries."churchId" = ${churchId}`
    )[0];

    if (stats.income) {
      stats.balance = (stats.income - stats.expense).toString();
    }

    return { stats, userData };
  }
}
