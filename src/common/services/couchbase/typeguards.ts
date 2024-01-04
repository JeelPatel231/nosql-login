
import { DocumentNotFoundError, KeyValueErrorContext } from 'couchbase';

export function isDocumentNotFoundError(error: unknown): error is DocumentNotFoundError {
  return (error as any)?.cause?.code == 101
}


export function isDocumentExistsError(error: unknown): error is DocumentNotFoundError {
  return (error as any)?.cause?.code == 105
}