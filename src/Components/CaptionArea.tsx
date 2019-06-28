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
        

    public search = () => {
        console.log(this.state.input)
        fetch("https://msascribrapi.azurewebsites.net/api/Videos/SearchByTranscriptions/"+this.state.input, {
            headers: {
              Accept: "text/plain"
            }
        }).then(response => {
            return response.json()
        }).then(answer => {
            this.setState({result:answer})
        }).then(() => {
            this.makeTableBody(this.state.result)
        })
    }

    public handleTableClick = (videoUrl:any, timedURL: string) => {
        this.props.play(videoUrl + "&t=" + timedURL + "s")
    }

    public makeTableBody = (searchObject: any) => {
        const toRet: any[] = [];
        console.log(searchObject)
        const errorCase = <div><p>Sorry you need to still search</p></div>
        searchObject.forEach((video: any) => {
            video.transcription.forEach((caption: any) => {
                toRet.push(
                    <tr onClick={() => this.handleTableClick(video.webUrl,caption.startTime)}>
                        <td>{caption.startTime}</td>
                        <td>{caption.phrase}</td>
                        <td>{video.videoTitle}</td>
                    </tr>)
            })
        });
        if (toRet.length === 0) {
            this.setState({body:errorCase})
        }
        else{
            this.setState({body:toRet})
        }
    }

    public render() {
        return (
            <div className="caption-area">
                <div className="row">
                    <div className="col-2 justify-content-center align-self-center">
                        <h1><span className="red-heading">search</span>caption</h1>
                    </div>
                    <div className="col-10">
                        
                        <TextField
                            id="Search-Bar"
                            className="SearchBar"
                            placeholder="Search Captions"
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
                <table className="table">
                    <tr>
                        <th>Time</th>
                        <th>Caption</th>
                        <th>Video</th>
                    </tr>
                    <tbody className="captionTable">
                        {this.state.body}
                    </tbody>
                </table>
            </div>
        )
    }
}