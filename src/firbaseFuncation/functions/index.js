const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

exports.sendNotification = functions.database
  .ref("/Chat/{chatid}/{pushId}")
  .onWrite(event => {
    
    const message = event.after.val();
    console.log(" message-->", message);
    const senderUid = message.uid;
    const receiverUid = message.fuid;

    return admin
        .database()
        .ref(`Users/`)
        .orderByChild('uid')
        .equalTo(senderUid)
        .once("child_added")
        .then(data => {
            admin
            .database()
            .ref()
            .child("ChatList/"+receiverUid+"/member/")
            .orderByChild('isRead').equalTo(false).once('value', async snap => {
                console.log('snap.length-->', snap.numChildren());

                const payload = {
                    notification: {
                        title: data.val().name,
                        body: message.text,
                        sound: "default",
                        badge : snap.numChildren()
                    },
                    data:{
                        uid : senderUid+'',
                        name : data.val().name,
                        profileImage : data.val().profileImage,
                        badge : snap.numChildren()
                    }
                };
            
                const options = {
                    collapseKey: "demo",
                    contentAvailable: true,
                    priority: "high",
                    timeToLive: 60 * 60 * 24
                };
                
                return admin
                .database()
                .ref(`Users/`)
                .orderByChild('uid')
                .equalTo(receiverUid)
                .once("child_added")
                .then(data => {
                    return admin
                        .messaging()
                        .sendToDevice(data.val().token, payload)
                        .then(function(response) {
                            console.log("Successfully sent message:", response);
                        })
                        .catch(function(error) {
                            console.log("Error sending message:", error);
                        });  
                    
                });

            })
           
        });
});
