import { formatMonths } from 'src/utils/commonUtils';
import { Injectable } from '@nestjs/common';
import sql from 'src/utils/db';
import { ContextProvider } from 'src/interceptors/contextProvider';
import { getUserData } from 'src/utils/getUserData';
import { res } from 'src/utils/response';

@Injectable()
export class DashboardService {
  constructor(private readonly req: ContextProvider) {}

  async getOwner() {
    const churchId = this.req.getChurchId();
    const { ownerId } = (
      await sql`SELECT "ownerId" from churches where id = ${churchId}`
    )[0];

    if (ownerId !== this.req.getUserId()) {
      return res(403, {
        message: 'No tienes permiso para ver esta información',
      });
    }

    const stats = (
      await sql`
      SELECT 
        SUM(CASE WHEN financescategories."isIncome" = true THEN amount ELSE 0 END) as income,
        SUM(CASE WHEN financescategories."isIncome" = false THEN amount ELSE 0 END) as expense,
        (SELECT count(*) from members  WHERE "churchId" = ${this.req.getChurchId()} and "positionId" not in (2, 7)) as members,
        (SELECT count(*) FROM certificates WHERE "churchId" = ${churchId}) as certificates,
        (SELECT count(*) FROM presentations WHERE "churchId" = ${churchId}) as presentations,
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

    stats.balance = (stats.income - stats.expense).toString();

    const lastMembers =
      await sql`SELECT name, (SELECT name from positions where id = "positionId") as position from members where "churchId" = ${churchId} order by id desc limit 6`;

    const lastCertificates =
      await sql`SELECT "member" as name, (SELECT name from certificatetypes where id = "certificateTypeId") as type from certificates where "churchId" = ${churchId} order by id desc limit 6`;

    const lastSubjects =
      await sql`SELECT "title" from subjects where (SELECT "churchId" from classes where id = "classId") = ${churchId} order by id desc limit 6`;

    const lastMovements =
      await sql`SELECT "concept", date, amount, (SELECT "isIncome" from financescategories where id = "categoryId") as "isIncome" from transactions where (SELECT "churchId" from treasuries where id = "treasuryId") = ${churchId} order by id desc limit 8`;

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

    return res(200, {
      stats,
      lastMembers,
      lastCertificates,
      lastSubjects,
      lastMovements,
      lastMaterials,
      members: formatMonths(members, ['Registros']),
      movements: formatMonths(movements, ['Egresos', 'Ingresos']),
    });
  }

  async getUser() {
    const churchId = this.req.getChurchId();
    const userData = await getUserData(this.req.getUserId());

    // Create an array to hold all the fields we want to select
    const selectFields = [];

    if (userData.perm_members) {
      selectFields.push(
        sql`(SELECT count(*) from members WHERE "churchId" = ${churchId} and "positionId" not in (2, 7)) as members`,
      );
    }

    if (userData.perm_certificates) {
      selectFields.push(
        sql`(SELECT count(*) FROM certificates WHERE "churchId" = ${churchId}) as certificates`,
      );
    }

    if (userData.perm_presentations) {
      selectFields.push(
        sql`(SELECT count(*) FROM presentations WHERE "churchId" = ${churchId}) as presentations`,
      );
    }

    if (userData.perm_finances) {
      selectFields.push(sql`COALESCE((
        SELECT SUM(CASE WHEN fc."isIncome" = true THEN t.amount ELSE 0 END)
        FROM transactions t
        JOIN financescategories fc ON fc.id = t."categoryId"
        JOIN treasuries tr ON tr.id = t."treasuryId"
        WHERE tr."churchId" = ${churchId}
      ), 0) as income`);

      selectFields.push(sql`COALESCE((
        SELECT SUM(CASE WHEN fc."isIncome" = false THEN t.amount ELSE 0 END)
        FROM transactions t
        JOIN financescategories fc ON fc.id = t."categoryId"
        JOIN treasuries tr ON tr.id = t."treasuryId"
        WHERE tr."churchId" = ${churchId}
      ), 0) as expense`);
    }

    if (userData.perm_inventory) {
      selectFields.push(
        sql`COALESCE((SELECT SUM(price * amount) FROM inventory WHERE "churchId" = ${churchId}), 0) as inventory`,
      );
    }

    if (userData.perm_classes) {
      selectFields.push(sql`(
        SELECT count(*) FROM subjects 
        JOIN classes ON subjects."classId" = classes.id
        WHERE classes."churchId" = ${churchId}
      ) as students`);
    }

    if (userData.perm_blog) {
      selectFields.push(sql`(
        SELECT count(*) FROM postviews
        JOIN posts ON posts.id = postviews."postId"
        WHERE posts."churchId" = ${churchId}
      ) as blog`);
    }

    if (userData.perm_website) {
      selectFields.push(sql`(
        SELECT count(*) FROM websiteviews
        JOIN websites ON websites.id = websiteviews."websiteId"
        WHERE websites."churchId" = ${churchId}
      ) as website`);
    }

    // If no permissions, return an empty object
    if (selectFields.length === 0) {
      return res(200, { stats: {}, userData });
    }

    // Join all fields with commas
    const selectQuery = selectFields.reduce(
      (acc, field, index) => {
        if (index === 0) return field;
        return sql`${acc}, ${field}`;
      },
      sql``,
    );

    // Build the final query using a dummy table to ensure we always get a result
    const stats =
      (await sql`SELECT ${selectQuery} FROM (SELECT 1) as dummy`)[0] || {};

    if (stats.income && stats.expense) {
      stats.balance = (stats.income - stats.expense).toString();
    }

    return res(200, { stats });
  }
}
