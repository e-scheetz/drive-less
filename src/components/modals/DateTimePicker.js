import React, { Component } from 'react'
import { DatePickerIOS, Modal, View, Alert } from 'react-native'
import { Button, Text, Body } from 'native-base';

export default class DateTimePicker extends Component{
  render(){
    return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.dateTimeModal.visible}>
        <View style={{marginTop: 435}}>
          <View>
            <DatePickerIOS
              date={new Date(this.props.dateTimeModal.date) || new Date()}
              onDateChange={this.props.dateChange}
              />
            <Body>
              <Button small rounded onPress={() => {this.props.closeModal();}}><Text>Accept</Text></Button>
            </Body>
          </View>
        </View>
      </Modal>
    )
  }
}