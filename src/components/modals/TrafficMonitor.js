import React, { Component } from 'react'
import { Modal, Alert } from 'react-native'
import { List, ListItem, Footer, Subtitle, Button, Left, Right, Text, Body, Grid, Row, Title, Switch } from 'native-base';
import Expo, { Constants } from 'expo'

export default class TrafficMonitor extends Component{
  render(){
    const api = "AIzaSyCIY1cpGcTYjFi68q8yYO1Y0Lj2MecDG_w"

    const windowSize = require('Dimensions').get('window')
    const deviceWidth = windowSize.width;
    const deviceHeight = windowSize.height;

    return(
      <Modal
        style={{ flex: 1 }}
        animationType="slide"
        transparent={false}
        visible={this.props.optModal.visible}>
          <List style={{paddingTop: Constants.statusBarHeight, flex: 1 }}>
            {/* {this.props.switch.status
              ? <ListItem><Switch value={this.props.switch.value} onChange={()=>this.props.flickSwitch()} /><Text>{this.props.switch.value ? "From Home" : "From Last"}</Text></ListItem>
              : null
            } */}
            {this.props.optModal.trafficList.map((time, idx)=>(
              <ListItem button onPress={()=>this.props.optChanges(time.depart)} style={{height: 80}} key={idx}>
                <Left>
                  <Grid>
                    <Row>
                      <Title>Depart at {this.props.getTimeString(time.depart)}</Title>
                    </Row>
                    <Row>
                      <Title>Arrive at {this.props.getTimeString(new Date(time.depart).getTime() + time.duration*1000)}</Title>
                    </Row>
                  </Grid>
                  
                </Left>
                <Right>
                  <Subtitle>Time in traffic: {this.props.getDurationString(time.duration)}</Subtitle>
                </Right>
              </ListItem>
            ))}
          </List>
          <Footer>
            <Left></Left>
            <Body></Body>
            <Right>
              <Button large style={{align: 'center'}} transparent onPress={() => {this.props.accept();}}><Text>Accept</Text></Button>
            </Right>
          </Footer>
      </Modal>
    )
  }
}