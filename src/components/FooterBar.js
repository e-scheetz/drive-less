import React, { Component } from 'react'
import { DatePickerIOS } from 'react-native'
import { Footer, FooterTab, Left, Body, Right, Title, Text, Button } from 'native-base'

class FooterBar extends Component {
  render(){
    return(
      <Footer>
        <FooterTab>
          <Right>
            <Text>{this.props.duration}</Text>
          </Right>
          <Body>
            <Title>Drive Less</Title>
          </Body>
          <Left>
            <Button onPress={()=>this.props.open()}><Text>opt</Text></Button>
          </Left>
        </FooterTab>
      </Footer>
    )
  }
}

export default FooterBar