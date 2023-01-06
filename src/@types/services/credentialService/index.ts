import { VerifiableCredential } from '@veramo/core'

export interface IStoreVerifiableCredentialArgs {
  vc: VerifiableCredential
}

export interface IGetVerifiableCredentialArgs {
  hash: string
}

export interface IDeleteVerifiableCredentialArgs {
  hash: string
}
