import React, { Component } from 'react'
import { View, Content, List, ListItem, Row, Text, Left, Right, Icon, Title, Subtitle, Card, Button, Grid, Col } from 'native-base';
import { LinearGradient } from 'expo'


class CalendarList extends Component {

  getDateString(date){
    let output = new Date(date)
    return output.toDateString()
  }
  checkLocation(loc){
    if(loc === ""){
      return "No location entered... :("
    }else{
      return loc
    }
  }

  render() {
    const styles = {
      titleStyle: {
        fontFamily: 'PingFangTC-Thin',
        shadowColor: 'black',
        fontSize: 24,
        alignItems: 'center'
      },
      eventTitle: {
        fontFamily: 'PingFangTC-Light',
        fontSize: 20,
      },
      eventDetails: {
        fontFamily: 'PingFangTC-Ultralight',
        fontSize: 18,
        textAlign: 'center',
      },
      eventDetailsBold: {
        fontFamily: 'PingFangTC-Light',
        fontSize: 18,
      },
      background: {
        /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#1e5799+0,7db9e8+100&1+0,0+100;Blue+to+Transparent */
        background: '-moz-linear-gradient(top, rgba(30,87,153,1) 0%, rgba(125,185,232,0) 100%)', /* FF3.6-15 */
        background: '-webkit-linear-gradient(top, rgba(30,87,153,1) 0%,rgba(125,185,232,0) 100%)', /* Chrome10-25,Safari5.1-6 */
        background: 'linear-gradient(to bottom, rgba(30,87,153,1) 0%,rgba(125,185,232,0) 100%)', /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
        filter: `progid:DXImageTransform.Microsoft.gradient( startColorstr='#1e5799', endColorstr='#007db9e8',GradientType=0 )`, /* IE6-9 */
      }
    }
    return (
      <Card key={this.props.idx}>
        <LinearGradient
            colors={['transparent']}
            style={{ alignItems: 'center', borderRadius: 5 }}>
          <ListItem button onPress={()=>this.props.setSingleCardView(this.props.event)} >
            <Text style={styles.eventTitle}>{this.props.event.title}</Text>
          </ListItem>
          <ListItem style={{maxWidth: 300}} button onPress={()=>this.props.setSingleCardView(this.props.event)} >
            <Text style={styles.eventDetails}>{this.props.checkLocation(this.props.event.location)}</Text>
          </ListItem>
          <ListItem button onPress={()=>this.props.setSingleCardView(this.props.event)} >
            <Text style={styles.eventDetailsBold}>Duration: </Text><Text style={styles.eventDetails}>{this.props.demo.listEstimates[this.props.idx].toString()} min</Text>
          </ListItem>
        </LinearGradient>
      </Card>
    );
  }
}

export default CalendarList