import React, { Component } from 'react'
import { Modal, Alert, View } from 'react-native'
import { CardItem, Card, Form, List, ListItem, Item, Input, Label, Footer, Subtitle, Button, Left, Right, Text, Body, Grid, Row, Col, Icon } from 'native-base';
import Expo, { Constants, LinearGradient } from 'expo'

export default class Overview extends Component{
  constructor(props) {
    super(props)
    this.state = {
      home: this.props.home,
      locationModal: {
        visible: false,
        address: ''
      }
    }
  }

  onLocationPressHandler(){
    this.setState({
      ...this.state,
      locationModal: {
        visible: true
      }
    })
  }

  render(){
    // Expected inputs : { optionsModal: { visible, home }, onLocationPressHandler(), onLocationChangeHandler(), closeOptionsModal() } = this.props
    const windowSize = require('Dimensions').get('window')
    const deviceWidth = windowSize.width;
    const deviceHeight = windowSize.height;

    const styles = {
      title: {
        fontFamily: 'PingFangTC-Ultralight',
        shadowColor: 'black',
        fontSize: 80,
        textAlign: 'center',
        paddingTop: 0
      },
      subtitle: {
        fontFamily: 'PingFangTC-Light',
        fontSize: 20,
        paddingTop: 25,
        paddingRight: 30
      },
      addressSubtitle: {
        fontFamily: 'PingFangTC-Ultralight',
        fontSize: 14,
        textAlign: 'center'
      },
      flex: {
        flex: 1
      },
      statusBar: {
        paddingTop: Constants.statusBarHeight,
        flex: 1,
        alignItems: 'center',
        borderRadius: 5 
      },
      labelText: {
        fontFamily: 'PingFangTC-Light',
        color: '#000000',
        width: 350
      },
      inputText: {
        fontFamily: 'PingFangTC-Ultralight'
      },
      timeSaved: {
        fontFamily: 'PingFangTC-Ultralight',
        fontSize: 24,
        textAlign: 'right',
        paddingLeft: 175
      },
      technologies: {
        title:{
          fontFamily: 'PingFangTC-Thin',
          fontSize: 18,
          paddingTop: 5,
          paddingLeft: 10,
          paddingRight: 10
        },
        subtitle: {
          fontFamily: 'PingFangTC-Ultralight',
          fontSize: 14,
          paddingLeft: 10,
          paddingRight: 10
        }
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
        visible={this.props.optionsModal.visible}>
        {/* Display Time Spent in Traffic This Week */}
        {/* Display Time Saved--Use a static value tied to state and asyncronously stored to show cumulative adjustments */}
        <LinearGradient
            colors={['transparent']}
            style={styles.statusBar}>
              <CardItem style={{flex:1}}>
                <Grid>
                  <Row>
                    <Card style={{ height: 80, width: deviceWidth-deviceWidth/10 }}>
                      <Form>
                        <Item>
                        <Icon button onPress={()=>this.props.editHome()} active name='ios-home' />
                          {/* NOTE: this.props.onLocationChangeHandler this.props.home*/}
                          <Input style={styles.labelText} onChangeText={this.props.handleChangeText} value={this.props.home} />
                        </Item>
                      </Form>
                      <Text style={styles.addressSubtitle}>This address is used to estimate your commute time.</Text>
                    </Card>
                  </Row>
                  <Row style={styles.rowBorder}>
                    <Col>
                      <Text style={styles.title}>3</Text>
                    </Col>
                    <Col>
                      <Text style={styles.subtitle}>days</Text>
                    </Col>
                  </Row>
                  <Row style={styles.rowBorder}>
                    <Col>
                      <Text style={styles.title}>19</Text>
                    </Col>
                    <Col>
                      <Text style={styles.subtitle}>hours</Text>
                    </Col>
                  </Row>
                  <Row style={styles.rowBorder}>
                    <Col>
                      <Text style={styles.title}>15</Text>
                    </Col>
                    <Col>
                      <Text style={styles.subtitle}>minutes</Text>
                    </Col>
                  </Row>
                  <Row>
                    <Text style={styles.timeSaved}>time saved</Text>
                  </Row>
                  {/* following row for spacing */}
                  <Row />
                  
                  <Row>
                    <Col>
                      <Row>
                        <Text style={styles.technologies.title}>Technologies used:</Text>
                      </Row>
                      <Row>
                        <Text style={styles.technologies.subtitle}>React Native, NativeBase.io, Google Places API, Google Distance Matrix API</Text>
                      </Row>
                    </Col>
                  </Row>
                </Grid>
              </CardItem>
            
            {/* Display A Form Element For the User to Enter their home address */}
            {/* Maybe add an alert on app startup if this field is not entered */}
            

          {/* Maybe use this space to list technologies */}

            

          <Footer>
            <Left></Left>
            <Body></Body>
            <Right style={{alignItems: 'center'}}>
              <Button large transparent onPress={() => {this.props.accept();}}><Text>Accept</Text></Button>
            </Right>
          </Footer>
        </LinearGradient>
      </Modal>
    )
  }
}