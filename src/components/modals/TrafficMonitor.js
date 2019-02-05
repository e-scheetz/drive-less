import React, { Component } from 'react'
import { Modal, Alert, View } from 'react-native'
import { List, ListItem, Footer, Subtitle, Button, Left, Right, Text, Body, Grid, Row, Title, Switch, Col } from 'native-base';
import Expo, { Constants } from 'expo'

export default class TrafficMonitor extends Component{
  render(){
    const api = "AIzaSyCIY1cpGcTYjFi68q8yYO1Y0Lj2MecDG_w"

    const windowSize = require('Dimensions').get('window')
    const deviceWidth = windowSize.width;
    const deviceHeight = windowSize.height;

    const styles = {
      flex: {
        flex: 1
      },
      listStyle: {
        paddingTop: Constants.statusBarHeight,
        flex: 1
      },
      titleText: {
        fontFamily: 'PingFangTC-Ultralight',
        fontSize: 20
      },
      secondaryText: {
        fontFamily: 'PingFangTC-Light',
        fontSize: 30,
        paddingTop: 8
      },
      subtitleText: {
        fontFamily: 'PingFangTC-Ultralight',
        paddingTop: 10
      },
      leftCol: {
        width: 100,
        paddingLeft: 10,
        flexDirection: 'row'
      },
      rowBorder: {
        borderBottomColor: 'black',
        borderBottomWidth: 0.5,
      }
    }

    return(
      <Modal
        style={styles.flex}
        animationType="slide"
        transparent={false}
        visible={this.props.optModal.visible}>
          <List style={styles.listStyle}>
            {/* {this.props.switch.status
              ? <ListItem><Switch value={this.props.switch.value} onChange={()=>this.props.flickSwitch()} /><Text>{this.props.switch.value ? "From Home" : "From Last"}</Text></ListItem>
              : null
            } */}
            {this.props.optModal.trafficList.map((time, idx)=>(
              <ListItem button onPress={()=>this.props.optChanges(time.depart)} style={{height: 80}} key={idx}>
                <Grid>
                  <Row>
                    <Col style={styles.leftCol}>
                      <View>
                        <Text style={styles.secondaryText}>{this.props.getDurationString(time.duration).slice(0,2)}</Text>
                      </View>
                      <View>
                        <Text style={styles.subtitleText}>min</Text>
                      </View>
                    </Col>
                    <Col>
                      <Row style={styles.rowBorder}>
                        <Text style={styles.titleText}>Depart at {this.props.getTimeString(time.depart)}</Text>
                      </Row>
                      <Row>
                        <Text style={styles.titleText}>Arrive at {this.props.getTimeString(new Date(time.depart).getTime() + time.duration*1000)}</Text>
                      </Row>
                    </Col>
                    <Col style={{width: 115}}></Col>
                  </Row>
                </Grid>
              </ListItem>
            ))}
          </List>
          <Footer>
            <Left></Left>
            <Body></Body>
            <Right style={{alignItems: 'center'}}>
              <Button large transparent onPress={() => {this.props.accept();}}><Text>Accept</Text></Button>
            </Right>
          </Footer>
      </Modal>
    )
  }
}