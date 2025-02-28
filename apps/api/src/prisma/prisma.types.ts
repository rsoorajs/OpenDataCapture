import { Prisma } from '@prisma/generated-client';
import type { Replace } from 'type-fest';

import type { ExtendedPrismaClient } from './prisma.factory';

export type ModelReferenceName = Uncapitalize<Prisma.ModelName>;

export type ModelName<T extends ModelEntityName> = Prisma.ModelName & `${T}Model`;

export type ModelEntityName = Replace<Prisma.ModelName, 'Model', ''>;

export type Model<T extends ModelEntityName> = ExtendedPrismaClient[`${Uncapitalize<T>}Model`];

export type ModelUpdateData<T extends ModelEntityName> = Parameters<Model<T>['update']>[0]['data'];
