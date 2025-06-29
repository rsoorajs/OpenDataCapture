import { expectTypeOf } from 'expect-type';
import { z as z3 } from 'zod/v3';
import { z as z4 } from 'zod/v4';

import { defineInstrument } from '../define.js';

import type { DiscriminatedInstrument } from '../define.js';
import type { FormInstrument } from '../types/instrument.form.js';
import type { InteractiveInstrument } from '../types/instrument.interactive.js';

expectTypeOf<DiscriminatedInstrument<'FORM', 'en', { foo: string }>>().toMatchTypeOf<
  FormInstrument<{ foo: string }, 'en'>
>();
expectTypeOf<DiscriminatedInstrument<'FORM', 'en' | 'fr', { foo: string }>>().toMatchTypeOf<
  FormInstrument<{ foo: string }, 'en' | 'fr'>
>();
expectTypeOf<DiscriminatedInstrument<'FORM', 'en' | 'fr', InteractiveInstrument.Data>>().toBeNever();

expectTypeOf<DiscriminatedInstrument<'INTERACTIVE', 'en', { foo: string }>>().toMatchTypeOf<
  InteractiveInstrument<{ foo: string }, 'en'>
>();
expectTypeOf<DiscriminatedInstrument<'INTERACTIVE', 'en', undefined>>().toBeNever();

const happinessQuestionnaire = {
  clientDetails: {
    estimatedDuration: 1,
    instructions: ['Please answer the questions based on your current feelings.']
  },
  content: {
    overallHappiness: {
      kind: 'number',
      label: 'Overall Happiness',
      variant: 'input'
    } as const
  },
  details: {
    description: 'The Happiness Questionnaire is a questionnaire about happiness.',
    license: 'Apache-2.0' as const,
    title: 'Happiness Questionnaire'
  },
  internal: {
    edition: 1,
    name: 'HAPPINESS_QUESTIONNAIRE'
  },
  kind: 'FORM' as const,
  language: 'en' as const,
  measures: {},
  tags: ['Well-Being']
};

expectTypeOf(
  defineInstrument({
    ...happinessQuestionnaire,
    validationSchema: z4.object({
      overallHappiness: z4.number()
    })
  })
).toMatchTypeOf<FormInstrument<{ overallHappiness: number }, 'en'>>();

expectTypeOf(
  defineInstrument({
    ...happinessQuestionnaire,
    validationSchema: z3.object({
      overallHappiness: z3.number()
    })
  })
).toMatchTypeOf<FormInstrument<{ overallHappiness: number }, 'en'>>();

expectTypeOf(
  defineInstrument({
    clientDetails: {
      estimatedDuration: 1,
      instructions: ['Please answer the questions based on your current feelings.']
    },
    content: {
      overallHappiness: {
        kind: 'number',
        label: 'Overall Happiness',
        variant: 'input'
      }
    },
    details: {
      description: 'The Happiness Questionnaire is a questionnaire about happiness.',
      license: 'Apache-2.0',
      title: 'Happiness Questionnaire'
    },
    internal: {
      edition: 1,
      name: 'HAPPINESS_QUESTIONNAIRE'
    },
    kind: 'FORM',
    language: 'fr',
    measures: {},
    tags: ['Well-Being'],
    validationSchema: z4.object({
      overallHappiness: z4.number()
    })
  })
).toMatchTypeOf<FormInstrument<{ overallHappiness: number }, 'fr'>>();

expectTypeOf(
  defineInstrument({
    clientDetails: {
      estimatedDuration: 1,
      instructions: {
        en: ['Please answer the questions based on your current feelings.'],
        fr: ['Veuillez répondre àux questions en fonction de vos sentiments actuels.']
      }
    },
    content: {
      overallHappiness: {
        kind: 'number',
        label: {
          en: 'Overall Happiness',
          fr: 'Bonheur général'
        },
        variant: 'input'
      }
    },
    details: {
      description: {
        en: 'The Happiness Questionnaire is a questionnaire about happiness.',
        fr: 'Le questionnaire sur le bonheur est un questionnaire sur le bonheur.'
      },

      license: 'Apache-2.0',
      title: {
        en: 'Happiness Questionnaire',
        fr: 'Questionnaire sur le bonheur'
      }
    },
    internal: {
      edition: 1,
      name: 'HAPPINESS_QUESTIONNAIRE'
    },
    kind: 'FORM',
    language: ['en', 'fr'],
    measures: {},
    tags: {
      en: ['Well-Being'],
      fr: ['Bien-être']
    },
    validationSchema: z4.object({
      overallHappiness: z4.number()
    })
  })
).toMatchTypeOf<FormInstrument<{ overallHappiness: number }, ('en' | 'fr')[]>>();

expectTypeOf(
  defineInstrument({
    clientDetails: {
      estimatedDuration: 1,
      instructions: ['<PLACEHOLDER>']
    },
    content: {
      render(done) {
        const button = document.createElement('button');
        button.textContent = 'Submit Instrument';
        document.body.appendChild(button);
        button.addEventListener('click', () => {
          done({ message: 'Hello World' });
        });
      }
    },
    details: {
      description: '<PLACEHOLDER>',
      license: 'Apache-2.0',
      title: '<PLACEHOLDER>'
    },
    internal: {
      edition: 1,
      name: '<PLACEHOLDER>'
    },
    kind: 'INTERACTIVE',
    language: 'en',
    measures: {},
    tags: ['<PLACEHOLDER>'],
    validationSchema: z4.object({
      message: z4.string()
    })
  })
).toMatchTypeOf<InteractiveInstrument<{ message: string }, 'en'>>();
