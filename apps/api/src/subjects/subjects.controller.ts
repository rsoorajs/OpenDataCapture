import { $BooleanLike } from '@douglasneuroinformatics/libjs';
import { CurrentUser, ParseSchemaPipe, RouteAccess } from '@douglasneuroinformatics/libnest';
import type { AppAbility } from '@douglasneuroinformatics/libnest';
import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import z from 'zod/v4';

import { CreateSubjectDto } from './dto/create-subject.dto';
import { SubjectsService } from './subjects.service';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @ApiOperation({ summary: 'Create Subject' })
  @Post()
  @RouteAccess({ action: 'create', subject: 'Subject' })
  create(@Body() subject: CreateSubjectDto) {
    return this.subjectsService.create(subject);
  }

  @ApiOperation({ summary: 'Delete Subject' })
  @Delete(':id')
  @RouteAccess({ action: 'delete', subject: 'Subject' })
  deleteById(
    @Param('id', new ParseSchemaPipe({ schema: z.string().transform((value) => decodeURIComponent(value)) }))
    id: string,
    @Query('force', new ParseSchemaPipe({ isOptional: true, schema: $BooleanLike })) force: boolean | undefined,
    @CurrentUser('ability') ability: AppAbility
  ) {
    return this.subjectsService.deleteById(id, { ability, force });
  }

  @ApiOperation({ summary: 'Get All Subjects' })
  @Get()
  @RouteAccess({ action: 'read', subject: 'Subject' })
  find(@CurrentUser('ability') ability: AppAbility, @Query('groupId') groupId?: string) {
    return this.subjectsService.find({ groupId }, { ability });
  }

  @ApiOperation({ summary: 'Get Subject' })
  @Get(':id')
  @RouteAccess({ action: 'read', subject: 'Subject' })
  findById(@Param('id') id: string, @CurrentUser('ability') ability: AppAbility) {
    return this.subjectsService.findById(id, { ability });
  }
}
