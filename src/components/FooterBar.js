import React, { Component } from 'react'
import { View } from 'react-native'
import { FooterTab, Left, Body, Right, Title, Text, Button } from 'native-base'

class FooterBar extends Component {
  render(){
    return(
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
      
    )
  }
}

export default FooterBar