import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import axios from 'axios';
import Call from "./screens/Call"

const options = {
    ios: {
        appName: 'Indie Voice Chat',
    },
    android: {
        alertTitle: 'Permissions required',
        alertDescription: 'This application needs to access your phone accounts',
        cancelButton: 'Cancel',
        okButton: 'ok',
        imageName: 'phone_account_icon',
    }
};

RNCallKeep.setup(options);

const Home = () => {
    const toggleServer = (operation) => {
        return axios.get(`https://simplest-kotlin-server-ever.herokuapp.com/${operation}`)
            .then(function (response) {
                setServerInfoIsCalling(response.data)
            })
            .catch(function (error) {
                console.warn(error);
            });
    }


    const [person, setPerson] = useState("Alice");

    // TODO: might want to swtich to only relying on server for this
    const [isCalling, setIsCalling] = useState(false);

    const [serverInfoIsCalling, setServerInfoIsCalling] = useState(toggleServer("isActive"));
    const [isFirstTimeCalling, setIsFirstTimeCalling] = useState(true);

    const [isInCallView, setIsInCallView] = useState(false);

    const onAnswerCallAction = (data) => {
        let { callUUID } = data;
        RNCallKeep.endCall(callUUID);
        RNCallKeep.backToForeground();
        setIsInCallView(true);
    }
    RNCallKeep.addEventListener('answerCall', onAnswerCallAction);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log('Fetching call data from server...');
            setServerInfoIsCalling(toggleServer("isActive"));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (person === "Bob" && serverInfoIsCalling === "Yep" && isFirstTimeCalling) {
        RNCallKeep.displayIncomingCall("12345", "Alice", "");
        setIsFirstTimeCalling(false)
    }

    return (
        isInCallView ?
            <Call /> :
            <View style={styles.container}>
                <View style={styles.content}>
                    <Text style={styles.text}>Indie Video Chat</Text>
                    {person === "Alice" ?
                        <View style={styles.buttonContainer}>
                            <Button style={styles.button} title="Call Bob" onPress={async () => {
                                // todo: probably don't need both anymore
                                setIsCalling(true);
                                setIsInCallView(true);
                                await toggleServer("setActive");
                            }} />
                            <Button style={styles.button} title="Switch to Bob profile" onPress={() => {
                                setPerson("Bob")
                            }} />
                        </View>
                        :
                        <Button style={styles.button} title="Switch to Alice profile" onPress={() => {
                            setPerson("Alice")
                        }} />}
                </View>
            </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        backgroundColor: "#111"
    },
    content: {
        height: 160,
        display: "flex",
        justifyContent: "space-between"
    },
    text: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#f1f1f1"
    },
    buttonContainer: {
        height: 90,
        display: "flex",
        justifyContent: "space-between"
    },
    button: {
        width: 100,
        height: 50,
        marginTop: 20,
        marginBottom: 20
    }
});

export default Home;