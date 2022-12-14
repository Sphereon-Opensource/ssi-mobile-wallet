import React, { FC } from 'react'
import { Pressable } from 'react-native'

import DeleteIcon from '../../../assets/icons/delete.svg'
import { translate } from '../../../localization/Localization'
import {
  SSISwipeDeleteButtonCaptionStyled as ButtonCaption,
  SSISwipeDeleteButtonLinearGradientStyled as LinearGradient
} from '../../../styles/styledComponents'

export interface IProps {
  onPress?: () => void
}

const SSISwipeDeleteButton: FC<IProps> = (props: IProps): JSX.Element => {
  return (
    <Pressable onPress={props.onPress}>
      <LinearGradient>
        <DeleteIcon />
        <ButtonCaption>{translate('swipe_delete_button_caption')}</ButtonCaption>
      </LinearGradient>
    </Pressable>
  )
}

export default SSISwipeDeleteButton
