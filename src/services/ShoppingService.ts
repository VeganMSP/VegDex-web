"use server";
import {db} from "@/lib/kysely";
import {seedFarmersMarkets, seedVeganCompanies} from "@/lib/seed";
import {IVeganCompany} from "@/models/IVeganCompany";
import {IFarmersMarket} from "@/models/IFarmersMarket";

const getFarmersMarkets = async () => {
  let farmersMarkets;
  let startTime = Date.now();
  try {
    farmersMarkets = await db
      .selectFrom("farmersMarkets")
      .selectAll()
      .execute();
  } catch (e: any) {
    if (e.message === `relation "farmersMarkets" does not exist`) {
      console.log("Creating farmersMarkets table...");
      await seedFarmersMarkets();
      startTime = Date.now();
      farmersMarkets = await db
        .selectFrom("farmersMarkets")
        .selectAll()
        .execute();
    } else {
      throw e;
    }
  }
  const duration = Date.now() - startTime;
  console.log(`Query took ${duration}ms`);
  return farmersMarkets as IFarmersMarket[];
};
const getVeganCompanies = async () => {
  let veganCompanies;
  let startTime = Date.now();
  try {
    veganCompanies = await db
      .selectFrom("veganCompanies")
      .selectAll()
      .execute();
  } catch (e: any) {
    if (e.message === `relation "veganCompanies" does not exist`) {
      console.log("Creating veganCompanies table...");
      await seedVeganCompanies();
      startTime = Date.now();
      veganCompanies = await db
        .selectFrom("veganCompanies")
        .selectAll()
        .execute();
    } else {
      throw e;
    }
  }
  const duration = Date.now() - startTime;
  console.log(`Query took ${duration}ms`);
  return veganCompanies as IVeganCompany[];
};
export const getShoppingData = async (): Promise<{veganCompanies: IVeganCompany[], farmersMarkets: IFarmersMarket[]}> => {
  let farmersMarkets = await getFarmersMarkets();
  let veganCompanies = await getVeganCompanies();
  return {farmersMarkets, veganCompanies};
};
