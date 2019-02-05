import React, { Component } from 'react'
import { DatePickerIOS } from 'react-native'
import { Footer, FooterTab, Left, Body, Right, Title, Text, Button, Grid, Row, Col, Icon } from 'native-base'

class FooterBar extends Component {
  render(){
    return(
      <Footer>
        <FooterTab>
          <Grid>
            <Row>
              <Col>
                <Button><Text>{this.props.duration}</Text></Button>
              </Col>
              <Col>
                <Button onPress={()=>this.props.open()}><Icon name='ios-clock'/></Button>
              </Col>
            </Row>
          </Grid>
        </FooterTab>
      </Footer>
    )
  }
}

export default FooterBar