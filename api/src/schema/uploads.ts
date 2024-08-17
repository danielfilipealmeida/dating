// NOTE: import if we want to set the error message in the API
// import { GraphQLError } from 'graphql';
import { builder } from '../builder'
const fs = require('node:fs');


const ALLOWED_FILETYPES = [
    'image/jpeg'
]

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
        args: {
            file: t.arg({ type: 'Upload', required: true }),
        },
        resolve: async (parent, { file }) => {

            if (ALLOWED_FILETYPES.filter((val) => val === file.type).length == 0) {
                throw new Error("Filetype not allowed")
                
                // NOTE:
                // to set the error directly on the API we can use GraphQLError
                // see: https://the-guild.dev/graphql/yoga-server/tutorial/basic/09-error-handling
                //return Promise.reject(
                //    new GraphQLError("Filetype not allowed.")
                //)
            }

            const filename = file.name
            const filePath = filename
            const storePath = `../data/uploads/${filePath}`
            const url = `${process.env.FILESERVER_URL}/${filePath}`
            await fs.writeFile(storePath, file.blobParts[0], (err) => {
                if (err) {
                    throw new Error(`Error uploading file: ${err.message}`)
                }
            })

            return {
                'path': filePath,
                'url': url
            }
        },
    }),
}));

