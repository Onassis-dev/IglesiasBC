import { format } from 'date-fns';
import sql from './db';
import { es } from 'date-fns/locale';

export const parseTitle = (title, isColumn?) =>
  isColumn
    ? sql`REPLACE(REPLACE(UPPER(${sql(title)}),' ',''),'-','')`
    : sql`REPLACE(REPLACE(UPPER(${title}),' ',''),'-','')`;

export const formatMonths = (array: any[], keys: string[]) => {
  let newArray = [];

  array = array.map((v) => {
    const date = new Date(v.month);
    date.setDate(date.getDate() + 3);
    return { ...v, month: date };
  });

  for (let i = 0; i < 4; i++) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const foundIndex = array.findIndex(
      (v) => v.month.getMonth() === date.getMonth(),
    );

    if (foundIndex === -1) {
      const newObj = { month: date };
      keys.forEach((key) => {
        newObj[key] = 0;
      });

      newArray.push(newObj);
    } else {
      newArray.push(array[foundIndex]);
    }
  }

  newArray = newArray.map((v) => {
    const date = new Date(v.month);
    const monthName = format(date, 'MMMM', { locale: es });
    return { ...v, month: monthName };
  });

  return newArray.reverse();
};
