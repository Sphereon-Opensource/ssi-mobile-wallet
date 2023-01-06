import { ICredential, OriginalVerifiableCredential } from '@sphereon/ssi-types'
import { CredentialMapper } from '@sphereon/ssi-types/src/mapper/credential-mapper'
import { UniqueVerifiableCredential, VerifiableCredential } from '@veramo/core'
import { Dispatch } from 'react'
import { AnyAction } from 'redux'

import {
  CREDENTIALS_LOADING,
  DELETE_CREDENTIAL_FAILED,
  DELETE_CREDENTIAL_SUCCESS,
  GET_CREDENTIALS_FAILED,
  GET_CREDENTIALS_SUCCESS,
  STORE_CREDENTIAL_FAILED,
  STORE_CREDENTIAL_SUCCESS
} from '../../@types/store/credential.action.types'
import { translate } from '../../localization/Localization'
import {
  deleteVerifiableCredential as deleteCredential,
  getVerifiableCredentialsFromStorage,
  storeVerifiableCredential as storeCredential
} from '../../services/credentialService'
import { showToast, ToastTypeEnum } from '../../utils/ToastUtils'
import { toCredentialSummary } from '../../utils/mappers/CredentialMapper'

export const getVerifiableCredentials = (): ((dispatch: Dispatch<AnyAction>) => void) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: CREDENTIALS_LOADING })
    getVerifiableCredentialsFromStorage()
      .then((credentials: Array<UniqueVerifiableCredential>) => {
        const credentialSummaries = credentials.map((vc: UniqueVerifiableCredential) =>
          // TODO fix mismatch in types
          toCredentialSummary(vc.verifiableCredential as ICredential, vc.hash)
        )
        const payload = [...credentialSummaries]
        dispatch({ type: GET_CREDENTIALS_SUCCESS, payload })
      })
      .catch(() => dispatch({ type: GET_CREDENTIALS_FAILED }))
  }
}

export const storeVerifiableCredential = (vc: VerifiableCredential): ((dispatch: Dispatch<AnyAction>) => void) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: CREDENTIALS_LOADING })
    const mappedVc = CredentialMapper.toUniformCredential(vc as OriginalVerifiableCredential)
    storeCredential({ vc: mappedVc as VerifiableCredential })
      .then((hash: string) => {
        // TODO fix mismatch in types
        const payload = toCredentialSummary(mappedVc as ICredential, hash)
        dispatch({ type: STORE_CREDENTIAL_SUCCESS, payload })
      })
      .catch(() => dispatch({ type: STORE_CREDENTIAL_FAILED }))
  }
}

export const deleteVerifiableCredential = (credentialHash: string): ((dispatch: Dispatch<AnyAction>) => void) => {
  return (dispatch: Dispatch<AnyAction>) => {
    dispatch({ type: CREDENTIALS_LOADING })
    deleteCredential({ hash: credentialHash })
      .then((isDeleted: boolean) => {
        if (isDeleted) {
          const payload = credentialHash
          dispatch({ type: DELETE_CREDENTIAL_SUCCESS, payload })
          showToast(ToastTypeEnum.TOAST_SUCCESS, translate('credential_deleted_success_toast'))
        } else {
          dispatch({ type: DELETE_CREDENTIAL_FAILED })
          showToast(ToastTypeEnum.TOAST_ERROR, translate('credential_deleted_failed_toast'))
        }
      })
      .catch(() => {
        dispatch({ type: DELETE_CREDENTIAL_FAILED })
        showToast(ToastTypeEnum.TOAST_ERROR, translate('credential_deleted_failed_toast'))
      })
  }
}
