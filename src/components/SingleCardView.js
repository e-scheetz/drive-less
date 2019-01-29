import React, { Component } from 'react'
import { DatePickerIOS, Modal, TouchableHighlight, View, Alert } from 'react-native'
import { ListView, Footer, Item, Subtitle, Form, Button, Label, Input, DatePicker, Left, Right, Text, Body, Icon, Textarea } from 'native-base';
import Expo, { MapView, Constants, PROVIDER_GOOGLE, Location, Marker, AnimatedRegion } from 'expo'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

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
      coordinate: new AnimatedRegion({
        latitude: 40.0166,
        longitude: 105.2817,
      }),
    }
  }

  componentWillReceiveProps(nextProps) {
    const duration = 500
  
    if (this.props.coordinate !== nextProps.coordinate) {
      if (Platform.OS === 'android') {
        if (this.marker) {
          this.marker._component.animateMarkerToCoordinate(
            nextProps.coordinate,
            duration
          );
        }
      } else {
        this.state.coordinate.timing({
          ...nextProps.coordinate,
          duration
        }).start();
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
      locationModal: true
    })
  }

  onLocationPressHandler(){
    if(this.state.location.length > 2){
      this.setState({
        ...this.state,
        locationModal: true
      })
    }
  }

  closeLocModal(){
    this.setState({
      ...this.state,
      locationModal: false
    })
  }

  async getCoordinates(addressStr){
    const coordinates = await Location.geocodeAsync(addressStr)
    const animRe = new AnimatedRegion(coordinates)
    this.setState({
      ...this.state,
      coordinates: animRe
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
      <View>
        <Form>
          <Item floatingLabel>
            <Label>Title</Label>
            <Input onChangeText={this.onTitleChangeHandler} value={this.state.title} />
          </Item>
          <Item style={{height: 60}} onPress={()=>this.onLocationPressHandler()} >
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
                autoFocus={false}
                returnKeyType={'search'} // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                listViewDisplayed={true} // true/false/undefined
                fetchDetails={false}
                renderDescription={row => row.description} // custom description render
                onPress={(data, details = null) => {
                  console.log(data);
                  console.log(details)
                  this.onLocationChangeHandler(data.description)
                  this.getCoordinates(data.description)
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
            <MapView
              style={{ alignSelf: 'stretch', height: 300, marginTop: 380 }}
              initialRegion={{
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              {this.state.coordinates
                ? <MapView.Marker.Animated
                    ref={marker => { this.marker = marker }}
                    coordinate={this.state.coordinate}
                  />
                : null
              }
            </MapView>
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