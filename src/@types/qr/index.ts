import { NativeStackNavigationProp } from 'react-native-screens/lib/typescript/native-stack'

export enum QrTypesEnum {
  AUTH = 'auth',
  SIOPV2 = 'siopv2',
  OPENID_VC = 'openid-vc',
  OPENID_INITIATE_ISSUANCE = 'openid-initiate-issuance'
}

export interface IQrData {
  type: QrTypesEnum
  [x: string]: any
}

export interface IQrAuthentication extends IQrData {
  mode: string
}

export interface IQrDidSiopAuthenticationRequest extends IQrAuthentication {
  state: string
  did: string
  redirectUrl: string
}

export interface IQrDataArgs {
  qrData: IQrData
  navigation: NativeStackNavigationProp<any> // TODO fix any type
}

export interface IReadQrArgs {
  qrData: string
  navigation: NativeStackNavigationProp<any> // TODO fix any type
}
