/**
 * Copyright (c) JOB TODAY S.A. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
} from "react-native";

const InputFooter = () => (
  <KeyboardAvoidingView
    contentContainerStyle={styles.inputContainer}
    behavior="position"
    enabled={Platform.OS === 'ios'}
  >
    <TextInput 
      style={styles.input}
      placeholder="write here"
      placeholderTextColor="#FFF"
    />
  </KeyboardAvoidingView>
);

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  input: {
    height: 70,
    fontSize: 18,
    textAlign: "center",
    color: "#FFF",
  },
});

export default InputFooter;
