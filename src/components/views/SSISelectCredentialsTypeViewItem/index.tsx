import React, { FC, useState } from 'react'
import { View } from 'react-native'
import CheckBox from '@react-native-community/checkbox'

import { ICredentialSummary, IIssuerSummary } from '../../../@types'
import { translate } from '../../../localization/Localization'
import {
  SSIFlexDirectionRowViewStyled as ContentBottomContainer,
  SSICredentialsViewItemContentMiddleContainerStyled as ContentMiddleContainer,
  SSICredentialsViewItemContentTopContainerStyled as ContentTopContainer,
  SSICredentialsViewItemStatusCaptionStyled as CredentialStatusCaption,
  SSICredentialsViewItemExpirationDateCaptionStyled as ExpirationDateCaption,
  SSITextH5LightStyled as IssueDateCaption,
  SSITextH4LightStyled as IssuerCaption,
  SSITextH3LightStyled as TitleCaption,
  SSIFlexDirectionRowViewStyled
} from '../../../styles/styledComponents'
import DateUtils from '../../../utils/DateUtils'
import SSICredentialStatus from '../../labels/SSICredentialStatus'

export interface Props {
  id: string
  title: string
  // issuer: IIssuerSummary
  checked: boolean
}

const SSISelectCredentialsTypeViewItem: FC<Props> = (props: Props): JSX.Element => {
  // default values only
  const { checked } = props

  return (
    <View>
      <SSIFlexDirectionRowViewStyled>
        <View style={{ marginTop: -8, paddingRight: 20 }}>
          <CheckBox
            value={checked}
            //onValueChange={(newValue) => setSelection(newValue)}
            hideBox
          />
        </View>
        <View>
          <ContentTopContainer>
            <TitleCaption>{props.title}</TitleCaption>
            {/*<CredentialStatusCaption>*/}
            {/*  <SSICredentialStatus status={props.credentialStatus} />*/}
            {/*</CredentialStatusCaption>*/}
          </ContentTopContainer>
          {/*<ContentMiddleContainer>*/}
          {/*  <IssuerCaption>{props.issuer.name}</IssuerCaption>*/}
          {/*</ContentMiddleContainer>*/}
          <ContentBottomContainer>
            {/*<IssueDateCaption>*/}
            {/*  {showTime ? DateUtils.toLocalDateTimeString(props.issueDate) : DateUtils.toLocalDateString(props.issueDate)}*/}
            {/*</IssueDateCaption>*/}
            {/*<ExpirationDateCaption>*/}
            {/*  {props.expirationDate*/}
            {/*    ? `${translate('credentials_view_item_expires_on')} ${*/}
            {/*        showTime*/}
            {/*          ? DateUtils.toLocalDateTimeString(props.expirationDate)*/}
            {/*          : DateUtils.toLocalDateString(props.expirationDate)*/}
            {/*      }`*/}
            {/*    : 'Never expires'}*/}
            {/*</ExpirationDateCaption>*/}
          </ContentBottomContainer>
        </View>
      </SSIFlexDirectionRowViewStyled>
    </View>
  )
}

export default SSISelectCredentialsTypeViewItem
