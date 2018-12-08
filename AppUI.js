import React, { Component } from "react";















import {

    

    

    

    Image,

    

    

    

    TouchableOpacity,

    

    

    

    TextInput

    

    

    

    

    

} from "react-native";















// NEED TO IMPORT NATIVE BASE USING npm install native-base --save







import {

    

    

    

    Container,

    

    

    

    Header,

    Form,

    Item,

    Input,

    

    

    

    Title,

    

    

    

    Body,

    

    

    

    View,

    

    

    

    StyleSheet,

    

    

    

    Content,

    

    

    

    Text,

    

    

    

    Button,

    

    

    

} from "native-base";















class App extends Component {



    

    

    

    render() {

        

        

        

        return (

                

                

                

                //                constructor(props) {

                

                //                    super(props);

                

                //                    this.state = { text: 'Useless Placeholder' };

                

                //                }

                

                

                

                <Container>

                

                

                

                <Header>

                

                

                

                <Title> WebAudio Playback </Title>

                

                

                

                </Header>

                <Content padder

                

                

                

                style={{

                

                

                

                padding: 60,

                

                

                

                flex: 1}} >

                

                

                

                

                

                

                

                <Image

                

                

                

                style={{

                

                

                

                justifyContent: 'center',

                

                

                

                alignItems: 'center',

                

                

                

                bottom: 20 }}

                

                

                

                //can change icon here, make sure the file in the same folder as App.js

                

                

                

                source={require('./icon.jpg')} />

                

                

                

                

                <Form>

                

                <Item regular>

                

                <Input placeholder="Enter a link here" />

                

                </Item>

                

                </Form>

                

                

                <Button full light

                

                

                

                style={{

                

                

                

                marginTop: 15 }}>

                

                

                

                <Text>Search</Text>

                

                

                

                

                

                

                

                

                

                </Button>

                

                

                

                

                

                <Content

                

                style= {{

                

                height: 200,

                

                width: 300,

                

                

                

                right: 0,

                

                bottom: 0,

                

                

                

                

                

                flex: 1,

                

                flexDirection: 'row',

                

                

                

                }}>

                

                

                <Button transparent>

                

                

                

                

                

                

                

                <Image

                

                

                

                style= {{

                

                

                

                

                

                justifyContent: 'center',

                

                

                

                alignItems: 'center',

                

                

                

                right: 100,

                

                

                

                bottom: 175,

                

                

                

                }}

                

                

                

                

                //can change icon here, make sure the file in the same folder as App.js

                

                

                

                source={require('./playbutton.png')}/>

                

                

                

                

                

                

                

                </Button>

                

                </Content>

                

                

                

                

                

                <Content

                

                style= {{

                

                

                

                height: 300,

                

                width: 300,

                

                

                

                flex: 1,

                

                flexDirection: 'row',

                

                bottom: 0,

                

                

                

                

                

                right: 20,

                

                

                

                bottom: 50,

                

                

                

                

                

                }}>

                

                

                <Button transparent>

                

                

                

                

                

                

                

                <Image

                

                

                

                style= {{

                

                

                

                flex: 1,

                

                flexDirection: 'row',

                

                

                

                

                

                right: 295,

                

                

                

                bottom: 180,

                

                

                

                }}

                

                

                

                //can change icon here, make sure the file in the same folder as App.js

                

                

                

                source={require('./pausebutton.png')}/>

                

                

                

                

                

                

                

                </Button>

                

                </Content>

                

                

                

                

                

                

                

                </Content>

                

                

                

                

                

                

                

                </Container>

                

                

                

                );

        

        

        

    }

    

    

    

}















export default App;