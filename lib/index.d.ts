export interface SecureURLOption {
  mode?: 'path' | 'relax' | 'insecure'
  keepPort?: boolean
}

export declare class SecureURL {
  constructor(path: string | SecureURL | URL, option?: SecureURLOption)
  constructor(path: string | SecureURL | URL, base?: string | SecureURL | URL, option?: SecureURLOption)

  readonly href: string
  readonly origin: string
  readonly host: string
  readonly protocol: string
  readonly username: string
  readonly password: string
  readonly hostname: string
  readonly port?: number
  readonly pathname: string
  readonly hash: string
  readonly search: string
  readonly searchParams: URLSearchParams
}

export type URL = SecureURL

export default SecureURL