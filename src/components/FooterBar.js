import React, { Component } from 'react'
import { DatePickerIOS } from 'react-native'
import { Footer, FooterTab, Left, Body, Right, Title, Text, Button } from 'native-base'

class FooterBar extends Component {
  render(){
    return(
      <Footer>
        <FooterTab>
          <Right>
            <Text># hrs</Text>
          </Right>
          <Body>
            <Title>Drive Less</Title>
          </Body>
          <Left>
            <Button><Text>opt</Text></Button>
          </Left>
        </FooterTab>
      </Footer>
    )
  }
}

export default FooterBar