import { IssuanceInitiationWithBaseUrl } from '@sphereon/oid4vci-client'
import { CredentialResponse } from '@sphereon/oid4vci-client/dist/main/lib/types'
import { ConnectionIdentifierEnum, ConnectionTypeEnum } from '@sphereon/ssi-sdk-data-store-common'
import { CredentialMapper } from '@sphereon/ssi-types/src/mapper/credential-mapper'
import { VerifiableCredential } from '@veramo/core/src/types/vc-data-model'
import jwt_decode from 'jwt-decode'
import React, { FC } from 'react'
import { StatusBar } from 'react-native'
import { BarCodeReadEvent, RNCamera } from 'react-native-camera'
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types'
import { URL } from 'react-native-url-polyfill'

import { QR_SCANNER_TIMEOUT } from '../../@config/constants'
import {
  ConnectionRoutesEnum,
  ConnectionStatusEnum,
  CredentialIssuanceStateEnum,
  HomeRoutesEnum, ICredentialTypeSelection, IIssuerSummary,
  IQrAuthentication,
  IQrData,
  IQrDidSiopAuthenticationRequest,
  NavigationBarRoutesEnum,
  QrRoutesEnum,
  QrTypesEnum,
  StackParamList
} from '../../@types'
import SSIQRCustomMarker from '../../components/qrCodes/SSIQRCustomMarker'
import { translate } from '../../localization/Localization'
import JwtVcPresentationProfileProvider from '../../providers/credential/JwtVcPresentationProfileProvider'
import OpenId4VcIssuanceProvider from '../../providers/credential/OpenId4VcIssuanceProvider'
import { authenticate } from '../../services/authenticationService'
import { connectFrom } from '../../services/connectionService'
import { getOrCreatePrimaryIdentifier } from '../../services/identityService'
import { parseQr } from '../../services/qrService'
import {
  SSIFullFlexDirectionRowViewStyled as Container,
  SSIQRCodeScannerStyled as QRScanner
} from '../../styles/styledComponents'
import { showToast, ToastTypeEnum } from '../../utils/ToastUtils'
import { toCredentialSummary } from '../../utils/mappers/CredentialMapper'

const { v4: uuidv4 } = require('uuid')

type Props = NativeStackScreenProps<StackParamList, QrRoutesEnum.QR_READER>

const SSIQRReaderScreen: FC<Props> = (props: Props): JSX.Element => {
  const onRead = async (readEvent: BarCodeReadEvent) => {
    parseQr(readEvent.data)
      .then((qrData: IQrData) => processQr(qrData))
      .catch((error: Error) => showToast(ToastTypeEnum.TOAST_ERROR, error.message))
  }

  const processQr = async (qrData: IQrData) => {
    switch (qrData.type) {
      case QrTypesEnum.AUTH:
        switch ((qrData as IQrAuthentication).mode) {
          case ConnectionTypeEnum.DIDAUTH:
            return connectDidAuth(qrData)
        }
        break
      case QrTypesEnum.SIOPV2:
        return connectSiopV2(qrData)
      case QrTypesEnum.OPENID_VC:
        return connectJwtVcPresentationProfile(qrData)
      case QrTypesEnum.OPENID_INITIATE_ISSUANCE:
        return connectOpenId4VcIssuance(qrData)
    }
  }

  const connectDidAuth = async (qrData: IQrData) => {
    const identifier = await getOrCreatePrimaryIdentifier() // TODO replace getOrCreatePrimaryIdentifier() when we have proper identities in place
    const connection = connectFrom({
      type: ConnectionTypeEnum.DIDAUTH,
      identifier: {
        type: ConnectionIdentifierEnum.DID,
        correlationId: identifier.did
      },
      config: {
        identifier,
        stateId: (qrData as IQrDidSiopAuthenticationRequest).state,
        redirectUrl: (qrData as IQrDidSiopAuthenticationRequest).redirectUrl,
        sessionId: (qrData as IQrDidSiopAuthenticationRequest).redirectUrl + identifier.did
      }
    })

    authenticate(connection)
      .then(() => console.log('authentication success'))
      .catch((error) => {
        if (!/UserCancel|UserFallback|SystemCancel/.test(error.name)) {
          console.error('Error', error)
        }
      })
  }

  const connectSiopV2 = async (qrData: IQrData) => {
    const purpose = qrData.body?.accept?.includes(ConnectionTypeEnum.SIOPV2_OIDC4VP)
      ? translate('siop_oidc4vp_authentication_request_message')
      : translate('siop_authentication_request_message')

    props.navigation.navigate(ConnectionRoutesEnum.CONNECTION_DETAILS, {
      entityName: new URL(qrData.redirectUrl.split('?')[0]).host,
      connection: connectFrom({
        type: ConnectionTypeEnum.DIDAUTH,
        identifier: {
          type: ConnectionIdentifierEnum.URL,
          correlationId: qrData.redirectUrl
        },
        config: {
          sessionId: qrData.id,
          redirectUrl: qrData.redirectUrl,
          stateId: qrData.state,
          identifier: await getOrCreatePrimaryIdentifier() // TODO replace getOrCreatePrimaryIdentifier() when we have proper identities in place
        },
        metadata: [
          {
            label: translate('metadata_purpose_label'),
            value: purpose
          },
          {
            label: translate('metadata_rp_did_label'),
            value: qrData.from
          },
          {
            label: translate('metadata_connection_url_label'),
            value: qrData.redirectUrl.split('?')[0]
          }
        ]
      }),
      connectionStatus: ConnectionStatusEnum.DISCONNECTED
    })
  }

  const connectJwtVcPresentationProfile = async (qrData: IQrData) => {
    if (qrData.pin) {
      const manifest = await new JwtVcPresentationProfileProvider().getManifest(qrData)
      props.navigation.navigate(QrRoutesEnum.VERIFICATION_CODE, {
        pinLength: qrData.pin.length,
        credentialName: manifest.display.card.title || '[MISSING CREDENTIAL NAME]',
        // TODO WAL-301 need to send a response with a pin code to complete the process.
        onVerification: async (pin: string) =>
          await props.navigation.navigate(NavigationBarRoutesEnum.HOME, { screen: HomeRoutesEnum.CREDENTIALS_OVERVIEW })
      })
    }
    // TODO WAL-301 need to send a response when we do not need a pin code
  }

  const connectOpenId4VcIssuance = async (qrData: IQrData) => {
    const sendResponse = async (
      issuanceInitiation: IssuanceInitiationWithBaseUrl,
      pin?: string
    ): Promise<void> => // TODO we do not need return CredentialResponse
      new OpenId4VcIssuanceProvider()
        .getCredentialFromIssuance({
          issuanceInitiation,
          ...(pin && { pin })
        })
        .then((credentialResponse: CredentialResponse) => {
          const vc = CredentialMapper.toUniformCredential(
            credentialResponse.credential /*, {
            maxTimeSkewInMS: Number.MAX_VALUE
          }*/
          )
          props.navigation.navigate(HomeRoutesEnum.CREDENTIAL_DETAILS, {
            rawCredential: credentialResponse.credential as unknown as VerifiableCredential,
            credential: toCredentialSummary(vc),
            state: CredentialIssuanceStateEnum.OFFER
          })
        })
        .catch((error: Error) => {
          return Promise.reject(error)
        })

    const metadata = await new OpenId4VcIssuanceProvider().getMetadata({ issuanceInitiation: qrData.issuanceInitiation })
    const supported_credentials = metadata.oid4vci_metadata
        ? Object.keys(metadata.oid4vci_metadata.credentials_supported).map(key => (
            {
              id: uuidv4(),
              credentialType: key,
              checked: false
            }
        ))
        : [{
          id: uuidv4(),
          credentialType: 'OpenBadgeCredential',
          checked: false
        }]


    // console.log(`meta: ${JSON.stringify(metadata, null, 2)}`)

    props.navigation.navigate(QrRoutesEnum.SELECT_CREDENTIAL_TYPE, {
      credentialTypes: supported_credentials,
      acceptAction: async (credentialType: string) => {
        // TODO user_pin_required needs an update from the lib to be an actual boolean
        if (qrData.issuanceInitiation.issuanceInitiationRequest.user_pin_required === 'true') {
          props.navigation.navigate(QrRoutesEnum.VERIFICATION_CODE, {
            credentialName: Array.isArray(qrData.issuanceInitiation.issuanceInitiationRequest.credential_type)
                ? qrData.issuanceInitiation.issuanceInitiationRequest.credential_type.join(', ')
                : qrData.issuanceInitiation.issuanceInitiationRequest.credential_type,
            onVerification: async (pin: string) => await sendResponse(qrData.issuanceInitiation, pin)
          })
        } else {
          await sendResponse(qrData.issuanceInitiation)
        }
      }
    })
  }

  // TODO move to better place
  const decodeToken = (vc: string): any => {
    const options = { header: false }
    return jwt_decode(vc, options)
  }

  return (
    <Container>
      <StatusBar translucent backgroundColor="transparent" />
      <QRScanner
        onRead={onRead}
        reactivate
        reactivateTimeout={QR_SCANNER_TIMEOUT.reactivate}
        showMarker
        customMarker={
          <SSIQRCustomMarker
            title={translate('qr_scanner_marker_title')}
            subtitle={translate('qr_scanner_marker_subtitle')}
          />
        }
        cameraProps={{
          flashMode: RNCamera.Constants.FlashMode.auto
        }}
      />
    </Container>
  )
}

export default SSIQRReaderScreen
