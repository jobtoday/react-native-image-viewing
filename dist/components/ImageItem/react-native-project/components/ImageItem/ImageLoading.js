import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
const ImageLoading = () => {
    return (<View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff"/>
    </View>);
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
});
export default ImageLoading;
