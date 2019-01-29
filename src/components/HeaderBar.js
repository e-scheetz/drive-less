import React, { Component } from 'react'
import { Header, Body, Title, Left, Right, Button, Icon } from 'native-base';

class HeaderBar extends Component {
  render() {
    return (
      <Header>
        <Left>
          {this.props.singleCardView
            ? <Button onPress={()=>this.props.back()} transparent>
                <Icon name='arrow-back' />
              </Button>
            : <Button onPress={()=>this.props.back()} transparent>
              </Button> }
        </Left>
        <Body>
          <Title>Drive Less</Title>
        </Body>
        <Right>

        </Right>
      </Header>
    );
  }
}

export default HeaderBar