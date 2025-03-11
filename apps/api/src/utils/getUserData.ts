import sql from './db';

const requiredPlans = {
  perm_members: 0,
  perm_website: 1,
  perm_blog: 1,
  perm_certificates: 1,
  perm_finances: 2,
  perm_inventory: 2,
  perm_classes: 2,
};

export const getUserData = async (userData: number | string) => {
  const [data] = await sql`SELECT 
    users.username, 
    users.id AS "userId", 
    owner.plan,
    owner."expirationDate",
    permissions.*,
    owner.id as "ownerId"
    FROM 
        permissions
    JOIN 
        users ON users.id = permissions."userId"
    JOIN 
        churches ON churches.id = permissions."churchId"
    JOIN 
        users AS owner ON owner.id = churches."ownerId"

      ${typeof userData === 'number' ? sql`WHERE users.id = ${userData}` : sql`WHERE users.email = ${userData}`}
      AND permissions.selected = true;`;

  if (!data) return;

  data.owner = data.userId === data.ownerId;
  if (new Date() > new Date(data?.expirationDate)) data.plan = 0;

  Object.keys(requiredPlans).forEach((key) => {
    if (requiredPlans[key] > data.plan) data[key] = '0';
  });

  return data;
};
