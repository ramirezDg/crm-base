import z from 'zod';

// dashboardTypes
export type DashboardType = {};


export const schemaDashboard = z.object({
  id: z.number(),
  header: z.string(),
  type: z.string(),
  status: z.string(),
  target: z.string(),
  limit: z.string(),
  reviewer: z.string(),
})
