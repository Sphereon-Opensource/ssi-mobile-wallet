import React, { FC } from 'react'
import { View } from 'react-native'

import { ICredentialSummary } from '../../../@types'
import { translate } from '../../../localization/Localization'
import {
  SSIFlexDirectionRowViewStyled as ContentBottomContainer,
  SSICredentialsViewItemContentMiddleContainerStyled as ContentMiddleContainer,
  SSICredentialsViewItemContentTopContainerStyled as ContentTopContainer,
  SSICredentialsViewItemStatusCaptionStyled as CredentialStatusCaption,
  SSICredentialsViewItemExpirationDateCaptionStyled as ExpirationDateCaption,
  SSITextH5LightStyled as IssueDateCaption,
  SSITextH4LightStyled as IssuerCaption,
  SSITextH3LightStyled as TitleCaption
} from '../../../styles/styledComponents'
import DateUtils from '../../../utils/DateUtils'
import SSICredentialStatus from '../../labels/SSICredentialStatus'

export interface Props extends ICredentialSummary {
  // TODO should only contain info this screen needs, ICredentialSummary is to much
  showTime?: boolean
}

const SSICredentialsViewItem: FC<Props> = (props: Props): JSX.Element => {
  // default values only
  const { showTime = false } = props

  return (
    <View>
      <ContentTopContainer>
        <TitleCaption>{props.title}</TitleCaption>
        <CredentialStatusCaption>
          <SSICredentialStatus status={props.credentialStatus} />
        </CredentialStatusCaption>
      </ContentTopContainer>
      <ContentMiddleContainer>
        <IssuerCaption>
          {typeof props.issuer === 'string'
            ? props.issuer.length <= 50
              ? props.issuer
              : `${props.issuer.substring(0, 50)}...`
            : props.issuer.name}
        </IssuerCaption>
      </ContentMiddleContainer>
      <ContentBottomContainer>
        <IssueDateCaption>
          {showTime ? DateUtils.toLocalDateTimeString(props.issueDate) : DateUtils.toLocalDateString(props.issueDate)}
        </IssueDateCaption>
        <ExpirationDateCaption>
          {props.expirationDate
            ? `${translate('credentials_view_item_expires_on')} ${
                showTime
                  ? DateUtils.toLocalDateTimeString(props.expirationDate)
                  : DateUtils.toLocalDateString(props.expirationDate)
              }`
            : 'Never expires'}
        </ExpirationDateCaption>
      </ContentBottomContainer>
    </View>
  )
}

export default SSICredentialsViewItem
