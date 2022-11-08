import React, { FC } from 'react'
import { ListRenderItemInfo } from 'react-native'

import { DETAILS_INITIAL_NUMBER_TO_RENDER } from '../../../@config/constants'
import { CredentialIssuanceStateEnum, ICredentialDetailsRow, ICredentialSummary } from '../../../@types'
import { translate } from '../../../localization/Localization'
import {
  SSIFlexDirectionColumnHalfViewStyled as Column,
  SSIDetailsViewRoundedContainerStyled as Container,
  SSIDetailsLabelsContainerStyled as DetailLabelsContainer,
  SSIDetailsViewCaptionDetailsStyled as DetailsCaption,
  SSITextH5LightStyled as DetailsItemLabelCaption,
  SSIDetailsViewDetailsValueCaptionStyled as DetailsItemValueCaption,
  SSIDetailsViewDetailsListStyled as DetailsList,
  SSIDetailsViewLabelRowViewStyled as LabelRow,
  SSIDetailsViewSeparatorStyled as Separator
} from '../../../styles/styledComponents'
import SSICredentialsViewItem from '../SSICredentialsViewItem'

export interface IProps {
  credential: ICredentialSummary
  state?: CredentialIssuanceStateEnum
}

const SSICredentialDetailsView: FC<IProps> = (props: IProps): JSX.Element => {
  const renderItem = (itemInfo: ListRenderItemInfo<ICredentialDetailsRow>) => {
    return (
      <LabelRow>
        {itemInfo.item.value && (
          <Column>
            <DetailsItemLabelCaption style={{ marginLeft: itemInfo.item.level * 10 }}>{itemInfo.item.label}</DetailsItemLabelCaption>
          </Column>
        )}

        {itemInfo.item.value && (
          <Column style={{ width: '55%' }}>
            <DetailsItemValueCaption>{itemInfo.item.value}</DetailsItemValueCaption>
          </Column>
        )}

        {!itemInfo.item.value && (
          <Column>
            <DetailsItemValueCaption style={{ textDecorationLine: 'underline', marginTop: 10, marginLeft: itemInfo.item.level * 10}}>
              {itemInfo.item.label}
            </DetailsItemValueCaption>
          </Column>
        )}
      </LabelRow>
    )
  }

  return (
    <Container>
      <SSICredentialsViewItem
        // TODO fix properties (to many)
        id={props.credential.id} // TODO fixme
        title={props.credential.title}
        issuer={props.credential.issuer}
        issueDate={props.credential.issueDate}
        expirationDate={props.credential.expirationDate}
        credentialStatus={props.credential.credentialStatus}
        properties={props.credential.properties}
        signedBy={props.credential.signedBy}
        showTime
      />
      <Separator />
      <DetailLabelsContainer style={{ height: props.state ? 250 : 320 }}>
        <DetailsCaption>{translate('credential_details_view_details')}</DetailsCaption>

        <DetailsList
          // TODO fix DetailsList
          data={props.credential.properties.filter((property: ICredentialDetailsRow) => property.label !== 'image')}
          renderItem={renderItem}
          keyExtractor={(item: ICredentialDetailsRow) => item.id}
          initialNumToRender={DETAILS_INITIAL_NUMBER_TO_RENDER}
          removeClippedSubviews
        />
      </DetailLabelsContainer>
    </Container>
  )
}

export default SSICredentialDetailsView
