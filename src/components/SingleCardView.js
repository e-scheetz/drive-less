import React, { Component } from 'react'
import { DatePickerIOS, Modal, TouchableHighlight, View, Alert } from 'react-native'
import { List, ListItem, ListView, Footer, Item, Subtitle, Form, Button, Label, Input, DatePicker, Left, Right, Text, Body, Icon, Textarea, Grid, Row, Col, Title, Content } from 'native-base';
import Expo, { Constants, PROVIDER_GOOGLE, Location, Marker } from 'expo'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { AnimatedRegion, Animated } from 'react-native-maps'

import FooterBar from './FooterBar.js'

const homePlace = {
  description: 'Home',
  geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
};
const workPlace = {
  description: 'Work',
  geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
};


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
      locationModal: false,
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
      optModal: false,
      trafficList: [],
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
      locationModal: false
    })
    this.gMatrixFetch(e)
    this.optimize(e)
  }

  onLocationPressHandler(){
    this.setState({
      ...this.state,
      locationModal: true
    })
  }

  closeLocModal(){
    this.setState({
      ...this.state,
      locationModal: false
    })
  }

  closeOptModal(){
    this.setState({
      ...this.state,
      locationModal: false
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
      optModal: !this.state.optModal
    })
  }

  async optimize(destination){
    let newDateObj = new Date(new Date(this.state.startDate).getTime() - 4*30*60000)
    console.log(newDateObj)
    let dateList = []
    for(let i = 0; i < 9; i++){
      dateList.push(new Date(newDateObj))
      newDateObj = new Date(newDateObj.getTime() + 30*60000)
    }
    const newState = await this.recursiveAPIFetch(dateList, destination)
    this.setState({
      ...this.state,
      trafficList: newState
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
      optModal: false
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
            <Item style={{marginTop: 250}}>
              <Left>
                <Button onPress={this.props.back}><Text>Cancel</Text></Button>
              </Left>
              <Right>
                <Button onPress={()=>this.saveChanges()}><Text>Save</Text></Button>
              </Right>
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
            style={{ flex: 1 }}
            animationType="slide"
            transparent={false}
            visible={this.state.locationModal}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
              {/* Expo.Constants.manifest.ios.config.googleMapsApiKey */}
              <View style={{ paddingTop: Constants.statusBarHeight, flex: 1 }}>
                <GooglePlacesAutocomplete
                  provider={PROVIDER_GOOGLE}
                  placeholder="Search"
                  minLength={2} // minimum length of text to search
                  autoFocus={true}
                  returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                  listViewDisplayed={true} // true/false/undefined
                  fetchDetails={false}
                  renderDescription={row => row.description} // custom description render
                  onPress={(data, details = null) => {
                    // console.log(data);
                    // console.log(details)
                    this.setLocation(data.description)
                    // this.getCoordinates(data.description)
                  }}
                  getDefaultValue={() => {
                    return this.state.location; // text input default value
                  }}
                  query={{
                    // available options: https://developers.google.com/places/web-service/autocomplete
                    key: api,
                    language: 'en', // language of the results
                    types: 'geocode', // default: 'geocode'
                  }}
                  styles={{
                    description: {
                      fontWeight: 'bold',
                    },
                    predefinedPlacesDescription: {
                      color: '#1faadb',
                    },
                    listView: {
                      paddingTop: Constants.statusBarHeight,
                      position: "absolute",
                      height: deviceHeight+Constants.statusBarHeight,
                      width: deviceWidth
                    },
                  }}
                  currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
                  currentLocationLabel="Current location"
                  nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                  GoogleReverseGeocodingQuery={{
                    // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                  }}
                  GooglePlacesSearchQuery={{
                    // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                    rankby: 'distance',
                    types: 'food',
                  }}
                  filterReverseGeocodingByTypes={[
                    'locality',
                    'administrative_area_level_3',
                  ]} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                  // predefinedPlaces={[homePlace, workPlace]}
                  debounce={200}
                />
              </View>
              {/* <MapView 
                initialRegion={this.state.coordinate}
                style={{flex: 1, height: 300, marginTop: 300}}
              >
                <MapView.Marker.Animated
                  ref={marker => { this.marker = marker }}
                  coordinate={this.state.animatedRegion}
                />
              </MapView> */}
              <Footer>
                <Left></Left>
                <Body></Body>
                <Right>
                  <Button large style={{align: 'center'}} transparent onPress={() => {this.closeLocModal();}}><Text>Accept</Text></Button>
                </Right>
              </Footer>
          </Modal>
          <Modal
            style={{ flex: 1 }}
            animationType="slide"
            transparent={false}
            visible={this.state.optModal}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
              <List style={{paddingTop: Constants.statusBarHeight, flex: 1 }}>
                {this.state.trafficList.map((time, idx)=>(
                  <ListItem button onPress={()=>this.optChanges(time.depart)} style={{height: 80}} key={idx}>
                    <Left>
                      <Grid>
                        <Row>
                          <Title>Depart at {this.getTimeString(time.depart)}</Title>
                        </Row>
                        <Row>
                          <Title>Arrive at {this.getTimeString(new Date(time.depart).getTime() + time.duration*1000)}</Title>
                        </Row>
                      </Grid>
                      
                    </Left>
                    <Right>
                      <Subtitle>Time in traffic: {this.getDurationString(time.duration)}</Subtitle>
                    </Right>
                  </ListItem>
                ))}
              </List>
              <Footer>
                <Left></Left>
                <Body></Body>
                <Right>
                  <Button large style={{align: 'center'}} transparent onPress={() => {this.openOptModal();}}><Text>Accept</Text></Button>
                </Right>
              </Footer>
          </Modal>
        </Content>
        <FooterBar duration={this.getDurationString(this.state.driveDuration)} open={this.openOptModal.bind(this)} />
      </View>
      
    )
  }
}

export default singleCardView