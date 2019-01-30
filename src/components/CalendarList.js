import React, { Component } from 'react'
import { View, Content, List, ListItem, Row, Text, Left, Right, Icon, Title, Subtitle, Card, Button } from 'native-base';


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
    return (
      <Content>
        <List>
          <Card>
            <Title>Week of {this.getDateString(this.props.weekof.begin)}</Title>
          </Card>
          {this.props.events.map((event, idx)=>(
            <Card key={idx}>
              <ListItem>
                <Title>{event.title}</Title>
              </ListItem>
              <ListItem>
                <Subtitle>{this.checkLocation(event.location)}</Subtitle>
              </ListItem>
              <ListItem>
                <Left>
                  <Row>
                    <Subtitle>Start: {this.getDateString(event.startDate)}</Subtitle>
                  </Row>
                  <Row>
                    <Subtitle>End: {this.getDateString(event.endDate)}</Subtitle>
                  </Row>
                </Left>
                <Right>
                  <Button onPress={()=>this.props.setSingleCardView(event)} transparent>
                    <Icon name="arrow-forward" />
                  </Button>
                </Right>
              </ListItem>
            </Card>
          ))}
        </List>
      </Content>
    );
  }
}

export default CalendarList