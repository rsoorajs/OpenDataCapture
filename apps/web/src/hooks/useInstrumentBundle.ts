import { $InstrumentBundleContainer } from '@opendatacapture/schemas/instrument';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export function useInstrumentBundle(id: null | string) {
  return useQuery({
    enabled: Boolean(id),
    queryFn: async () => {
      const response = await axios.get(`/v1/instruments/bundle/${id}`);
      return $InstrumentBundleContainer.parseAsync(response.data);
    },
    queryKey: ['instrument-bundle', id]
  });
}
