/**
 * Library of assorted shared functions
 */

import { createHash } from 'node:crypto';
const fs = require('node:fs');
  
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


/**
 * Calculates the relative location of a file that served by the static file server to the api
 * This is used for placing uploaded files to the api in a accessible location to the static
 * file server running in a docker container and implemented with BusyBox httpd
 * todo: the relative path probably needs to be defined in an envvar
 * @param filePath 
 * @returns 
 */
export const getFileLocalPath = (filePath: string): string => {
    return `../data/uploads/${filePath}`
}

/**
 * Extract needed paths and url from filename and userFolder
 * These values will be used to store the uploaded/seeded image file for a given user 
 * @param filename 
 * @param userFolder 
 * @returns 
 */
export const getUploadFileData = (
    filename: string, 
    userFolder: string
): object => {
    const filePath = `${userFolder}/${filename}`
    const storePath = getFileLocalPath(filePath)
    const url = `${process.env.FILESERVER_URL}/${filePath}`

    return {filePath, storePath, url}
}

export const createUserFolderIfNeeded = (userFolder: string) => {
    const userLocalPath = getFileLocalPath(userFolder)
    if (!fs.existsSync(userLocalPath)){
        fs.mkdirSync(userLocalPath);
    }
}