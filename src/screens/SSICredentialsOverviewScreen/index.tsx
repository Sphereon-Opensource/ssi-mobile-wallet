import { VerifiableCredential } from '@veramo/core'
import React, { PureComponent } from 'react'
import { ListRenderItemInfo, RefreshControl } from 'react-native'
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack'
import { SwipeListView } from 'react-native-swipe-list-view'
import { connect } from 'react-redux'

import { OVERVIEW_INITIAL_NUMBER_TO_RENDER } from '../../@config/constants'
import { ICredentialSummary, RootRoutesEnum, ScreenRoutesEnum, StackParamList } from '../../@types'
import SSICredentialViewItem from '../../components/views/SSICredentialViewItem'
import SSISwipeRowViewItem from '../../components/views/SSISwipeRowViewItem'
import { translate } from '../../localization/Localization'
import { getVerifiableCredential } from '../../services/credentialService'
import { RootState } from '../../store'
import { deleteVerifiableCredential, getVerifiableCredentials } from '../../store/actions/credential.actions'
import { SSIBasicContainerStyled as Container } from '../../styles/styledComponents'

const format = require('string-format')

interface IScreenProps extends NativeStackScreenProps<StackParamList, ScreenRoutesEnum.CREDENTIALS_OVERVIEW> {
  getVerifiableCredentials: () => void
  deleteVerifiableCredential: (credentialHash: string) => void
  verifiableCredentials: Array<ICredentialSummary>
}

class SSICredentialsOverviewScreen extends PureComponent<IScreenProps> {
  state = {
    refreshing: false
  }

  onRefresh = async (): Promise<void> => {
    this.props.getVerifiableCredentials()
    this.setState({ refreshing: false })
  }

  onDelete = async (credentialHash: string, credentialTitle: string): Promise<void> => {
    this.props.navigation.navigate(RootRoutesEnum.POPUP_MODAL, {
      title: translate('credential_delete_title'),
      details: format(translate('credential_delete_message'), credentialTitle),
      primaryButton: {
        caption: translate('action_confirm_label'),
        onPress: async () => {
          this.props.deleteVerifiableCredential(credentialHash)
          this.props.navigation.goBack()
        }
      },
      secondaryButton: {
        caption: translate('action_cancel_label'),
        onPress: async () => this.props.navigation.goBack()
      }
    })
  }

  renderItem = (itemInfo: ListRenderItemInfo<ICredentialSummary>): JSX.Element => (
    <SSISwipeRowViewItem
      listIndex={itemInfo.index}
      viewItem={
        <SSICredentialViewItem
          id={itemInfo.item.id}
          title={itemInfo.item.title}
          issuer={itemInfo.item.issuer}
          issueDate={itemInfo.item.issueDate}
          expirationDate={itemInfo.item.expirationDate}
          credentialStatus={itemInfo.item.credentialStatus}
          properties={[]}
          signedBy={itemInfo.item.signedBy}
        />
      }
      onPress={async () =>
        getVerifiableCredential({ hash: itemInfo.item.id }).then((vc: VerifiableCredential) =>
          this.props.navigation.navigate(ScreenRoutesEnum.CREDENTIAL_DETAILS, {
            rawCredential: vc as VerifiableCredential,
            credential: itemInfo.item,
            showActivity: true
          })
        )
      }
      onDelete={() => this.onDelete(itemInfo.item.id, itemInfo.item.title)}
    />
  )

  render() {
    return (
      <Container>
        <SwipeListView
          data={this.props.verifiableCredentials}
          keyExtractor={(itemInfo: ICredentialSummary) => itemInfo.id}
          renderItem={this.renderItem}
          closeOnRowOpen
          closeOnRowBeginSwipe
          useFlatList
          initialNumToRender={OVERVIEW_INITIAL_NUMBER_TO_RENDER}
          removeClippedSubviews
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}
        />
      </Container>
    )
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    getVerifiableCredentials: () => dispatch(getVerifiableCredentials()),
    deleteVerifiableCredential: (credentialHash: string) => dispatch(deleteVerifiableCredential(credentialHash))
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    verifiableCredentials: state.credential.verifiableCredentials
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SSICredentialsOverviewScreen)
