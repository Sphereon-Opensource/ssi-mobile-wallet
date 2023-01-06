import { FC } from 'react'
import React from 'react'
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack'

import { RootRoutesEnum, StackParamList } from '../../@types'
import SSISecondaryButton from '../../components/buttons/SSISecondaryButton'
import SSIAlert from '../../components/messageBoxes/alerts/SSIAlert'
import { translate } from '../../localization/Localization'
import {
  SSIBasicModalContainerStyled as Container,
  SSIModalContentContainerStyled as ModalContentContainer
} from '../../styles/styledComponents'

type Props = NativeStackScreenProps<StackParamList, RootRoutesEnum.ALERT_MODAL>

const SSIAlertModal: FC<Props> = (props: Props): JSX.Element => {
  const { message, buttons, showCancel = true } = props.route.params

  return (
    <Container>
      <ModalContentContainer>
        <SSIAlert message={message} buttons={buttons} />
        {showCancel ? (
          <SSISecondaryButton
            title={translate('action_cancel_label')}
            onPress={() => props.navigation.goBack()}
            // TODO move styling to styledComponents (currently there is an issue where this styling prop is not being set correctly)
            style={{ height: 42, flex: 1 }}
          />
        ) : null}
      </ModalContentContainer>
    </Container>
  )
}

export default SSIAlertModal
