import {VerifiableCredential} from '@veramo/core'
import React, {PureComponent} from 'react'
import {Image} from 'react-native'
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack/types'
import {connect} from 'react-redux'

import {
    CredentialIssuanceStateEnum,
    HomeRoutesEnum,
    ICredentialDetailsRow,
    NavigationBarRoutesEnum,
    QrRoutesEnum,
    StackParamList
} from '../../@types'
import SSIPrimaryButton from '../../components/buttons/SSIPrimaryButton'
import SSISecondaryButton from '../../components/buttons/SSISecondaryButton'
import SSICredentialDetailsView from '../../components/views/SSICredentialDetailsView'
import {translate} from '../../localization/Localization'
import {storeVerifiableCredential} from '../../store/actions/credential.actions'
import {
    SSIButtonBottomMultipleContainerStyled as ButtonContainer,
    SSIBasicHorizontalCenterContainerStyled as Container,
    SSIFlexDirectionRowViewStyled as HorizontalContainer,
    SSICredentialDetailsViewSignedByContainerStyled as SignedByContainer,
    SSICredentialDetailsViewCaptionSignedByStyled as SignedByLabelCaption,
    SSITextH5LightSemiBoldStyled as SignedByValueCaption,
    SSIPexVerificationSpacerStyled as Spacer,
    SSIStatusBarDarkModeStyled as StatusBar
} from '../../styles/styledComponents'
import {showToast, ToastTypeEnum} from '../../utils/ToastUtils'

interface IScreenProps extends NativeStackScreenProps<StackParamList, HomeRoutesEnum.CREDENTIAL_DETAILS> {
    storeVerifiableCredential: (vc: VerifiableCredential) => Promise<void>
}

export class SSICredentialDetailsScreen extends PureComponent<IScreenProps> {
    render() {
        return (
            <Container>
                <StatusBar/>
                {(true || this.props.route.params.credential.title.toLowerCase().includes('badge') ||
                    this.props.route.params.credential.title.toLowerCase().includes('plug')) && (
                    <Image
                        style={{width: 160, height: 160}}
                        source={{
                            uri: this.props.route.params.credential.properties.find(
                                (property: ICredentialDetailsRow) => property.label === 'image'
                            )?.value
                        }}
                    />
                )}

                <SSICredentialDetailsView
                    credential={this.props.route.params.credential}
                    state={this.props.route.params.state}
                />
                <HorizontalContainer style={{height: 65, marginTop: 12, width: '80%'}}>
                    {this.props.route.params.credential.issuer.image && (
                        <Image
                            style={{width: 63, height: 63}}
                            source={{uri: typeof this.props.route.params.credential.issuer.image === 'string' ? this.props.route.params.credential.issuer.image : this.props.route.params.credential.issuer.image.id}}
                        />
                    )}
                    <SignedByContainer style={{marginLeft: 5}}>
                        <SignedByLabelCaption>{translate('credential_details_view_signed_by')}</SignedByLabelCaption>
                        <SignedByValueCaption>{this.props.route.params.credential.signedBy}</SignedByValueCaption>
                        {typeof this.props.route.params.credential.issuer === 'string' && (
                            <SignedByValueCaption style={{marginRight: 55}}>
                                {this.props.route.params.credential.issuer}
                            </SignedByValueCaption>
                        )}
                        {typeof this.props.route.params.credential.issuer !== 'string' &&
                            this.props.route.params.credential.issuer.url && (
                                <SignedByValueCaption style={{marginRight: 55}}>
                                    {this.props.route.params.credential.issuer.url.replace('https://', '')}
                                </SignedByValueCaption>
                            )}
                    </SignedByContainer>
                </HorizontalContainer>
                {this.props.route.params.state === CredentialIssuanceStateEnum.OFFER ? (
                    <ButtonContainer style={{bottom: 30}}>
                        <SSISecondaryButton
                            title={translate('action_decline_label')}
                            onPress={() => {
                                this.props.navigation.navigate(NavigationBarRoutesEnum.HOME, {
                                    screen: HomeRoutesEnum.CREDENTIALS_OVERVIEW
                                })
                                showToast(ToastTypeEnum.TOAST_SUCCESS, translate('credential_offer_declined_toast'))
                            }}
                            // TODO move styling to styledComponents (currently there is an issue where this styling prop is not being set correctly)
                            style={{height: 42, width: 145}}
                        />
                        <Spacer/>
                        <SSIPrimaryButton
                            title={translate('action_accept_label')}
                            onPress={() =>
                                this.props
                                    .storeVerifiableCredential(this.props.route.params.rawCredential!)
                                    .then(() => {
                                        this.props.navigation.navigate(NavigationBarRoutesEnum.HOME, {
                                            screen: HomeRoutesEnum.CREDENTIALS_OVERVIEW
                                        })
                                        showToast(ToastTypeEnum.TOAST_SUCCESS, translate('credential_offer_accepted_toast'))
                                    })
                                    .catch((error: Error) => showToast(ToastTypeEnum.TOAST_ERROR, error.message))
                            }
                            // TODO move styling to styledComponents (currently there is an issue where this styling prop is not being set correctly)
                            style={{height: 42, width: 145}}
                        />
                    </ButtonContainer>
                ) : null}
            </Container>
        )
    }
}

const mapDispatchToProps = (dispatch: any) => {
    return {
        storeVerifiableCredential: async (vc: VerifiableCredential) => await dispatch(storeVerifiableCredential(vc))
    }
}

export default connect(null, mapDispatchToProps)(SSICredentialDetailsScreen)
