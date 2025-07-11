import { $AnyFunction } from '@douglasneuroinformatics/libjs';
import type { InteractiveInstrument } from '@opendatacapture/runtime-core';
import { z } from 'zod/v4';

import { $InstrumentDetails, $ScalarInstrument } from './instrument.base.js';

const $InteractiveInstrument = $ScalarInstrument.extend({
  content: z.object({
    __injectHead: z
      .object({
        style: z.string().readonly()
      })
      .optional()
      .readonly(),
    render: $AnyFunction
  }),
  details: $InstrumentDetails,
  kind: z.literal('INTERACTIVE')
}) satisfies z.ZodType<InteractiveInstrument>;

export { $InteractiveInstrument };
