import React, { PureComponent } from 'react'
import { ListRenderItemInfo, RefreshControl, View } from 'react-native'
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types'
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view'

import { OVERVIEW_INITIAL_NUMBER_TO_RENDER } from '../../@config/constants'
import { ICredentialTypeSelection, QrRoutesEnum, StackParamList } from '../../@types'
import SSIPrimaryButton from '../../components/buttons/SSIPrimaryButton'
import SSISecondaryButton from '../../components/buttons/SSISecondaryButton'
import SSISwipeDeleteButton from '../../components/buttons/SSISwipeDeleteButton'
import SSISelectCredentialsTypeViewItem from '../../components/views/SSISelectCredentialsTypeViewItem'
import { translate } from '../../localization/Localization'
import { backgrounds } from '../../styles/colors'
import {
  SSIBasicContainerStyled as Container,
  SSIButtonBottomMultipleContainerStyled as ButtonContainer,
  SSICredentialsOverviewScreenHiddenItemContainerStyled as HiddenItemContainer,
  SSICredentialsViewItemContainerStyled as ItemContainer,
  SSICredentialsViewItemContentContainerStyled as ContentContainer,
  SSIPexVerificationSpacerStyled as Spacer,
  SSIStatusBarDarkModeStyled as StatusBar
} from '../../styles/styledComponents'

type Props = NativeStackScreenProps<StackParamList, QrRoutesEnum.SELECT_CREDENTIAL_TYPE>

export class SSISelectCredentialTypeScreen extends PureComponent<Props> {
  state = {
    refreshing: false,
    checked: false
  }

  onRefresh = () => {
    // this.props.getVerifiableCredentials()
    this.setState({ refreshing: false })
  }

  renderItem = (itemInfo: ListRenderItemInfo<ICredentialTypeSelection>): JSX.Element => (
    // TODO fix style issue being an array when using styled component (rightOpenValue / stopRightSwipe)
    <SwipeRow disableRightSwipe rightOpenValue={-97} stopRightSwipe={-97}>
      <HiddenItemContainer
        style={{
          backgroundColor: itemInfo.index % 2 == 0 ? backgrounds.secondaryDark : backgrounds.primaryDark
        }}
      >
        <SSISwipeDeleteButton onPress={() => console.log('Delete credential pressed!')} />
      </HiddenItemContainer>
      <ItemContainer
        style={{
          paddingTop: 20,
          backgroundColor: itemInfo.index % 2 == 0 ? backgrounds.secondaryDark : backgrounds.primaryDark
        }}
      >
        <ContentContainer
          onPress={() => {
            itemInfo.item.checked = !itemInfo.item.checked
            // hacking refresh of screen by calling any setState
            this.setState({ checked: !this.state.checked })
          }}
        >
          <SSISelectCredentialsTypeViewItem
            // TODO fix to many properties
            id={itemInfo.item.id}
            title={itemInfo.item.credentialType}
            //issuer={itemInfo.item.issuer}
            checked={
              this.state.refreshing
                ? itemInfo.item.checked
                : itemInfo.item.credentialType.toLowerCase().includes('openbadge') &&
                  !itemInfo.item.credentialType.toLowerCase().includes('extend')
            } //this.state.checked}
            //issueDate={itemInfo.item.issueDate}
            //expirationDate={itemInfo.item.expirationDate}
            //credentialStatus={itemInfo.item.credentialStatus}
            // properties={[]}
            //signedBy={itemInfo.item.signedBy}
          />
        </ContentContainer>
      </ItemContainer>
    </SwipeRow>
  )

  render() {
    return (
      <Container>
        <StatusBar />
        <SwipeListView
          data={this.props.route.params.credentialTypes}
          keyExtractor={(itemInfo: ICredentialTypeSelection) => itemInfo.id}
          renderItem={this.renderItem}
          closeOnRowOpen
          useFlatList
          initialNumToRender={OVERVIEW_INITIAL_NUMBER_TO_RENDER}
          removeClippedSubviews
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        />
        <View style={{ height: 100, width: '100%' }}>
          <ButtonContainer style={{ bottom: 25, marginLeft: 38 }}>
            <SSISecondaryButton
              title={translate('action_decline_label')}
              onPress={() => this.props.navigation.goBack()}
              // TODO move styling to styledComponents (currently there is an issue where this styling prop is not being set correctly)
              style={{ height: 42, width: 145 }}
            />
            <Spacer />
            <SSIPrimaryButton
              title={translate('action_accept_label')}
              onPress={async () => await this.props.route.params.acceptAction('OpenBadgeCredential')}
              // TODO move styling to styledComponents (currently there is an issue where this styling prop is not being set correctly)
              style={{ height: 42, width: 145 }}
            />
          </ButtonContainer>
        </View>
      </Container>
    )
  }
}

export default SSISelectCredentialTypeScreen
