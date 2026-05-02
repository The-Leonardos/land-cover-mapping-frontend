"use server"

import { prisma } from "@/lib/prisma";

export async function getYears(): Promise<number[]> {
  const years = await prisma.years.findMany();
  return years.map((y) => y.year);
}