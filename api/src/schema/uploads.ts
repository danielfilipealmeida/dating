// NOTE: import if we want to set the error message in the API
// import { GraphQLError } from 'graphql';
import { builder } from '../builder'
import { getTokenData } from '../jwt';
const fs = require('node:fs');
const { createHash } = require('node:crypto');
  

const ALLOWED_FILETYPES = [
    'image/jpeg'
]

/**
 * Calculates the relative location of a file that served by the static file server to the api
 * This is used for placing uploaded files to the api in a accessible location to the static
 * file server running in a docker container and implemented with BusyBox httpd
 * @param filePath 
 * @returns 
 */
export const getFileLocalPath = (filePath: string): string => {
    return `../data/uploads/${filePath}`
}

builder.scalarType('Upload', {
    serialize: () => { throw new Error('Upload scalar serialization not supported'); },
    parseValue: (value) => value,
    parseLiteral: () => { throw new Error('Upload scalar literal unsupported'); },
})

class UploadOutput {
    path: String;
    url: String

    constructor(path: String, url: String) {
        this.path = path
        this.url = url
    }
}
    
builder.objectType(UploadOutput, {
    name: 'UploadOutput',
    description: "The result of a file upload",
    fields: (t) => ({
        path: t.string({ required: true }),
        url: t.string({ required: true })
    }),
})

builder.mutationFields((t) => ({
    uploadFile: t.field({
        type: UploadOutput,
        authScopes: {
            isAuthenticated: true,
          },
        args: {
            file: t.arg({ type: 'Upload', required: true }),
        },
        resolve: async (parent, { file }, context) => {
            // get the user id from the token
            const {userId} = getTokenData(context)

            if (ALLOWED_FILETYPES.filter((val) => val === file.type).length == 0) {
                throw new Error("Filetype not allowed")
                
                // NOTE:
                // to set the error directly on the API we can use GraphQLError
                // see: https://the-guild.dev/graphql/yoga-server/tutorial/basic/09-error-handling
                //return Promise.reject(
                //    new GraphQLError("Filetype not allowed.")
                //)
            }

            // get the user folder from the user id
            const hash = createHash('sha256');
            hash.update(userId.toString())
            const userFolder: string = hash.digest('hex')

            // create user folder if it does not exist
            const userLocalPath = getFileLocalPath(userFolder)
            if (!fs.existsSync(userLocalPath)){
                fs.mkdirSync(userLocalPath);
            }

            const filename = file.name
            // TODO: obfuscate the filename
            const filePath = `${userFolder}/${filename}`
            const storePath = getFileLocalPath(filePath)
            const url = `${process.env.FILESERVER_URL}/${filePath}`
            await fs.writeFile(storePath, file.blobParts[0], (err) => {
                if (err) {
                    throw new Error(`Error uploading file: ${err.message}`)
                }
            })

            console.log(`File uploaded to ${filePath} for user ${userId}.`)

            // returning url even though it isn't used
            return {
                'path': filePath,
                'url': url
            }
        },
    }),
}));

