/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import React, { memo } from 'react';
import { ActivityIndicator, StyleSheet, useWindowDimensions, View, } from 'react-native';
const ImageLoading = () => {
    const { width, height } = useWindowDimensions();
    return (<View style={[{ width, height }, styles.loading]}>
      <ActivityIndicator size="small" color="#FFF"/>
    </View>);
};
const styles = StyleSheet.create({
    loading: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
export default memo(ImageLoading);
