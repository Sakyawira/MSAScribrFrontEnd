import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// import { IconButton } from '@material-ui/core';
// import InputAdornment from '@material-ui/core/InputAdornment';
// import TextField from '@material-ui/core/TextField'
// import Search from '@material-ui/icons/Search'
import Spinner from 'react-bootstrap/Spinner'
import * as React from 'react'


// import shuffle from 'shuffle.ts';
// import { string } from 'prop-types';
// import VideoList from './VideoList';

// const videolist = new VideoList(this);

interface IState {
    input: string,
    isCorrect:any,
    isLoading: any,
    result: any,
    body:any,
    question:any,
    wrongResult: any,
   
}

interface IProps {
    currentVideo:any,
    play: any
   
}

export default class CaptionArea extends React.Component<IProps, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            body: [],
            input: "",
            isCorrect:"",
            isLoading: false,
            question: [],
            result: [],
           wrongResult: [],
         
        }
    }
  
         // make a reference that allows App.tsx to access updateList from video.tsx
  public listMounted = (callbacks: any) => {
 //   this.setState({ updateVideoList: callbacks })
 }
    // Handle search of caption/transcription
    public search = () => 
    {
        this.setState({isLoading: true});
        window.scrollTo(0,0);
    
        this.setState({isCorrect:""});

        fetch("https://sakyaapi.azurewebsites.net/api/Videos/GetRandomVideo", {
            headers: {
              Accept: "text/plain"
            },
            method:"GET"

        // convert the response to json
        }).then(response => {
            
            return response.json()
            
        // convert the result to a table
        }).then(answer => {
            this.setState({wrongResult:answer})
        })

        // Get Random transcription and change its like value
            fetch("https://sakyaapi.azurewebsites.net/api/Transcriptions/GetRandomTranscription", {
                headers: {
                  Accept: "text/plain"
                },
                method:"GET"

            // convert the response to json
            }).then(response => {
                
                return response.json()
                
            // convert the result to a table
            }).then(answer => {
                this.setState({result:answer},()=>this.makeTableBody())
                
            })

          
    }

    public makeLike = (video:any) => {
        // Create the object to send
        const toSend = [{
            "from":"",
            "op":"replace",
            "path":"/isFavourite",
            "value": true,
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
          })
    }

    public handleTableClick = (video:any, timedURL: string) => {
        // scroll the window to the top
       
        // play video at the specific time
       
        this.props.play(video.webUrl + "&t=" + timedURL + "s")
        
        this.setState({isCorrect:
            <Alert variant={'success'}>
            "Correct!"
            </Alert>});
             window.scrollTo(0,520);
    }

    public handleTableClickWrong = () => {
        // scroll the window to the top
        window.scrollTo(0,130);
      
        this.setState({isCorrect:  <Alert variant={'danger'}>"Wrong!"</Alert>});
    }

    // Make a table
    public makeTableBody = () => {
        let questionId: any = 0;
        const toRet: any[] = [];
        const toRet2: any[] = [];
        
        this.state.result.forEach((video: any) =>
        {
            let pushedID: any;
            // for each video's transcription
            video.transcription.forEach((caption: any) => 
            {
                 // make a table row for each transcription (caption)

                // if pushedID (the id of the video that has just been pushed) is not equal to the current video's id
                // the video is null
                if (pushedID !== video.videoId && video != null)
                {
                    toRet2.push
                    (
                        // Push the caption into an array
                        <td className="align-left">
                            <td>{caption.phrase}</td>
                        </td>
                    )
                }
              pushedID = video.videoId;
            })
        });

        this.state.result.forEach((video: any) => 
        {
            let pushedID: any;
            // for each video's transcription
            video.transcription.forEach((caption: any) => {

            // make a table row for each transcription (caption)
            // if pushedID (the id of the video that has just been pushed) is not equal to the current video's id
            if (pushedID !== video.videoId && video != null)
            {
                toRet.push
                (
                    <table className="table"> 
                    <tr>
                     <td >
                     
                     <td className="align-left" onClick={() => this.handleTableClick(video,caption.startTime)}><img src={video.thumbnailUrl} width="130px" alt="Thumbnail"/></td>
                     <td className="align-right" onClick={() => this.handleTableClick(video,caption.startTime)}><b>{video.videoTitle}</b></td>
                         {/* the title */}
                         {/* <td className="table">{video.videoTitle}</td> */}
                        
                     </td>
                     </tr>
                     </table>
                )
            }
              pushedID = video.videoId;
              // Set the question id to the one pushed last
              questionId = video.videoId;
            })
        });

        // declare and set the currentID to the questionID
        let currentId : any = 0; // questionId;

      //  while (currentId === questionId)
        
      
        // .then(() =>
        // {
    
         console.log(toRet);
        // runs up to here
    
        this.state.wrongResult.forEach((video: any) => 
        {
            currentId = video.videoId;
            if (currentId !== questionId)
        {
           
            let pushedID: any;

            // for each video's transcription
            video.transcription.forEach((caption: any) => {
                // make a table row for each transcription (caption)
                
              if (pushedID !== video.videoId && video != null)
              {
                toRet.push(
                    <table className="table"> 
                    <tr>
                     <td >
                     <td className="align-left" onClick={() => this.handleTableClickWrong()}><img src={video.thumbnailUrl} width="130px" alt="Thumbnail"/></td>
                     <td className="align-right" onClick={() => this.handleTableClickWrong()}><b>{video.videoTitle}</b></td>
                    
 
                         {/* the title */}
                         {/* <td className="table">{video.videoTitle}</td> */}
                         
                     </td>
                     </tr>
                     </table>
                    )
              }
              
              pushedID = video.videoId;
            })
        }
        });
    // });

        // if the length of the table row is 0
        if (toRet.length === 1) 
        {
            // if the input was empty
            // if(this.state.input.trim() === "")
            // {
            //     const errorCase = <div><p>Sorry you need to still search</p></div>
            //     // make body into error case
            //     this.setState({body:errorCase})
            // }
            // else
            // {
            //     const errorCase = <div><p>Sorry no results were returned for "{this.state.input}"</p></div>
            //      // make body into error case
            //     this.setState({body:errorCase})
            // } 
            // this.makeTableBody();
           // console.log(toRet);
        }
        else
        {
            // let rng = Math.floor(Math.random() * 2) + 1;  
             // make body into the table row
             // if (rn)
              // Used like so
           // var arr = [2, 11, 37, 42];
            this.shuffleInPlace(toRet);
            console.log(toRet);
            // console.log(arr);
            this.setState({body:toRet2})
            this.setState({question:toRet})
            
          //  this.setState({question: ourQ});
        }
        this.setState({isLoading: false});
    }

    public shuffleInPlace<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
	    	const j = Math.floor(Math.random() * (i + 1));
		    const swap = array[i];
		    array[i] = array[j];
		    array[j] = swap;
        }
        return array;
 	}
      
     
    public render() {
        return (
            <div className = "caption-area">
            <Container>
                {/* <div className="row"> */}
                    {/* <div className="col-26 "> */}
                    <Row>
                        <Col xs={12} md={7} lg ={10}>
                        <h1 ><span className="lyric-heading">Which song contains these</span> {this.state.body}</h1>
                        {/* <h1 ><span className="lyric-heading"></span></h1> */}
                       
                        </Col>

                       
                        <Col xs={12} md={5} lg ={2}>
                      {/* question */}
                      <Button
                            variant="danger"
                            size = "sm"
                            disabled = {this.state.isLoading}
                            onClick={() => this.search()}
                            >
                            {this.state.isLoading ? 'Loading…' : 'Get new question'}
                               {this.state.isLoading ?
                               
                                <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                />
                               : null}
                            </Button>
                        {/* <Alert variant={"secondary"} > */}
                         
                        {/* </Alert> */}
                     </Col>
                   
                     {/* <tbody className="lyric-heading"> */}
                      
                     {/* </tbody> */}
                    </Row>

                    <Row>
                    {/* make a table */}
                {/* <table className="table"> */}

                       {/* videos*/}
                       <Col xs={12} md={7} lg ={4}>
                        <th>  {this.state.question[0]}</th>
                        </Col>

                        <Col xs={12} md={7} lg ={4}>
                        <th>  {this.state.question[1]}</th>
                        </Col>

                        <Col xs={12} md={7} lg ={4}>
                        <th>  {this.state.question[2]}</th>
                        </Col>
                        </Row>
                    {/* make a table content */}
                    <Row>
                    <Col xs={12} md={7} lg ={7}>
                        {/* feedback */}
                        {this.state.isCorrect}
                    </Col>

                    </Row>
                   
                
            </Container>
            </div>
        )
    }
}