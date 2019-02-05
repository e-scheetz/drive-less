import React, { Component } from 'react'
import { View, Content, List, ListItem, Row, Text, Left, Right, Icon, Title, Subtitle, Card, Button, Grid } from 'native-base';

import CalendarListItem from './CalendarListItem'


class CalendarList extends Component {

  getDateString(date){
    let output = new Date(date)
    return output.toDateString()
  }
  getTimeString(date){
    let output = new Date(date)
    return output.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  }
  checkLocation(loc){
    if(loc === ""){
      return "No location entered."
    }else{
      return loc
    }
  }

  render() {
    const styles = {
      titleStyle: {
        fontFamily: 'PingFangTC-Thin',
        shadowColor: 'black',
        fontSize: 30,
        textAlign: 'center'
      }
    }
    return (
      <Content style={{flex: 1}}>
        <List>
          <ListItem style={{alignItems: 'center', textAlign: 'center'}}>
            <Grid style={{alignItems: 'center', textAlign: 'center'}}>
              <Row style={{alignItems: 'center', textAlign: 'center'}}>
                <Text style={styles.titleStyle}>Week of {this.getDateString(this.props.weekof.begin)}</Text>
              </Row>
            </Grid>
          </ListItem>
          {this.props.events.map((event, idx)=>(
            <CalendarListItem demo={this.props.demo} key={idx} idx={idx} event={event} checkLocation={this.checkLocation.bind(this)} getDateString={this.getDateString.bind(this)} getTimeString={this.getTimeString.bind(this)} setSingleCardView={this.props.setSingleCardView} />
          ))}
        </List>
      </Content>
    );
  }
}

export default CalendarList