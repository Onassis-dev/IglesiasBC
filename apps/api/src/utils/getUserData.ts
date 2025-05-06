import sql from './db';

const requiredPlans = {
  perm_members: 0,
  perm_website: 1,
  perm_blog: 1,
  perm_certificates: 1,
  perm_presentations: 0,
  perm_finances: 1,
  perm_inventory: 2,
};

export const getUserData = async (userId: string) => {
  const [data] = await sql`SELECT 
    churches."ownerId",
    churches.plan,
    permissions.*
    FROM 
        permissions
    JOIN 
        churches ON churches.id = permissions."churchId"

      WHERE permissions."userId" = ${userId} AND permissions.selected = true;`;

  if (!data) return;

  data.owner = data.userId === data.ownerId;
  if (new Date() > new Date(data?.expirationDate)) data.plan = 0;

  Object.keys(requiredPlans).forEach((key) => {
    if (requiredPlans[key] > data.plan) data[key] = false;
  });

  return data;
};
