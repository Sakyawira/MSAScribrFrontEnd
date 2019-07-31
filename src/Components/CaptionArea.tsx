import { IconButton } from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField'
import Search from '@material-ui/icons/Search'
import * as React from 'react'

interface IState {
    input: string,
    result: any,
    body:any,
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
            result: [],
        }
    }
        
    // Handle search of caption/transcription
    public search = () => {

        // if the input of the search is empty
        // if(this.state.input.trim() === "")
        // {
        //     // convert the result to a table
        //     this.setState({result:[]},()=>this.makeTableBody())
        // }
        // else call the api and run the search by transcription function
      //  else
      //  {
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
     //   }
    }


    public handleTableClick = (videoUrl:any, timedURL: string) => {
        // scroll the window to the top
        window.scrollTo(0,0);
        // play video at the specific time
        this.props.play(videoUrl + "&t=" + timedURL + "s")
    }

    // Make a table
    public makeTableBody = () => {
        const toRet: any[] = [];
        // this.state.result.sort((a:any, b:any)=>{
        //     // if a is the same as b, keep the order
        //     if(a.webUrl === b.webUrl)
        //     {
        //         return 0;
        //     }
        //      // if a is the playing video, a is first
        //     else if(a.webUrl === this.props.currentVideo)
        //     {
        //         return -1;
        //     }
        //     // if b is the playing video, b is first
        //     else if(b.webUrl === this.props.currentVideo)
        //     {
        //         return 1;
        //     }
        //     // return alphabetically
        //     else
        //     {
        //         return a.videoTitle.localeCompare(b.videoTitle);
        //     }
        // })
        // for each video
        this.state.result.forEach((video: any) => {
            // for each video's transcription
            video.transcription.forEach((caption: any) => {
                // make a table row for each transcription (caption)
                toRet.push(
                    // call the handle table click function on click
                    <tr onClick={() => this.handleTableClick(video.webUrl,caption.startTime)}>
                       {/* starting time */}
                        {/* <td>{caption.startTime}</td> */}
                        {/* the phrase */}
                        <td>{caption.phrase}</td>
                        {/* the title */}
                        {/* <td>{video.videoTitle}</td> */}
                    </tr>)
            })
        });
        // if the length of the table row is 0
        if (toRet.length === 0) 
        {
            // if the input was empty
            if(this.state.input.trim() === "")
            {
                const errorCase = <div><p>Sorry you need to still search</p></div>
                // make body into error case
                this.setState({body:errorCase})
            }
            else
            {
                const errorCase = <div><p>Sorry no results were returned for "{this.state.input}"</p></div>
                 // make body into error case
                this.setState({body:errorCase})
            } 
        }
        else
        {
             // make body into the table row
            this.setState({body:toRet})
        }
    }

    public render() {
        return (
            <div className="caption-area">
                <div className="row-10">
                    <div className="col-2 justify-content-center align-self-center">
                        <h1><span className="red-heading">Which</span>song</h1>
                    </div>
                    <div className="col-10">
                        {/* render a text field for the search bar */}
                        <TextField
                            id="Search-Bar"
                            className="SearchBar"
                            placeholder="Get Random Lyric"
                            margin="normal"
                            variant="outlined"
                            onChange={(event: any) => this.setState({ input: event.target.value })}
                            value={this.state.input}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">
                                    <IconButton onClick={() => this.search()}>
                                        <Search />
                                    </IconButton>
                                </InputAdornment>
                            }}
                        />
                    </div>
                </div>
                <br />
                {/* make a table */}
                <table className="table">
                       {/* make a table headings */}
                    <tr>
                        {/* <th>Time</th> */}
                        <th>Caption</th>
                        {/* <th>Video</th> */}
                    </tr>
                    {/* make a table content */}
                    <tbody className="captionTable">
                        {/* set it to the body */}
                        {this.state.body}
                    </tbody>
                </table>
            </div>
        )
    }
}