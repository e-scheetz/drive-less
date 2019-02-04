import React, { Component } from 'react'
import { Modal, Alert, View } from 'react-native'
import { Form, Card, CardItem, Item, Input, Label, Footer, Subtitle, Button, Left, Right, Text, Body, Grid, Row, Title } from 'native-base';
import Expo, { Constants } from 'expo'

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
    return(
      <Modal
        style={{ flex: 1 }}
        animationType="slide"
        transparent={false}
        visible={this.props.optionsModal.visible}>
        {/* Display Time Spent in Traffic This Week */}
        {/* Display Time Saved--Use a static value tied to state and asyncronously stored to show cumulative adjustments */}
        <View style={{ paddingTop: Constants.statusBarHeight }}>
          <Card>
            <CardItem>
              <Title>Time Saved Driving Less</Title>
              <Subtitle>number</Subtitle>
            </CardItem>
            <CardItem>
              <Title>Week of Estimated Time in Traffic</Title>
              <Subtitle>number</Subtitle>
            </CardItem>
          </Card>

          {/* Display A Form Element For the User to Enter their home address */}
          {/* Maybe add an alert on app startup if this field is not entered */}
          <Card>
            <Form>
              <Item floatingLabel style={{height: 60}} onPress={()=>this.props.editHome()} >
                <Label>Home</Label>
                {/* NOTE: this.props.onLocationChangeHandler this.props.home*/}
                <Input onChangeText={this.props.handleChangeText} value={this.props.home} />
              </Item>
            </Form>
            <Subtitle>This address is used to estimate your commute time.</Subtitle>
          </Card>
        </View>
        {/* Maybe use this space to list technologies */}

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