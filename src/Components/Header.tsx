// import { IconButton } from '@material-ui/core';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import TextField from '@material-ui/core/TextField'
// import AddCircle from '@material-ui/icons/AddCircle'
import * as React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { InlineFollowButtons } from 'sharethis-reactjs';

interface IProps {
    addVideo: any,
}

interface IState {
    input: string
}

export default class Header extends React.Component<IProps, IState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            input: ""
        }
    }

    public addVideo = () => {
        this.props.addVideo(this.state.input)
    }

    public render() {
        return (

            <div className="header">
                <Container>
                    <Row>
                        <Col xs={6} md={6} lg={9}>
                            <h2><span className="red-heading2">Guess</span>The Song</h2>
                        </Col>
                        <Col xs={6} md={6} lg={3}>
                            <InlineFollowButtons
                                config={{
                                    action: "", // call to action (STRING)
                                    action_enable: true,  // show/hide call to action (true, false)
                                    action_pos: 'left', // position of call to action (left, top, right)
                                    alignment: 'right',  // alignment of buttons (left, center, right)
                                    color: 'social',       // set the color of buttons (social, white)
                                    enabled: true,        // show/hide buttons (true, false)
                                    networks: [         // which networks to include (see FOLLOW NETWORKS)
                                        'github',
                                        'instagram',
                                        'facebook',
                                        'twitter',
                                        'youtube',

                                    ],
                                    padding: 8,           // padding within buttons (INTEGER)
                                    profiles: {           // social profile links for buttons
                                        facebook: 'sakyawira.nandaruslim?ref=bookmarks',
                                        github: 'sakyawira',

                                        instagram: 'sakyawira',
                                        twitter: 'sakyawira',


                                        youtube: '/channel/UC6eh_JZFR8O9w-de4sIjR5g?view_as=subscriber'
                                    },
                                    radius: 9,            // the corner radius on each button (INTEGER)
                                    size: 32,             // the size of each button (INTEGER)
                                    spacing: 8            // the spacing between buttons (INTEGER)
                                }}
                            />
                            {/* <hr /> */}
                            {/* <TextField
                            id= "Search-Bar"
                            className = "SearchBar"
                            placeholder="Paste Video Link"
                            margin="normal"
                            variant="outlined"
                            onChange = { (event: any ) => this.setState({input:event.target.value})}
                            value = {this.state.input}
                            InputProps={{
                                endAdornment: <InputAdornment position="start">
                                    <IconButton onClick={this.addVideo}>
                                        <AddCircle/>
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            /> */}

                        </Col>
                    </Row>
                </Container>

            </div>
        )
    }
}
