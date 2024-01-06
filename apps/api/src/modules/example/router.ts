import { z } from "@yas/validate";
import { t } from "../../definition/trpc";
import { createDashboardProcedure } from "./dashboard";
import { createUsersProcedure } from "./users";

export function createExampleRouter() {
  return t.router({
    users: createUsersProcedure(),
    dashboard: createDashboardProcedure(),
    hello: t.procedure
      .input(z.string())
      .output(z.object({ message: z.string(), date: z.date() }))
      .query(({ input }) => {
        const message = `${input} world`;
        const date = new Date();
        return { message, date };
      }),
  });
}
