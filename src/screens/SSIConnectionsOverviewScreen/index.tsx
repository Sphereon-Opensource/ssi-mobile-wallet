import { IConnection, IConnectionParty } from '@sphereon/ssi-sdk-data-store-common'
import React, { PureComponent } from 'react'
import { ListRenderItemInfo, RefreshControl } from 'react-native'
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack'
import { SwipeListView } from 'react-native-swipe-list-view'
import { connect } from 'react-redux'

import { OVERVIEW_INITIAL_NUMBER_TO_RENDER } from '../../@config/constants'
import { ConnectionStatusEnum, IConnectionViewItem, ScreenRoutesEnum, StackParamList } from '../../@types'
import { IAuthenticatedEntity } from '../../@types/store/authenticate.types'
import SSIConnectionViewItem from '../../components/views/SSIConnectionViewItem'
import SSISwipeRowViewItem from '../../components/views/SSISwipeRowViewItem'
import { RootState } from '../../store'
import { getConnectionParties } from '../../store/actions/connection.actions'
import { SSIBasicContainerStyled as Container } from '../../styles/styledComponents'

interface IScreenProps extends NativeStackScreenProps<StackParamList, ScreenRoutesEnum.CONNECTIONS_OVERVIEW> {
  getConnectionParties: () => void
  connectionParties: Array<IConnectionParty>
  authenticationEntities: Array<IAuthenticatedEntity>
}

class SSIConnectionsOverviewScreen extends PureComponent<IScreenProps> {
  state = {
    refreshing: false
  }

  onRefresh = async (): Promise<void> => {
    this.props.getConnectionParties()
    this.setState({ refreshing: false })
  }

  renderItem = (itemInfo: ListRenderItemInfo<IConnectionViewItem>): JSX.Element => (
    <SSISwipeRowViewItem
      listIndex={itemInfo.index}
      viewItem={
        <SSIConnectionViewItem
          name={itemInfo.item.entityName}
          // TODO we need a connection uri which currently is not available
          uri={itemInfo.item.connection.config.redirectUrl}
        />
      }
      onPress={async () => this.props.navigation.navigate(ScreenRoutesEnum.CONNECTION_DETAILS, itemInfo.item)}
      onDelete={async () => console.log('Delete contact pressed!')}
    />
  )

  render() {
    const connections = this.props.connectionParties
      .map((connectionParty: IConnectionParty) => {
        return connectionParty.connections.map((connection: IConnection) => {
          return {
            entityId: connectionParty.id,
            entityName: connectionParty.name,
            connection,
            connectionStatus: this.props.authenticationEntities.find(
              (entity: IAuthenticatedEntity) => entity.entityId === connectionParty.id
            )
              ? ConnectionStatusEnum.CONNECTED
              : ConnectionStatusEnum.DISCONNECTED
          }
        })
      })
      .flat()

    return (
      <Container>
        <SwipeListView
          data={connections}
          keyExtractor={(itemInfo: IConnectionViewItem) => itemInfo.connection.id}
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
    getConnectionParties: () => dispatch(getConnectionParties())
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    connectionParties: state.connection.parties,
    authenticationEntities: state.authentication.entities
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SSIConnectionsOverviewScreen)
