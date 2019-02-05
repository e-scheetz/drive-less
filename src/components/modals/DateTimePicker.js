import React, { Component } from 'react'
import { DatePickerIOS, Modal, View } from 'react-native'
import { Button, Text, Body, Icon } from 'native-base';

export default class DateTimePicker extends Component{
  render(){
    const windowSize = require('Dimensions').get('window')
    const deviceWidth = windowSize.width;
    const deviceHeight = windowSize.height;
    return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.dateTimeModal.visible}>
        <View style={{marginTop: deviceHeight/5*3, backgroundColor: 'white'}}>
          <View>
            <DatePickerIOS
              date={new Date(this.props.dateTimeModal.date) || new Date()}
              onDateChange={this.props.dateChange}
              />
            <Body>
              <Button small bordered rounded onPress={() => {this.props.closeModal();}}><Icon style={{height: 20}} name='md-checkmark-circle-outline' /></Button>
            </Body>
          </View>
        </View>
      </Modal>
    )
  }
}