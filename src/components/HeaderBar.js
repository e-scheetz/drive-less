import React, { Component } from 'react'
import { Header, Body, Title, Left, Right, Button, Icon, Text } from 'native-base';

class HeaderBar extends Component {
  render() {
    const styles = {
      titleStyle: {
        fontFamily: 'PingFangTC-Thin',
        shadowColor: 'black',
        fontSize: 28,
        alignItems: 'center'
      },
      titleContainer: {
        alignItems: 'center'
      }
    }
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
        <Body style={styles.titleContainer}>
          <Text style={styles.titleStyle}>Drive Less</Text>
        </Body>
        <Right>
          <Button onPress={()=>this.props.options()} transparent>
            <Icon name='ios-options' />
          </Button>
        </Right>
      </Header>
    );
  }
}

export default HeaderBar