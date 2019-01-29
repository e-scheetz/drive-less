import React, { Component } from 'react'
import { DatePickerIOS, Modal, TouchableHighlight, View, Alert } from 'react-native'
import { Footer, Item, Subtitle, Form, Button, Label, Input, DatePicker, Left, Right, Text, Body, Icon, Textarea } from 'native-base';
import { MapView } from 'expo'


class singleCardView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allDay: this.props.card.allDay,
      calendarId: this.props.card.calendarId,
      creationDate: this.props.card.creationDate,
      endDate: this.props.card.endDate,
      id: this.props.card.id,
      isDetached: this.props.card.isDetached,
      lastModifiedDate: this.props.card.lastModifiedDate,
      location: this.props.card.location,
      notes: this.props.card.notes,
      originalStartDate: this.props.card.originalStartDate,
      recurrenceRule: this.props.card.recurrenceRule,
      startDate: this.props.card.startDate,
      status: this.props.card.status,
      timeZone: this.props.card.timeZone,
      title: this.props.card.title,
      dateTimeModal: {
        visible: false,
        date: '',
        modifying: ''
      },
      locationModal: false
    }
  }

  getDateString(date){
    let output = new Date(date)
    return output.toDateString('dddd MMMM D Y')
  }
  getTimeString(date){
    let output = new Date(date)
    return output.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }
  checkLocation(loc){
    if(loc === ""){
      return "No location entered... :("
    }else{
      return loc
    }
  }

  dateChange(date){
    this.setState({
      ...this.state,
      [this.state.dateTimeModal.modifying]: new Date(date),
      dateTimeModal: {
        ...this.state.dateTimeModal,
        date: date
      }
    })
  }
  closeModal(){
    this.setState({
      ...this.state,
      dateTimeModal: {
        visible: false,
        date: '',
        modifying: ''
      }
    })
  }
  openModalStart(){
    this.setState({
      ...this.state,
      dateTimeModal: {
        visible: true,
        date: this.state.startDate,
        modifying: 'startDate'
      }
    })
  }
  openModalEnd(){
    this.setState({
      ...this.state,
      dateTimeModal: {
        visible: true,
        date: this.state.endDate,
        modifying: 'endDate'
      }
    })
  }

  onTitleChangeHandler = (e) => {
    this.setState({
      ...this.state,
      title: e
    })
  }

  onLocationChangeHandler = (e) => {
    this.setState({
      ...this.state,
      location: e,
      locationModal: true
    })
  }

  closeLocModal(){
    this.setState({
      ...this.state,
      locationModal: false
    })
  }

  render() {
    return (
      <View>
        <Form>
          <Item floatingLabel>
            <Label>Title</Label>
            <Input onChangeText={this.onTitleChangeHandler} value={this.state.title} />
          </Item>
          <Item style={{height: 60}}>
            <Label>Location</Label>
            <Input onChangeText={this.onLocationChangeHandler} value={this.state.location} />
          </Item>
          <Item style={{height: 60}}>
            <Left>
              <Text>{this.getDateString(this.state.startDate)}</Text>
            </Left>
            <Body>
              <Text>{this.getTimeString(this.state.startDate)}</Text>
            </Body>
            <Right>
              <Button transparent onPress={()=>this.openModalStart()}><Icon name="ios-open"></Icon></Button>
            </Right>
          </Item>
          <Item style={{height: 60}} button onPress={()=>this.openModalEnd}>
            <Left>
              <Text>{this.getDateString(this.state.endDate)}</Text>
            </Left>
            <Body>
              <Text>{this.getTimeString(this.state.endDate)}</Text>
            </Body>
            <Right>
            <Button transparent onPress={()=>this.openModalEnd()}><Icon name="ios-open"></Icon></Button>
            </Right>
          </Item>
          <Item>
            <Label>Notes</Label>
            <Textarea style={{width: 325}} rowSpan={5} value={this.state.notes}/>
          </Item>
        </Form>
        {/* Modal for date-time rotating selector */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.dateTimeModal.visible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{marginTop: 425}}>
            <View>
              <DatePickerIOS
                date={new Date(this.state.dateTimeModal.date) || new Date()}
                onDateChange={this.dateChange.bind(this)}
                />
              <Body>
                <Button small rounded onPress={() => {this.closeModal();}}><Text>Accept</Text></Button>
              </Body>
            </View>
          </View>
        </Modal>
        {/* Modal for selecting places */}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.locationModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
            <MapView
              style={{ alignSelf: 'stretch', height: 300, marginTop: 380 }}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            />
            <Footer>
              <Left></Left>
              <Body></Body>
              <Right>
                <Button large style={{align: 'center'}} transparent onPress={() => {this.closeLocModal();}}><Text>Accept</Text></Button>
              </Right>
            </Footer>
        </Modal>
      </View>
    )
  }
}

export default singleCardView