import prisma from "../config/prisma.service";

export const getAll = async () => {
    return prisma.medication.findMany();
};