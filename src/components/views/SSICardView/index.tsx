import { FC } from 'react'
import { Image, ImageBackground, View, ViewStyle } from 'react-native'

import { CredentialStatusEnum } from '../../../@types'
import { translate } from '../../../localization/Localization'
import { backgrounds, credentialCards } from '../../../styles/colors'
import {
  SSIAlphaContainerStyled as AlphaContainer,
  SSIBlurredContainerStyled as BlurredView,
  SSICardViewContainerStyled as Container,
  SSICardViewContentMainContainerStyled as ContentMainContainer,
  SSICardViewContentSubContainerStyled as ContentSubContainer,
  SSICardViewSSICredentialStatusStyled as CredentialStatus,
  SSICardViewCredentialSubtitleTextStyled as CredentialSubtitleText,
  SSICardViewCredentialTitleTextStyled as CredentialTitleText,
  SSICardViewFooterContainerStyled as FooterContainer,
  SSICardViewFooterContentContainerStyled as FooterContentContainer,
  SSICardViewHeaderContainerStyled as HeaderContainer,
  SSICardViewContentIssueNameContainerStyled as IssueNameContainer,
  SSICardViewHeaderLogoContainerStyled as LogoContainer,
  SSICardViewContentPropertiesContainerStyled as PropertiesContainer,
  SSICardViewHeaderTitleContainerStyled as TitleContainer
} from '../../../styles/components'
import {
  SSITextH5LightStyled as ExpirationDateText,
  SSITextH4LightStyled as H4Text,
  SSITextH6LightStyled as PropertyValueText
} from '../../../styles/styledComponents'
import SSIPlaceholderLogo from '../../assets/images/SSIPlaceholderLogo'

const { v4: uuidv4 } = require('uuid')

export interface IProps {
  backgroundColor?: string
  backgroundImage?: string // TODO WAL-302 Support passing in storage location
  logoImage?: string // TODO WAL-302 Support passing in storage location
  credentialTitle: string
  credentialSubtitle?: string
  credentialStatus?: CredentialStatusEnum
  issuerName?: string
  expirationDate?: string
  properties?: Array<IProperty>
  style?: ViewStyle
}

export interface IProperty {
  name: string
  value: string
}

const getPropertyElementsFrom = (properties: Array<IProperty>): Array<JSX.Element> => {
  const propertyMargin = 10
  const propertyMaxWidth = 140
  // We currently only support two properties on the card, this might change in the future
  return properties.slice(0, 2).map((property: IProperty, index: number) => (
    <View
      key={uuidv4()}
      style={{
        width: properties.length > 1 ? propertyMaxWidth : undefined,
        marginLeft: index > 0 ? propertyMargin : 0
      }}
    >
      <H4Text>{property.name}</H4Text>
      <PropertyValueText>{property.value}</PropertyValueText>
    </View>
  ))
}

const SSICardView: FC<IProps> = (props: IProps): JSX.Element => {
  const {
    backgroundColor = credentialCards.default,
    credentialTitle,
    credentialSubtitle,
    credentialStatus,
    issuerName,
    expirationDate,
    properties,
    style
  } = props

  const backgroundImage = props.backgroundImage ? { uri: props.backgroundImage } : {}
  const logoImage = props.logoImage ? { uri: props.logoImage } : null

  return (
    <Container style={[style, { backgroundColor }]}>
      <ImageBackground style={{ flex: 1 }} source={backgroundImage} resizeMode="cover">
        <AlphaContainer>
          <HeaderContainer>
            <LogoContainer>
              {logoImage ? (
                <Image style={{ flex: 1 }} source={logoImage} resizeMode="contain" />
              ) : (
                <SSIPlaceholderLogo />
              )}
            </LogoContainer>
            {credentialTitle && (
              <TitleContainer>
                <CredentialTitleText>{credentialTitle}</CredentialTitleText>
                {credentialSubtitle && <CredentialSubtitleText>{credentialSubtitle}</CredentialSubtitleText>}
              </TitleContainer>
            )}
          </HeaderContainer>
          <ContentMainContainer>
            <ContentSubContainer>
              {issuerName && (
                <IssueNameContainer>
                  <H4Text>{issuerName}</H4Text>
                </IssueNameContainer>
              )}
              {properties && <PropertiesContainer>{getPropertyElementsFrom(properties)}</PropertiesContainer>}
            </ContentSubContainer>
          </ContentMainContainer>
          <FooterContainer>
            <BlurredView>
              <FooterContentContainer>
                {expirationDate && (
                  <ExpirationDateText>{`${translate(
                    'credential_card_expires_message'
                  )} ${expirationDate}`}</ExpirationDateText>
                )}
                {credentialStatus && <CredentialStatus status={credentialStatus} color={backgrounds.primaryLight} />}
              </FooterContentContainer>
            </BlurredView>
          </FooterContainer>
        </AlphaContainer>
      </ImageBackground>
    </Container>
  )
}

export default SSICardView
