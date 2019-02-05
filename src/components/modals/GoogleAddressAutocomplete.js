import React, { Component } from 'react'
import { Modal, View, Alert } from 'react-native'
import { Footer, Button, Left, Right, Text, Body } from 'native-base';
import Expo, { Constants, PROVIDER_GOOGLE, Location, Marker } from 'expo'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MapView, { AnimatedRegion, Animated } from 'react-native-maps'

export default class GoogleAddressAutocomplete extends Component{
  render(){
    // expects props : { locationModal: { visible }, setLocation(), defaultReturn(), closeModal() }
    const api = "AIzaSyCIY1cpGcTYjFi68q8yYO1Y0Lj2MecDG_w"

    const windowSize = require('Dimensions').get('window')
    const deviceWidth = windowSize.width;
    const deviceHeight = windowSize.height;

    return(
      <Modal
        style={{ flex: 1 }}
        animationType="slide"
        transparent={false}
        visible={this.props.locationModal.visible}>
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
                this.props.setLocation(data.description)
                // this.getCoordinates(data.description)
              }}
              getDefaultValue={() => {
                return this.props.defaultReturn; // text input default value
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
                  paddingTop: Constants.statusBarHeight*2+5,
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
          <Right style={{alignItems: 'center'}}>
            <Button large transparent onPress={() => {this.props.closeModal();}}><Text>Accept</Text></Button>
          </Right>
        </Footer>
      </Modal>
    )
  }
}