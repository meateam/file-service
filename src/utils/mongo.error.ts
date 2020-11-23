import { MongoError } from 'mongodb';

/**
 * Extracts the indexes names and values thrown by the duplicate key error.
 * @param error - the mongo error thrown.
 * @return string with the index names and values.
 */
export function getMongoErrorindexes(error: MongoError): { indexName: string, values: string } {
  // extract the indexes names in the MongoError
  const indicesRegex: RegExp = new RegExp(/index\:\ (?:.*\.)?\$?(?:([_a-z0-9]*)(?:_\d*)|([_a-z0-9]*))\s*dup key/i);
  const indicesMatch: RegExpMatchArray = error.message.match(indicesRegex);
  let indexName: string = indicesMatch[1] || indicesMatch[2];

  // prettify indexes names
  const re: RegExp = new RegExp('_1_', 'g');
  indexName = indexName.replace(re, ', ');

  // extract the indexes values of the error thrown
  const valuesRE: RegExp = new RegExp(/{(.*?)}/);
  const valuesMatch: RegExpMatchArray = error.message.match(valuesRE);
  let values: string = valuesMatch[0];
  values = values.replace(new RegExp(' : ', 'g'), ' ');

  return { indexName, values };
}
