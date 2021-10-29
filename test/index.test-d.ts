import { expectAssignable, expectError, expectType } from 'tsd'
import DefaultExport, { SecureURL, SecureURLOption } from '../lib'

// default export and named export should be the same
expectType<DefaultExport>(new SecureURL(''))
expectType<SecureURL>(new DefaultExport(''))

// option
expectAssignable<SecureURLOption>({})
expectAssignable<SecureURLOption>({ mode: 'path' })
expectAssignable<SecureURLOption>({ mode: 'relax' })
expectAssignable<SecureURLOption>({ mode: 'insecure' })
expectAssignable<SecureURLOption>({ keepPort: true })
expectAssignable<SecureURLOption>({ keepPort: false })
expectAssignable<SecureURLOption>({ mode: 'path', keepPort: true })

// two arguments
expectType<SecureURL>(new SecureURL('', ''))
expectType<SecureURL>(new SecureURL('', {}))
expectType<SecureURL>(new SecureURL('', { mode: 'path', keepPort: true }))

// three arguments
expectType<SecureURL>(new SecureURL('', '', {}))
expectType<SecureURL>(new SecureURL('', '', { mode: 'path', keepPort: true }))

// invalid argument
expectError(new SecureURL())
expectError(new SecureURL(true))
expectError(new SecureURL({}))
expectError(new SecureURL('', { mode: 'invalid' }))