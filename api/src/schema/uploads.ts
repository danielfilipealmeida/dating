import { builder } from '../builder'
import { createUserFolderIfNeeded, hashString, getUploadFileData, getUserIdFromToken } from '../lib';
const fs = require('node:fs');
import { createReadStream } from 'fs';  

const ALLOWED_FILETYPES = [
    'image/jpeg'
];

/**
 * Calculates the relative location of a file that served by the static file server to the api
 * This is used for placing uploaded files to the api in a accessible location to the static
 * file server running in a docker container and implemented with BusyBox httpd
 * @param filePath 
 * @returns 
 */
export const getFileLocalPath = (filePath: string): string => {
    return `../data/uploads/${filePath}`
};

/**
 * Class representing the output of a file upload mutation.
 * This class is used to return the result of a file upload mutation.
 * It contains the success status, message, and optionally the path and URL of the uploaded file
 */
class FileUploadOutput {
    success: boolean;
    message: string;
    path?: string;
    url?: string;

    constructor(success: boolean, message: string, path?: string, url?: string) {
        this.success = success;
        this.message = message;
        this.path = path;
        this.url = url;
    }
}

builder.objectType(FileUploadOutput, {
    name: 'FileUploadOutput',
    description: "The result of a file upload",
    fields: (t) => ({
        success: t.boolean({ 
            nullable: false,
            resolve: (u) => u.success, 
            description: "Indicates if the file upload was successful" 
        }),
        message: t.string({ 
            nullable: false,
            resolve: (u) => u.message,
            description: "A message describing the result of the file upload in human readable form" 
        }),
        path: t.string({ 
            nullable: true,
            resolve: (u) => u.path,
            description: "The local path of the uploaded file, if available"
        }),
        url: t.string({ 
            nullable: true,
            resolve: (u) => u.url,
            description: "The URL of the uploaded file, if available"
        }),
    }),
});  

builder.mutationFields((t) => ({
    uploadFile: t.field({
        type: FileUploadOutput,
        authScopes: {
            isAuthenticated: true,
        },
        args: {
            file: t.arg({type: 'GraphQLFile', required: true }),
        },
        resolve: async (parent, { file }, context) => {
            try {
                const userId: string = getUserIdFromToken(context);
                if (!userId) {
                    throw new Error("User not authenticated");
                }
                if (ALLOWED_FILETYPES.filter((val) => val === file.type).length == 0) {
                    throw new Error("Filetype not allowed");
                }

                const userFolder: string = hashString(userId.toString());
                createUserFolderIfNeeded(userFolder);

                const filename = file.name;
                const { filePath, storePath, url } = getUploadFileData(filename, userFolder);
                // @ts-expect-error TS2339
                await fs.writeFile(storePath, Buffer.concat(file.blobParts), (err: any) => {
                    if (err) {
                        throw new Error(`Error uploading file: ${err.message}`);
                    }
                });

                console.log(`File uploaded to ${filePath} for user ${userId}.`);

                return {
                    success: true,
                    message: "File uploaded successfully.",
                    url,
                    path: filePath
                };
            }
            catch (error) {
                console.error("Error uploading file:", error);

                return {
                    success:false,
                    message: "Error uploading file."
                };
            }
        }
    }),
}));
