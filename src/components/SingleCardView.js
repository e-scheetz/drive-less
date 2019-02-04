import React, { Component } from 'react'
import { View } from 'react-native'
import { Item, Form, Button, Label, Input, Left, Right, Text, Body, Icon, Textarea, Content } from 'native-base';
import { Constants, Location } from 'expo'
import { AnimatedRegion } from 'react-native-maps'

import FooterBar from './FooterBar.js'
import DateTimePicker from './modals/DateTimePicker.js'
import GoogleAddressAutocomplete from './modals/GoogleAddressAutocomplete.js'
import TrafficMonitor from './modals/TrafficMonitor.js'


class SingleCardView extends Component {
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
      locationModal: {
        visible: false,
        address: ''
      },
      coordinate: {
        latitude: 40.016759,
        longitude: -105.28172,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },
      animatedRegion: new AnimatedRegion({
        latitude: 40.016759,
        longitude: -105.28172,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      }),
      optModal: {
        visible: false,
        trafficList: []
      }
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
      locationModal: {
        visible: true,
        address: e
      }
    })
  }

  onNotesChangeHandler = (e) => {
    this.setState({
      ...this.state,
      notes: e
    })
  }

  setLocation=(e)=>{
    this.setState({
      ...this.state,
      location: e,
      locationModal: {
        visible: false,
        address: ''
      }
    })
    this.gMatrixFetch(e)
    this.optimize(e)
  }

  onLocationPressHandler(){
    this.setState({
      ...this.state,
      locationModal: {
        visible: true,
        address: ''
      }
    })
  }

  closeLocModal(){
    this.setState({
      ...this.state,
      locationModal: {
        visible: false,
        address: ''
      }
    })
  }

  closeOptModal(){
    this.setState({
      ...this.state,
      locationModal: {
        visible: false,
        address: ''
      }
    })
  }

  async getCoordinates(addressStr){
    const coordinate = await Location.geocodeAsync(addressStr)
    const newCoordinate = {
      ...this.state.coordinate,
      ...coordinate
    }
    const animatedRegion = new AnimatedRegion(newCoordinate)
    this.setState({
      ...this.state,
      coordinate: newCoordinate,
      animatedRegion: animatedRegion
    })
  }

  async gMatrixFetch(destination){
    const url = await this.props.apiCall(destination, this.state.id)
    const response = await fetch(url)
    const json = await response.json()
    this.setState({
      ...this.state,
      driveDuration: json.rows[0].elements[0].duration.value
    })
    return json
  }

  openOptModal(){
    this.setState({
      ...this.state,
      optModal: {
        ...this.state.optModal,
        visible: !this.state.optModal.visible
      }
    })
  }

  async optimize(destination){
    let newDateObj = new Date(new Date(this.state.startDate).getTime() - 3*30*60000)
    console.log(newDateObj)
    let dateList = []
    for(let i = 0; i < 7; i++){
      dateList.push(new Date(newDateObj))
      newDateObj = new Date(newDateObj.getTime() + 30*60000)
    }
    const newState = await this.recursiveAPIFetch(dateList, destination)
    this.setState({
      ...this.state,
      optModal: {
        ...this.state.optModal,
        trafficList: newState
      }
    })
  }
  async recursiveAPIFetch(dateList, destination, result = []){
    if(dateList[0]){
      const time = new Date(dateList[0]).getTime()/1000
      const url = await this.props.apiCall(destination, this.state.id, time)
      const response = await fetch(url)
      const json = await response.json()
      console.log(json)
      const duration = json.rows[0].elements[0].duration.value
      const departure = await new Date(new Date(time*1000).getTime() - duration*1000)
      result.push({"depart": departure, "duration": duration})
      return await this.recursiveAPIFetch(dateList.slice(1,dateList.length), destination, result)
    }else{
      return result
    }
  }
  getDurationString(seconds){
    const minutes = seconds / 60
    const hours = minutes / 60
    const days = hours / 24

    let result = ''

    if(days > 1){
      const dayObj = {
        days: Math.floor(days).toString(),
        hours: Math.floor(hours-Math.floor(days)*24).toString(),
        minutes: Math.ceil(minutes-Math.floor(days)*24*60-(Math.floor(hours-Math.floor(days)*24))).toString(),
      }
      result = dayObj.days + ' d, ' + dayObj.hours + ' hrs, ' + dayObj.minutes + ' min'
    }else if (hours > 1){
      const hourObj = {
        hours: Math.floor(hours).toString(),
        minutes: Math.ceil(minutes-Math.floor(hours)*60).toString(),
      }
      result = hourObj.hours + ' hrs, ' + hourObj.minutes + ' min'
    }else{
      const minObj = {
        minutes: Math.ceil(minutes).toString(),
      }
      result = minObj.minutes + ' min'
    }
    return result
  }

  saveChanges(){
    const details = {title: this.state.title, location: this.state.location, startDate: this.state.startDate, endDate: this.state.endDate, notes: this.state.notes}
    const recurringEventOptions = {instanceStartDate: this.state.originalStartDate, futureEvents: false}
    this.props.saveChanges({id: this.state.id, details: details, recurringEventOptions: recurringEventOptions})
  }

  optChanges(departDate){
    const newNote = `Depart by ${this.getDateString(departDate)} at ${this.getTimeString(departDate)}\n\n${this.state.notes}`
    this.setState({
      ...this.state,
      notes: newNote,
      optModal: {
        ...this.state.optModal,
        visible: false
      }
    })
  }

  render() {
    const api = "AIzaSyCIY1cpGcTYjFi68q8yYO1Y0Lj2MecDG_w"
    // const homePlace = { description: 'Home', geometry: { location: { lat: 48.8152937, lng: 2.4597668 } }};
    // const workPlace = { description: 'Work', geometry: { location: { lat: 48.8496818, lng: 2.2940881 } }};
    const windowSize = require('Dimensions').get('window')
    const deviceWidth = windowSize.width;
    const deviceHeight = windowSize.height;
    return (
      <View style={{flex: 1}}>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Title</Label>
              <Input onChangeText={this.onTitleChangeHandler} value={this.state.title} />
            </Item>
            <Item floatingLabel style={{height: 60}} onPress={()=>this.onLocationPressHandler()} >
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
              <Textarea onChangeText={this.onNotesChangeHandler} style={{width: 325}} rowSpan={5} value={this.state.notes}/>
            </Item>
            <Item style={{marginTop: 185}}>
              <Left>
                <Button onPress={this.props.back}><Text>Cancel</Text></Button>
              </Left>
              <Right>
                <Button onPress={()=>this.saveChanges()}><Text>Save</Text></Button>
              </Right>
            </Item>
          </Form>
          {/* Modal for date-time rotating selector */}
          <DateTimePicker dateTimeModal={this.state.dateTimeModal} dateChange={this.dateChange.bind(this)} closeModal={this.closeModal.bind(this)} />
          {/* Modal for selecting places */}
          <GoogleAddressAutocomplete locationModal={this.state.locationModal} setLocation={this.setLocation.bind(this)} defaultReturn={this.state.location} closeModal={this.closeLocModal.bind(this)} />
          {/* Modal for selecting departure time based off traffic */}
          <TrafficMonitor optModal={this.state.optModal} getTimeString={this.getTimeString.bind(this)} getDurationString={this.getDurationString.bind(this)} switch={this.props.switch} flickSwitch={this.props.flickSwitch.bind(this)} optChanges={this.optChanges.bind(this)} accept={this.openOptModal.bind(this)} />
        </Content>
        <FooterBar duration={this.getDurationString(this.state.driveDuration)} open={this.openOptModal.bind(this)} />
      </View>
      
    )
  }
}

export default SingleCardView