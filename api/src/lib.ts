/**
 * Library of assorted shared functions
 */

import { createHash } from 'node:crypto';
  
/**
 * Returns an hashed string.
 * To be used to obfuscated passwords
 * 
 * @param data (string): the input string
 * @returns string: the hashed input string
 */
export const hashString = (data: string): string => {
    const hash = createHash('sha256')
    hash.update(data)

    return hash.digest('hex')
}