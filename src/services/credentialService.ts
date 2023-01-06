import { UniqueVerifiableCredential, VerifiableCredential } from '@veramo/core'

import {
  IDeleteVerifiableCredentialArgs,
  IGetVerifiableCredentialArgs,
  IStoreVerifiableCredentialArgs
} from '../@types/services'
import {
  dataStoreDeleteVerifiableCredential,
  dataStoreGetVerifiableCredential,
  dataStoreORMGetVerifiableCredentials,
  dataStoreSaveVerifiableCredential
} from '../agent'

// We want to extend this service with calls to the Veramo agent as the agent does all the work

export const getVerifiableCredentialsFromStorage = async (): Promise<Array<UniqueVerifiableCredential>> => {
  return dataStoreORMGetVerifiableCredentials()
}

export const storeVerifiableCredential = async (args: IStoreVerifiableCredentialArgs): Promise<string> => {
  return dataStoreSaveVerifiableCredential({ verifiableCredential: args.vc })
}

export const getVerifiableCredential = async (args: IGetVerifiableCredentialArgs): Promise<VerifiableCredential> => {
  return dataStoreGetVerifiableCredential({ hash: args.hash })
}

export const deleteVerifiableCredential = async (args: IDeleteVerifiableCredentialArgs): Promise<boolean> => {
  return dataStoreDeleteVerifiableCredential({ hash: args.hash })
}
