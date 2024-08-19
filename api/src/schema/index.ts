import { builder } from '../builder'
import './user'
import './uploads'
import { writeFileSync } from 'fs'
import { resolve } from 'path'
import { printSchema } from 'graphql'

export const schema = builder.toSchema({})
 
writeFileSync(resolve(__dirname, '../../schema.graphql'), printSchema(schema))
