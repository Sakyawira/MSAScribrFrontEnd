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

export default class LeaderBoard extends React.Component<IProps, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            body: [],
            input: "",
            result: [],
        }
    }
        

    public search = () => {
        fetch('https://sakyaapi.azurewebsites.net/api/LeaderBoards',{
            method:'GET'

            // if returned, then convert into .json
        }).then((ret:any) => {
            return ret.json();

            // If succesful then 
        }).then((result:any) => {
            const output:any[] = []

            // for each video that we get, we map it into a table row
            result.forEach((player:any) => {
                const row = (<tr>
                    {/* on click, run function handleLike */}
                    {/* check if a video is favourited. If yes, return a start, else return a star border */}
                    <td className="align-middle" >{player.PlayerName}</td>
                    <td className="align-middle" >{player.Score}</td>
                  
                </tr>)
                // If a video is favourited, put on the top, else push to the back
              
        
                    output.push(row);
                
            });
            // Set this to the output
            this.setState({body:output})
        })
    }

    public makeTableBody = () => {
        const toRet: any[] = [];
        this.state.result.sort((a:any, b:any)=>{
          
                return a.Score.localeCompare(b.Score);
            
        })
        this.state.result.forEach((Board: any) => {
            
                toRet.push(
                    <tr >
                        <td>{Board.playerName}</td>
                        <td>{Board.Score}</td>
    
                    </tr>)
         
        });
        if (toRet.length === 0) {
            if(this.state.input.trim() === ""){
                const errorCase = <div><p>Sorry you need to still search</p></div>
                this.setState({body:errorCase})
            }else{
                const errorCase = <div><p>Sorry no results were returned for "{this.state.input}"</p></div>
                this.setState({body:errorCase})
            }
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