import Close from '@material-ui/icons/Close'
import { IconButton } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField'
import AddCircle from '@material-ui/icons/AddCircle'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import * as React from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


// Declare an interface that contain video List which is of type any
interface IState{
    input:string
    videoList: any
    
}

// Declare an interface that contain function mount and play which is of type any
interface IProps{
    addVideo:any,
    mount:any
    play:any
}

class VideoList extends React.Component<IProps,IState>{
   
   // Construct a video list
    public constructor(props:any){
        super(props);
        this.state = {
            input:"",
            videoList: []
        }
        this.updateList();
    }

    // delete a video based on its id
    public deleteVideo = (id:any) => {
        // fetch("https://sakyaapi.azurewebsites.net/api/Videos/"+id,{
        fetch("https://sakyaapi.azurewebsites.net/api/Videos/"+id,{
            // use the delete method
       
            method:'DELETE'
            // if success then run update
        }).then(() => {
            this.updateList()
        })
    }

    public addVideo = () =>{            
        this.props.addVideo(this.state.input)
    }

    public playVideo = (video:any) => {
      
            this.props.play(video.webUrl)
       
    }

    // update function that fecth the API
    public updateList = () => {
        fetch('https://sakyaapi.azurewebsites.net/api/Videos',{
            method:'GET'

            // if returned, then convert into .json
        }).then((ret:any) => {
            return ret.json();

            // If succesful then 
        }).then((result:any) => {
            const output:any[] = []

            // for each video that we get, we map it into a table row
            result.forEach((video:any) => {
                const row = (<tr>
                    {/* on click, run function handleLike */}
                    {/* check if a video is favourited. If yes, return a start, else return a star border */}
                    <td className="align-middle" onClick={() => this.handleLike(video)}>{video.isFavourite === true?<Star/>:<StarBorder/>}</td>

                    {/* on click, play video by getting the video url*/}
                    {/* render the thumbnail of the video */}
                    <td className="align-middle" onClick={() => this.playVideo(video)}><img src={video.thumbnailUrl} width="100px" alt="Thumbnail"/></td>

                     {/* on click, play video by getting the video url*/}
                     {/* render the title of the video */}
                    <td className="align-middle" onClick={() => this.playVideo(video)}><b>{video.videoTitle}</b></td>

                    {/* on click, delete video by getting the video id*/}
                     {/* render the close button */}
                    <td className="align-middle video-list-close"><button onClick={() => this.deleteVideo(video.videoId)}><Close/></button></td>
                </tr>)
                // If a video is favourited, put on the top, else push to the back
                if(video.isFavourite){
                    output.unshift(row);
                }else{
                    output.push(row);
                }
            });
            // Set this to the output
            this.setState({videoList:output})
        })
    }

    // handle the like of video (favourite)
   public handleLike = (video:any) => {
        // Create the object to send
        const toSend = [{
            "from":"",
            "op":"replace",
            "path":"/isFavourite",
            "value":!video.isFavourite,
        }]
        fetch("https://sakyaapi.azurewebsites.net/api/Videos/update/"+video.videoId, {
            body:JSON.stringify(toSend),
            headers: {
                // Tell the fetch so it knows what to accept 
              Accept: "text/plain",
                // Tell the fetch to know the type of the content
              "Content-Type": "application/json-patch+json"
            },
            method: "PATCH"

            // on success, call updateList
          }).then(() => {
              this.updateList();
          })
    }
    
    // mounting the updateList so App.tsx can use it
    public componentDidMount = () => {
        this.props.mount(this.updateList)
        this.updateList()
    }


    // Render method
    public render() {
        return (
            <div className="video-list">
                 <Container>
                  
              
                <Row>
                <h1 className="play-heading"><span className="red-heading">video</span>List</h1>
                <Col>
                    
                            <TextField
                            id= "Search-Bar"
                            className = "SearchBar"
                            placeholder="Add Video Url"
                            margin="dense"
                            variant="outlined"
                            onChange = { (event: any ) => this.setState({input:event.target.value})}
                            value = {this.state.input}
                            InputProps={{
                                endAdornment: <InputAdornment  position="end" variant="standard">
                                    <IconButton edge = "end" onClick={this.addVideo} size ="small">
                                        <AddCircle color = "action" fontSize = "small"/>
                                    </IconButton>
                                </InputAdornment>,
                            }}
                            />
                            
                        </Col>
                        </Row>
                <table className="table">
                    {this.state.videoList}
                </table>
                </Container>
            </div>
        )
    }
}

export default VideoList;