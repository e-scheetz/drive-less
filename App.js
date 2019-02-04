import React from 'react';
import { Permissions, Calendar, Notifications, Location } from 'expo'
import { StyleSheet, Text, View, AsyncStorage } from 'react-native';
import { Root, Container, Header, Content, Footer } from 'native-base'

import HeaderBar from './src/components/HeaderBar.js'
import CalendarList from './src/components/CalendarList.js'
import SingleCardView from './src/components/SingleCardView.js'

import Overview from './src/components/modals/Overview.js'
import GoogleAddressAutocomplete from './src/components/modals/GoogleAddressAutocomplete.js'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      calendarsList: [],
      calendarIndex: [],
      events: [],
      weekViewed: {},
      singleCardView: false,
      home: '',
      api: "AIzaSyCIY1cpGcTYjFi68q8yYO1Y0Lj2MecDG_w",
      optModal: false,
      optionsModal: {
        visible: false,
        homeAutocomplete: {
          visible: false
        },
      },
      switch: {
        status: false,
        value: false,
      }
    }
  }

  async componentDidMount() {
    await this.reqPerms()
    await this.checkPerms()
    await this.getCalIds()
    await this.getEvents()
    await this.retrieveHome()
  }

  async reqPerms(){
    await Permissions.askAsync('calendar')
    await Permissions.askAsync('notifications')
    await Permissions.askAsync('location')
    await Location.requestPermissionsAsync()
  }
  async checkPerms(){
    const { status, permissions } = await Permissions.getAsync(Permissions.CALENDAR, Permissions.NOTIFICATIONS);
    if (status !== 'granted') {
      alert(status);
    }
  }
  async getCalIds(){
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT)
    const newState = {calendarsList: [], calendarsIndex: []}
    calendars.map((cal, idx)=>{
      newState.calendarsList[idx] = cal.id
      newState.calendarsIndex[idx] = {title: cal.title, id: cal.id}
    })
    this.setState({
        ...this.state,
      calendarsList: newState.calendarsList,
      calendarIndex: newState.calendarsIndex
    })
  }
  async getEvents(){
    let day = new Date()
    day.setHours(0,0,0,0)
    day.setDate(day.getDate() - day.getDay())
    let end = new Date(day)
    end.setDate(end.getDate() + 7)
    const events = await Calendar.getEventsAsync(this.state.calendarsList, day, end)
    this.setState({
        ...this.state,
      events: events,
      weekViewed: {begin:day,end:end}
    })
  }

  // added a function 'back' that returns the app to the main 'week of' screen
  back(){
    this.setSingleCard()
  }

  setSingleCard(calEvent){
    if(calEvent){
      this.setState({
        ...this.state,
        singleCardView: calEvent
      })
    }else{
      this.setState({
        ...this.state,
        singleCardView: false
      })
    }
  }

  // will need to adjust this function to set up for multiple destinations and to try to optimize the entire day at once.
  async makeGMatrixAPICall(destination, id, time){
    const route = {originAddresses: [this.getFirstPreviousAddress(id)], destinationAddresses: [destination]}
    const url = this.constructUrl(route, id, time)

    // const apiCallResponse = this.gMatrixFetch(url)

    // return apiCallResponse
    return url
  }

  // this function needs updating when allowing user to enter their home / work addresses
  getFirstPreviousAddress(id){
    const event = this.state.events.filter((event)=>event.id===id)[0]
    const idx = this.state.events.indexOf(event)
    for(let i = idx; i > -1; i--){
      // checks each event for a location
      if(this.state.events[i].location !== ''){
        // checks location is not the same as itself
        if(this.state.events[i].location == event.location){
          // if location is itself, return home, clear switch
          this.clearSwitch()
          return this.state.home
        }else{
          // if location is not itself
          if(this.state.switch.status === false){
            // if switch is off, turn on the switch
            // this.addSwitch()
          }
          if(this.state.switch.value){
            // if switch.value is true, return home
            return this.state.home
          }else{
            // else return last location
            // return this.state.events[i].location
            return this.state.home
          }
        }
      }else if(i===0){
        this.clearSwitch()
        return this.state.home
      }
    }
  }
  
  clearSwitch(){
    this.setState({
      ...this.state,
      switch: {
        status: false,
        value: false,
      }
    })
  }
  addSwitch(){
    this.setState({
      ...this.state,
      switch: {
        status: true,
        value: false,
      }
    })
  }
  flickSwitch(){
    this.setState({
      ...this.state,
      switch: {
        ...this.state.switch,
        value: !this.state.switch.value,
      }
    })
    this.forceUpdate()
  }

  constructUrl(obj, id, time){
    const startDate = this.state.events.filter((event)=>event.id===id)[0].startDate
    const defaultArrivalTime = new Date(startDate).getTime()/1000

    let departure

    const { originAddresses, destinationAddresses } = obj
    const url = 'https://maps.googleapis.com/maps/api/distancematrix/json?'
    const originStr = this.parseAddresses(originAddresses, 0)
    const destinationStr = this.parseAddresses(destinationAddresses, 1)
    if(time){
      const usrSpecifiedArrival = new Date(time).getTime()/1000
      departure = `arrival_time=${usrSpecifiedArrival}`
    }else{
      departure = `arrival_time=${defaultArrivalTime}`
    }
    const key = `key=${this.state.api}`
    const trafficModel = `traffic_model=pessimistic`

    const result = url + '&' + originStr + '&' + destinationStr + '&' + key + '&' + departure
    console.log(result)
    return result
  }
  parseAddresses(arr, num){
    const addStr = ['origins=','destinations=']
    let result = addStr[num]
    arr.map((elem)=>{
      elem.split(' ').map((word)=>{
        word.includes(',')
          ? result += `${word.slice(0,word.length-1)}+`
          : result += `${word}+`
      })
      result = result.slice(0, result.length-1)
      result += '|'
    })
    return result.slice(0, result.length-1)
  }

  async gMatrixFetch(url){
    const response = await fetch(url)
    const json = await response.json()
    return json
  }

  saveChanges(obj){
    const { id, details, recurringEventOptions } = obj
    Calendar.updateEventAsync(id, details, recurringEventOptions)
    this.back()
    this.getEvents()
  }

  openCloseOptionsModal(){
    this.setState({
      ...this.state,
      optionsModal: {
        ...this.state.optionsModal,
        visible: !this.state.optionsModal.visible
      }
    })
  }
  openCloseHomeAutocompleteModal(){
    this.setState({
      optionsModal:{
        visible: !this.state.optionsModal.visible,
        homeAutocomplete: {
          visible: !this.state.optionsModal.homeAutocomplete.visible
        }
      }
    })
  }

  setHome=(e)=>{
    this.setState({
      ...this.state,
      home: e,
      optionsModal:{
        visible: !this.state.optionsModal.visible,
        homeAutocomplete: {
          visible: !this.state.optionsModal.homeAutocomplete.visible
        }
      }
    })
    this.storeHome(e)
  }

  // Async Storage
  async storeHome (value) {
    try {
      await AsyncStorage.setItem('HOME', value);
    } catch (error) {
      // Error saving data
    }
  }
  async retrieveHome(){
    try {
      const value = await AsyncStorage.getItem('HOME');
      if (value !== null) {
        // We have data!!
        console.log(value)
        this.setState({
          ...this.state,
          home: value
        })
      }
    } catch (error) {
      // Error retrieving data
    }
  }

  render() {
    return (
      <Root>
        <Container>
          <HeaderBar singleCardView={this.state.singleCardView} back={this.back.bind(this)} options={this.openCloseOptionsModal.bind(this)} />
          {this.state.singleCardView
            ? <SingleCardView switch={this.state.switch} flickSwitch={this.flickSwitch.bind(this)} saveChanges={this.saveChanges.bind(this)} back={this.back.bind(this)} apiCall={this.makeGMatrixAPICall.bind(this)} card={this.state.singleCardView}/>
            : <CalendarList events={this.state.events} weekof={this.state.weekViewed} setSingleCardView={this.setSingleCard.bind(this)} /> }
            <Overview optionsModal={this.state.optionsModal} handleChangeText={this.setHome.bind(this)} editHome={this.openCloseHomeAutocompleteModal.bind(this)} home={this.state.home} accept={this.openCloseOptionsModal.bind(this)} />
            <GoogleAddressAutocomplete locationModal={this.state.optionsModal.homeAutocomplete} setLocation={this.setHome.bind(this)} defaultReturn={this.state.home} closeModal={this.openCloseHomeAutocompleteModal.bind(this)} />
        </Container>
      </Root>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
