#import <Foundation/Foundation.h>
#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

#import "RNAppAuthAuthorizationFlowManager.h"

#import <Expo/Expo.h>

@interface AppDelegate : EXAppDelegateWrapper <RCTBridgeDelegate, RNAppAuthAuthorizationFlowManager>

@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;@end
