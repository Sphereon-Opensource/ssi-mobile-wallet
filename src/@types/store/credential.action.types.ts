import { ICredentialSummary } from '../index'

export const CREDENTIALS_LOADING = '[CREDENTIAL] CREDENTIALS_LOADING'
export type CREDENTIALS_LOADING = typeof CREDENTIALS_LOADING
export const GET_CREDENTIALS_SUCCESS = '[CREDENTIAL] GET_CREDENTIALS_SUCCESS'
export type GET_CREDENTIALS_SUCCESS = typeof GET_CREDENTIALS_SUCCESS
export const GET_CREDENTIALS_FAILED = '[CREDENTIAL] GET_CREDENTIALS_FAILED '
export type GET_CREDENTIALS_FAILED = typeof GET_CREDENTIALS_FAILED
export const STORE_CREDENTIAL_SUCCESS = '[CREDENTIAL] STORE_CREDENTIAL_SUCCESS'
export type STORE_CREDENTIAL_SUCCESS = typeof STORE_CREDENTIAL_SUCCESS
export const STORE_CREDENTIAL_FAILED = '[CREDENTIAL] STORE_CREDENTIAL_FAILED'
export type STORE_CREDENTIAL_FAILED = typeof STORE_CREDENTIAL_FAILED
export const DELETE_CREDENTIAL_SUCCESS = '[CREDENTIAL] DELETE_CREDENTIAL_SUCCESS'
export type DELETE_CREDENTIAL_SUCCESS = typeof DELETE_CREDENTIAL_SUCCESS
export const DELETE_CREDENTIAL_FAILED = '[CREDENTIAL] DELETE_CREDENTIAL_FAILED'
export type DELETE_CREDENTIAL_FAILED = typeof DELETE_CREDENTIAL_FAILED

export interface ICredentialState {
  loading: boolean
  verifiableCredentials: Array<ICredentialSummary>
}

interface ICredentialsLoading {
  type: CREDENTIALS_LOADING
}

interface IGetCredentialsSuccessAction {
  payload: Array<ICredentialSummary>
  type: GET_CREDENTIALS_SUCCESS
}

interface IGetCredentialsFailedAction {
  type: GET_CREDENTIALS_FAILED
}

interface IStoreCredentialsSuccessAction {
  payload: ICredentialSummary
  type: STORE_CREDENTIAL_SUCCESS
}

interface IStoreCredentialsFailedAction {
  type: STORE_CREDENTIAL_FAILED
}

interface IDeleteCredentialsSuccessAction {
  payload: string
  type: DELETE_CREDENTIAL_SUCCESS
}

interface IDeleteCredentialsFailedAction {
  type: DELETE_CREDENTIAL_FAILED
}

export type CredentialActionTypes =
  | ICredentialsLoading
  | IGetCredentialsSuccessAction
  | IGetCredentialsFailedAction
  | IStoreCredentialsSuccessAction
  | IStoreCredentialsFailedAction
  | IDeleteCredentialsSuccessAction
  | IDeleteCredentialsFailedAction
