import React from 'react';
import { Permissions, Calendar, Notifications } from 'expo'
import { StyleSheet, Text, View } from 'react-native';
import { Root, Container, Header, Content, Footer } from 'native-base'

import HeaderBar from './src/components/HeaderBar.js'
import FooterBar from './src/components/FooterBar.js'
import CalendarList from './src/components/CalendarList.js'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      calendarsList: [],
      calendarIndex: [],
      events: [],
      weekViewed: {}
    }
  }

  async componentDidMount() {
    await this.reqPerms()
    await this.checkPerms()
    await this.getCalIds()
    await this.getEvents()
  }

  async reqPerms(){
    await Permissions.askAsync('calendar')
    await Permissions.askAsync('notifications')
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
      events: events,
      weekViewed: {begin:day,end:end}
    })
  }

  setSingleCard(event){
    
  }

  render() {
    return (
      <Root>
        <Container>
          <Header>
            <HeaderBar />
          </Header>
          <Content>
            <CalendarList events={this.state.events} weekof={this.state.weekViewed} />
          </Content>
          <Footer>
            <FooterBar />
          </Footer>
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
