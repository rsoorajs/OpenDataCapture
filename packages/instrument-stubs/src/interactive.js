/* eslint-disable perfectionist/sort-objects */

import { createInstrumentStub } from './utils.js';

/** @type {import('./utils.js').InstrumentStub<import('./utils.js').InteractiveInstrument<{ message: string }>>} */
export const interactiveInstrument = await createInstrumentStub(async () => {
  const { z } = await import('zod');
  return {
    kind: 'INTERACTIVE',
    language: 'en',
    name: 'interactive-instrument',
    tags: ['Example', 'Useless'],
    version: 1.0,
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
      description: 'This is an interactive instrument',
      estimatedDuration: 1,
      instructions: [],
      license: 'UNLICENSED',
      title: 'Interactive Instrument'
    },
    validationSchema: z.object({
      message: z.string()
    })
  };
});