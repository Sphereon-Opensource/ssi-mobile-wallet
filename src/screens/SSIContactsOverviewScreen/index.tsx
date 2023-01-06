import { IConnectionParty } from '@sphereon/ssi-sdk-data-store-common'
import React, { PureComponent } from 'react'
import { ListRenderItemInfo, RefreshControl } from 'react-native'
import { NativeStackScreenProps } from 'react-native-screens/native-stack'
import { SwipeListView } from 'react-native-swipe-list-view'
import { connect } from 'react-redux'

import { OVERVIEW_INITIAL_NUMBER_TO_RENDER } from '../../@config/constants'
import { ScreenRoutesEnum, StackParamList } from '../../@types'
import SSIContactViewItem from '../../components/views/SSIContactViewItem'
import SSISwipeRowViewItem from '../../components/views/SSISwipeRowViewItem'
import { RootState } from '../../store'
import { getContacts } from '../../store/actions/contact.actions'
import { SSIBasicContainerStyled as Container } from '../../styles/styledComponents'

interface IScreenProps extends NativeStackScreenProps<StackParamList, ScreenRoutesEnum.CONTACTS_OVERVIEW> {
  getContacts: () => void
  contacts: Array<IConnectionParty>
}

class SSIContactsOverviewScreen extends PureComponent<IScreenProps> {
  state = {
    refreshing: false
  }

  onRefresh = async (): Promise<void> => {
    this.props.getContacts()
    this.setState({ refreshing: false })
  }

  renderItem = (itemInfo: ListRenderItemInfo<IConnectionParty>): JSX.Element => (
    <SSISwipeRowViewItem
      listIndex={itemInfo.index}
      viewItem={
        <SSIContactViewItem
          id={itemInfo.item.id}
          name={itemInfo.item.alias}
          uri={itemInfo.item.uri}
          roles={[]} // TODO should be an aggregate of the roles on identities
        />
      }
      onPress={async () => this.props.navigation.navigate(ScreenRoutesEnum.CONTACT_DETAILS, { contact: itemInfo.item })}
      onDelete={async () => console.log('Delete contact pressed!')}
    />
  )

  render() {
    return (
      <Container>
        <SwipeListView
          data={this.props.contacts}
          keyExtractor={(itemInfo: IConnectionParty) => itemInfo.id}
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
    getContacts: () => dispatch(getContacts())
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    contacts: state.contact.contacts
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SSIContactsOverviewScreen)
