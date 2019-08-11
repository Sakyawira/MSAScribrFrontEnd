import { IconButton } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField'
import AddCircle from '@material-ui/icons/AddCircle'
import * as React from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

interface IProps{
    addVideo:any,
}

interface IState{
    input:string
}

export default class Header extends React.Component<IProps,IState> {
    public constructor(props:any){
        super(props);
        this.state = {
            input:""
        }
    }

    public addVideo = () =>{            
        this.props.addVideo(this.state.input)
    }

    public render() {
        return (
            
            <div className="header">
                <Container>
                    <Row>
                        <Col xs={12} md={12} lg ={3}>
                            <h2><span className="red-heading2">Guess</span>The Song</h2>
                        </Col>        
                        <Col xs={12} md={12} lg ={9}>
                            <TextField
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
                            />
                            
                        </Col>
                    </Row>
                </Container>
                
            </div>
        )
    }
}
