import React, { FC } from 'react'
import { TouchableOpacity, View } from 'react-native'

import { ButtonIconsEnum, IButton, PopupBadgesEnum, PopupImagesEnum } from '../../../../@types'
import SSISecurityImage from '../../../../assets/images/security.svg'
import SSIWarningImage from '../../../../assets/images/warning.svg'
import { backgrounds, fonts } from '../../../../styles/colors'
import {
  SSIPopupButtonsContainerStyled as ButtonsContainer,
  SSIPopupCloseButtonContainerStyled as CloseButtonContainer,
  SSIPopupContainerStyled as Container,
  SSIPopupContentContainerStyled as ContentContainer,
  SSIPopupDetailsButtonContainerStyled as DetailsButtonContainer,
  SSIPopupDetailsButtonTextStyled as DetailsButtonText,
  SSIPopupDetailsTextStyled as DetailsText,
  SSIPopupExtraDetailsTextStyled as ExtraDetailsText,
  SSIPopupHeaderContainerStyled as HeaderContainer,
  SSIPopupImageContainerStyled as ImageContainer,
  SSICheckmarkBadgeStyled as SSICheckmarkBadge,
  SSIExclamationMarkBadgeStyled as SSIExclamationMarkBadge,
  SSIPopupTitleBadgeContainerStyled as TitleBadgeContainer,
  SSIPopupTitleContainerStyled as TitleContainer
} from '../../../../styles/components'
import { SSITextH2SemiBoldStyled as TitleCaption } from '../../../../styles/styledComponents'
import { parseTextToElement } from '../../../../utils/TextUtils'
import SSIIconButton from '../../../buttons/SSIIconButton'
import SSIPrimaryButton from '../../../buttons/SSIPrimaryButton'
import SSISecondaryButton from '../../../buttons/SSISecondaryButton'

export interface IProps {
  onClose?: () => Promise<void>
  image?: PopupImagesEnum
  title?: string
  titleBadge?: PopupBadgesEnum
  details?: string
  extraDetails?: string
  detailsButton?: IButton
  primaryButton?: IButton
  secondaryButton?: IButton
  darkMode?: boolean
}

const SSIPopup: FC<IProps> = (props: IProps): JSX.Element => {
  const {
    onClose,
    image,
    title,
    titleBadge,
    details,
    extraDetails,
    detailsButton,
    primaryButton,
    secondaryButton,
    darkMode = false
  } = props

  return (
    <Container style={{ backgroundColor: darkMode ? backgrounds.primaryDark : backgrounds.primaryLight }}>
      <HeaderContainer>
        {onClose && (
          <CloseButtonContainer>
            <SSIIconButton
              icon={ButtonIconsEnum.CLOSE}
              iconColor={darkMode ? fonts.light : undefined}
              onPress={onClose}
            />
          </CloseButtonContainer>
        )}
      </HeaderContainer>
      {image && <ImageContainer>{getImage(image)}</ImageContainer>}
      <ContentContainer>
        {title && (
          <TitleContainer>
            {titleBadge && <TitleBadgeContainer>{getBadge(titleBadge)}</TitleBadgeContainer>}
            <TitleCaption style={{ color: darkMode ? fonts.light : undefined }}>{title}</TitleCaption>
          </TitleContainer>
        )}
        {details && (
          <DetailsText style={{ color: darkMode ? fonts.light : undefined }}>{parseTextToElement(details)}</DetailsText>
        )}
        {extraDetails && <ExtraDetailsText>{parseTextToElement(extraDetails)}</ExtraDetailsText>}
        {detailsButton && (
          <DetailsButtonContainer>
            <TouchableOpacity onPress={detailsButton.onPress}>
              <DetailsButtonText>{detailsButton.caption}</DetailsButtonText>
            </TouchableOpacity>
          </DetailsButtonContainer>
        )}
      </ContentContainer>
      {/* TODO we use this 2 button structure a lot, we should make a component out of it */}
      {(primaryButton || secondaryButton) && (
        <ButtonsContainer>
          {secondaryButton && (
            <SSISecondaryButton
              style={{
                height: 42,
                minWidth: 160,
                backgroundColor: backgrounds.primaryLight,
                // Scales the button based on presence of other button
                width: primaryButton ? undefined : '100%'
              }}
              title={secondaryButton.caption}
              onPress={secondaryButton.onPress}
            />
          )}
          {primaryButton && (
            <SSIPrimaryButton
              // Scales the button based on presence of other button
              style={{ height: 42, minWidth: 160, width: secondaryButton ? undefined : '100%' }}
              title={primaryButton.caption}
              onPress={primaryButton.onPress}
            />
          )}
        </ButtonsContainer>
      )}
    </Container>
  )
}

const getBadge = (badge: PopupBadgesEnum): JSX.Element => {
  switch (badge) {
    case PopupBadgesEnum.CHECK_MARK:
      return <SSICheckmarkBadge />
    case PopupBadgesEnum.EXCLAMATION_MARK:
      return <SSIExclamationMarkBadge />
    default:
      return <View />
  }
}

const getImage = (image: PopupImagesEnum): JSX.Element => {
  switch (image) {
    case PopupImagesEnum.SECURITY:
      return <SSISecurityImage />
    case PopupImagesEnum.WARNING:
      return <SSIWarningImage />
    default:
      return <View />
  }
}

export default SSIPopup
