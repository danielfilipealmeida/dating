import { describe, expect, it } from 'vitest'
import { hashString, getUploadFileData, getFileLocalPath } from '../lib'


describe('hashString', () => {
    it('returns the user id hashed to be used as the use folder', () => {
        const userId: number = 10
        const result: string = hashString(userId.toString())

        expect(result).toBe('4a44dc15364204a80fe80e9039455cc1608281820fe2b24f1e5233ade6af1dd5')
    })
})

describe('getFileLocalPath', () => {
    it('returns the relative path from the api to the file in the data folder', () => {
        const result: string = getFileLocalPath('path/to/file.txt')
        expect(result).toBe('../data/uploads/path/to/file.txt')
    })
})

describe('getUploadFileData', () => {
    it('returns file and store path and url', () => {
        const filename: string = "file.txt"
        const userFolder: string = "path/to"
        process.env.FILESERVER_URL = 'localhost:3000'
        const {filePath, storePath , url} = getUploadFileData(filename, userFolder)

        expect(filePath).toBe("path/to/file.txt")
        expect(storePath).toBe("../data/uploads/path/to/file.txt")
        expect(url).toBe('localhost:3000/path/to/file.txt')
    })
})