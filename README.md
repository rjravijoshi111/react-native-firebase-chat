# react-native-firebase-chat

React Native chat application using Firebase backend. 

In this project We have used following Firebase serivces.
* **Firebase Authentication** : For authentication user by phone number
* **Firebase RealTime Database** : That's we for handle realtime chat
* **Firebase Storage** : That's we use for store user profile image

## Setup


## Firebase Steup
- For Firebase setup you need follow this [instructions](https://firebase.google.com/docs/android/setup)


## Steps to Run
### 1. Clone project and install the dependencies
```
git clone git@github.com:rjravijoshi111/react-native-firebase-chat.git && cd react-native-firebase-chat && yarn install
```

to install all dependencies listed in the project's package.json file

### Configuring the environments for iOS and Android

__iOS (XCode)__

Navigate to project ios subfolder and run
```
pod install
```
to install the latest iOS SDK

### 2. Setup firebase in iOS and Android
 __For iOS__
 - Download `GoogleService-Info.plist` from Firebase Project and copy it to `react-native-firebase-chat/ios`

 __For android__
- Download `google-services.json` from Firebase Project and copy it to `react-native-firebase-chat/android/app`


### 3. Running the project

__For iOS__

```
react-native run-ios
```
For iOS you will probably want to have the simulator open already as XCode 9 does not start the simulator automatically with this command

__For Android__

```
react-native run-android
```
Be sure you have the android platform-tools in your PATH environment variable so that react can access tools like adb to run your app. You may need to setup a virtual device first if you wish to use the simulator.

You may also run either app by using the standard build and run tools in each platforms respective IDE

## Screens

**Login Screen**
![alt text](https://github.com/rjravijoshi111/react-native-firebase-chat/blob/master/preview_images/01.png)

**Sign up Screen**
![alt text](https://github.com/rjravijoshi111/react-native-firebase-chat/blob/master/preview_images/02.png)

**Chat UserList**
![alt text](https://github.com/rjravijoshi111/react-native-firebase-chat/blob/master/preview_images/03.png)

**More Screen**
![alt text](https://github.com/rjravijoshi111/react-native-firebase-chat/blob/master/preview_images/04.png)

**Edit Profile Screen**
![alt text](https://github.com/rjravijoshi111/react-native-firebase-chat/blob/master/preview_images/05.png)

**Chat Screen**
![alt text](https://github.com/rjravijoshi111/react-native-firebase-chat/blob/master/preview_images/07.png)

**New User List Screen**
![alt text](https://github.com/rjravijoshi111/react-native-firebase-chat/blob/master/preview_images/08.png)

**Upload Media**
![alt text](https://github.com/rjravijoshi111/react-native-firebase-chat/blob/master/preview_images/09.png)


