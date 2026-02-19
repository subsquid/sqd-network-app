import { pickBy } from 'lodash-es';
import isEmpty from 'lodash-es/isEmpty';

export interface WorkerMetadata {
  name?: string;
  email?: string;
  description?: string;
  website?: string;
}

export function encodeWorkerMetadata(req: WorkerMetadata) {
  const md = pickBy(
    {
      name: req.name,
      website: req.website,
      description: req.description,
      email: req.email,
    },
    Boolean,
  );

  return !isEmpty(md) ? JSON.stringify(md) : '';
}

function decodeWorkerMetadata(req: string): WorkerMetadata {
  return JSON.parse(req);
}
