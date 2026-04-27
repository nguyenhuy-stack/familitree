import { createServerFn } from '@tanstack/react-start'
import { prisma } from '../lib/db'

export const getMembers = createServerFn({ method: 'GET' }).handler(async () => {
  return await prisma.member.findMany({
    orderBy: { createdAt: 'asc' },
  })
})

export const addMember = createServerFn({ method: 'POST' })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    const newMember = await prisma.member.create({
      data: {
        name: data.name,
        role: data.role,
        gender: data.gender,
        birthDate: data.birthDate,
        avatar: data.avatar,
        parentId: data.parentId,
        spouseId: data.spouseId,
      },
    })

    // If adding a spouse, update the partner's spouseId to point back
    if (data.spouseId) {
      await prisma.member.update({
        where: { id: data.spouseId },
        data: { spouseId: newMember.id },
      })
    }

    return newMember
  })

export const updateMember = createServerFn({ method: 'POST' })
  .inputValidator((data: any) => data)
  .handler(async ({ data }) => {
    return await prisma.member.update({
      where: { id: data.id },
      data: {
        name: data.name,
        role: data.role,
        gender: data.gender,
        birthDate: data.birthDate,
        avatar: data.avatar,
      },
    })
  })

export const deleteMember = createServerFn({ method: 'POST' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return await prisma.member.delete({
      where: { id },
    })
  })
