import { z } from "@yas/validate";
import { t } from "../../definition/trpc";
import { dashboardSchema } from "./types";
import { createRandomUsers, createSeededRandom } from "./fixtures";

export function createDashboardProcedure() {
  return t.procedure
    .input(z.date())
    .output(dashboardSchema)
    .query(({ input }) => {
      const rand = createSeededRandom(input.toISOString());
      return {
        totalRevenue: rand() * 45231.89,
        revenueDeltaSinceLastMonth: rand() * 180.1,
        subscriptions: rand() * 2350,
        subscriptionDeltaSinceLastMonth: rand() * 19,
        sales: rand() * 12234,
        salesDeltaSinceLastMonth: rand() * 20.1,
        activeNow: rand() * 123,
        activeSinceLastHour: rand() * 201,
        yourSalesThisMonth: rand() * 265,
        revenueOverTime: [
          { name: "Jan", value: rand() * 3000 },
          { name: "Feb", value: rand() * 4500 },
          { name: "Mar", value: rand() * 2900 },
          { name: "Apr", value: rand() * 4000 },
          { name: "May", value: rand() * 5000 },
          { name: "Jun", value: rand() * 5200 },
          { name: "Jul", value: rand() * 1400 },
          { name: "Aug", value: rand() * 1300 },
          { name: "Sep", value: rand() * 4100 },
          { name: "Oct", value: rand() * 1350 },
          { name: "Nov", value: rand() * 5600 },
          { name: "Dec", value: rand() * 1337 },
        ],
        recentSales: createRandomUsers(rand),
      };
    });
}
