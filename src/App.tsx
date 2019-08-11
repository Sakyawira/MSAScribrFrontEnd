import * as React from 'react';
import ReactPlayer from 'react-player';
// import {InlineReactionButtons} from 'sharethis-reactjs';
// import {InlineShareButtons} from 'sharethis-reactjs';
import { StickyShareButtons } from 'sharethis-reactjs';

import CaptionArea from 'src/Components/CaptionArea';
import Header from 'src/Components/Header';
import VideoList from 'src/Components/VideoList';
import 'src/App.css'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
// import Icon from '@material-ui/core/Icon';

import Badge from 'react-bootstrap/Badge'
import Button from 'react-bootstrap/Button'
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
// import IconButton from '@material-ui/core/IconButton';
import Spinner from 'react-bootstrap/Spinner';

interface IState {

  body: any,
  hubConnection: any,
  input: string,
  isLoading: any,
  lives: any,
  player: any,
  playingURL: string,
  result: any,
  score: number,
  updateVideoList: any,
  usersCountCurrent: any,
  videoList: object,
}

class App extends React.Component<{}, IState>{
  public signalR = require("@aspnet/signalr");
  public constructor(props: any) {
    super(props);
    this.state = {
      body: [],

      hubConnection: new this.signalR.HubConnectionBuilder().withUrl("https://sakyaapi.azurewebsites.net/hub").build(),
      input: "",
      isLoading: false,
      lives: 3,
      player: null,
      playingURL: "",
      result: [],
      score: 0,
      updateVideoList: null,
      usersCountCurrent: 0,
      videoList: [],
    }
  }

  public printBoard = () => {
    fetch('https://sakyaapi.azurewebsites.net/api/LeaderBoards', {
      method: 'GET'

      // if returned, then convert into .json
    }).then((ret: any) => {
      return ret.json();

      // If succesful then 
    }).then((result: any) => {
      const output: any[] = []
      console.log(result);
      // for each Player that we get, we sort it so the one with highest score is at top

      result.sort((a: any, b: any) => {
        if (a.score > b.score) {
          return -1;
        }
        else if (a.score < b.score) {
          return 1;
        }
        return 0;
      });

      result.forEach((player: any) => {
        const row = (<tr>
          {/* on click, run function handleLike */}
          {/* check if a video is favourited. If yes, return a start, else return a star border */}
          <td className="align-middle" >{player.playerName}</td>
          <td className="align-middle" >{player.score}</td>

        </tr>)
        // If a video is favourited, put on the top, else push to the back


        output.push(row);
        console.log(row);

      });

      // Set this to the output
      this.setState({ body: output });
      this.setState({ isLoading: false });
      window.scrollTo(0, window.innerHeight);
    })
  }

  public makeTableBody = () => {
    const toRet: any[] = [];
    this.state.result.sort((a: any, b: any) => {

      return a.Score.localeCompare(b.Score);

    })
    console.log(this.state.result);
    this.state.result.forEach(() => {
      //  console.log(this.state.result);
      toRet.push(
        <tr >
          <td>{this.state.result.playerName}</td>
          <td>{this.state.result.Score}</td>
        </tr>)
    });
    if (toRet.length === 0) {
      if (this.state.input.trim() === "") {
        const errorCase = <div><p>Sorry you need to still search</p></div>
        this.setState({ body: errorCase })
      } else {
        const errorCase = <div><p>Sorry no results were returned for "{this.state.input}"</p></div>
        this.setState({ body: errorCase })
      }
    }
    else {
      this.setState({ body: toRet })
    }
  }

  public setRef = (playerRef: any) => {
    this.setState({
      player: playerRef
    })
  }

  public addVideo = (url: string) => {
    const body = { "url": url }
    fetch("https://sakyaapi.azurewebsites.net/api/Videos", {
      body: JSON.stringify(body),
      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json"
      },
      method: "POST"
    }).then(() => {
      this.state.updateVideoList();
    }).then(() => { this.state.hubConnection.invoke("VideoAdded") });
  }

  // a function to add the video, which accepts a string called url
  public addPlayer = (name: string) => {
    this.setState({ isLoading: true });

    const body = { "playerName": name, "score": this.state.score }

    fetch("https://sakyaapi.azurewebsites.net/api/LeaderBoards", {
      //  fetch("https://sakyaapi.azurewebsites.net/api/Videos", {
      // convert body to a string and put it into a json file
      body: JSON.stringify(body),

      headers: {
        Accept: "text/plain",
        "Content-Type": "application/json"
      },
      // use POST method to send content to the API
      method: "POST"

      // call the updateVideoList which calls the updateVideo function in VideoList.tsx
    }).then(() => {
      this.printBoard();
    }).then(() => { this.state.hubConnection.invoke("VideoAdded") });
  }

  // update the URL to change the video we are playing
  public updateURL = (url: string) => {
    // check if it is currently playing the passed in url
    if (this.state.playingURL === url) {
      // react video player quirk -> if we give it the same url, it won't update to go back to where we wanted to
      // set playing url into an empty string
      // set state can have a callback function so we pass in another set state that set it to our passed in url
      this.setState({ playingURL: "" }, () => this.setState({ playingURL: url }))
    } else {
      // else set the playing url to url
      this.setState({ playingURL: url })
    }
  }

  public updateScore = (iScore: number) => {
    this.setState({ score: iScore });
    console.log(this.state.score);

  }

  public updateLives = (iLives: number) => {
    this.setState({ lives: iLives });
    console.log(this.state.lives);

  }

  // make a reference that allows App.tsx to access updateList from video.tsx
  public listMounted = (callbacks: any) => {
    this.setState({ updateVideoList: callbacks })
  }

  public componentDidMount = () => {
    this.state.hubConnection.on("Connect", () => {
      console.log('A new user has connected to the hub.');
    });

    this.state.hubConnection.on("UpdateVideoList", () => {
      this.state.updateVideoList();
      console.log('A new video has been added!');
    });
    this.state.hubConnection.on("ShowUserCounts", (usersCount: any) => {
      console.log(usersCount);
      this.setState({ usersCountCurrent: usersCount });
    });


    this.state.hubConnection.start().then(() => this.state.hubConnection.invoke("BroadcastMessage"));
  }
  public render() {

    const style = {
      display: 'inline-flex',
      fontSize: 25,
      verticalAlign: 'middle',
    }
    return (

      <div>
        <div>
          <style dangerouslySetInnerHTML={{
            __html: `
          html, body {
            margin: 0;
            padding: 0;
            text-align: center;
          }
          h1 {
            font-size: 24px;
            font-weight: bold;
          }
          hr {
            margin-bottom: 40px;
            margin-top: 40px;
            width: 50%;
          }
        `}} />

          {/* <h1>Inline Share Buttons</h1>
        <InlineShareButtons
          config={{
            alignment: 'center',  // alignment of buttons (left, center, right)
            color: 'social',      // set the color of buttons (social, white)
            enabled: true,        // show/hide buttons (true, false)
            font_size: 16,        // font size for the buttons
            labels: 'cta',        // button labels (cta, counts, null)
            language: 'en',       // which language to use (see LANGUAGES)
            networks: [           // which networks to include (see SHARING NETWORKS)
              'whatsapp',
              'linkedin',
              'messenger',
              'facebook',
              'twitter'
            ],
           
           
           
          
 
            // // OPTIONAL PARAMETERS
           
           
            // description: 'custom text',       // (defaults to og:description or twitter:description)
            // image: 'https://bit.ly/2CMhCMC',  // (defaults to og:image or twitter:image)
           
            // message: 'custom email text',     // (only for email sharing)
            // padding: 12,          // padding within buttons (INTEGER)
            // radius: 4,            // the corner radius on each button (INTEGER)
            //  show_total: true,
            //  size: 40,             // the size of each button (INTEGER)
            // subject: 'custom email subject',  // (only for email sharing)
            // title: 'custom title',            // (defaults to og:title or twitter:title)
            // username: 'custom twitter handle', // (only for twitter sharing)
            // url: 'https://www.sharethis.com', // (defaults to current url)
          
          }}
        />
        <hr />
 
        <h1>Inline Reaction Buttons</h1>
        <InlineReactionButtons
          config={{
            alignment: 'center',  // alignment of buttons (left, center, right)
            enabled: true,        // show/hide buttons (true, false)
            language: 'en',       // which language to use (see LANGUAGES)
            min_count: 0,         // hide react counts less than min_count (INTEGER)
            padding: 12,          // padding within buttons (INTEGER)
            reactions: [          // which reactions to include (see REACTIONS)
              'slight_smile',
              'heart_eyes',
              'laughing',
              'astonished',
              'sob',
              'rage'
            ],
            size: 48,             // the size of each button (INTEGER)
            spacing: 8,           // the spacing between buttons (INTEGER)
 
            // OPTIONAL PARAMETERS
            url: 'https://www.sharethis.com' // (defaults to current url)
          }}
        />
        <hr />
 
        <h1>Inline Follow Buttons</h1>
        <InlineFollowButtons
          config={{
            action: 'Follow us:', // call to action (STRING)
            action_enable: true,  // show/hide call to action (true, false)
            action_pos: 'bottom', // position of call to action (left, top, right)
            alignment: 'center',  // alignment of buttons (left, center, right)
            color: 'white',       // set the color of buttons (social, white)
            enabled: true,        // show/hide buttons (true, false)
            networks: [           // which networks to include (see FOLLOW NETWORKS)
              'twitter',
              'facebook',
              'instagram',
              'youtube'
            ],
            padding: 8,           // padding within buttons (INTEGER)
            profiles: {           // social profile links for buttons
              facebook: 'sakyawira.nandaruslim?ref=bookmarks',
              instagram: 'sakyawira',
              twitter: 'sakyawira',
             
             
              youtube: '/channel/UC6eh_JZFR8O9w-de4sIjR5g?view_as=subscriber'
            },
            radius: 9,            // the corner radius on each button (INTEGER)
            size: 32,             // the size of each button (INTEGER)
            spacing: 8            // the spacing between buttons (INTEGER)
          }}
        />
        <hr /> */}

          <StickyShareButtons
            config={{
              alignment: 'left',    // alignment of buttons (left, right)
              color: 'social',      // set the color of buttons (social, white)
              enabled: true,        // show/hide buttons (true, false)
              font_size: 16,        // font size for the buttons
              hide_desktop: false,  // hide buttons on desktop (true, false)
              labels: 'counts',     // button labels (cta, counts, null)
              language: 'en',       // which language to use (see LANGUAGES)
              min_count: 0,         // hide react counts less than min_count (INTEGER)
              networks: [           // which networks to include (see SHARING NETWORKS)
                'linkedin',
                'facebook',
                'twitter',
                'pinterest',
                'reddit'
              ],
              padding: 12,          // padding within buttons (INTEGER)
              radius: 4,            // the corner radius on each button (INTEGER)
              show_mobile: true,    // show/hide the buttons on mobile (true, false)
              show_toggle: true,    // show/hide the toggle buttons (true, false)
              show_total: true,     // show/hide the total share count (true, false)


              size: 48,             // the size of each button (INTEGER)
              top: 260,             // offset in pixels from the top of the page

              // // OPTIONAL PARAMETERS
              // url: 'https://www.sharethis.com', // (defaults to current url)
              // image: 'https://bit.ly/2CMhCMC',  // (defaults to og:image or twitter:image)
              // description: 'custom text',       // (defaults to og:description or twitter:description)
              // title: 'custom title',            // (defaults to og:title or twitter:title)
              // message: 'custom email text',     // (only for email sharing)
              // subject: 'custom email subject',  // (only for email sharing)
              // username: 'custom twitter handle' // (only for twitter sharing)

            }}
          />

        </div>
        {/* call the addVideo function */}
        <Header addVideo={this.addVideo} />
        {/* render the caption area */}
        <Container>
          <Row>
            <Col xs={12} md={12} lg={12}>
              <Button
                variant="link"
                size="sm"
                disabled={true}>
                <Badge pill={true} variant="success">.</Badge>
                <span style={style}><b>{this.state.usersCountCurrent} online</b></span>
              </Button>

              <Button
                variant="link"
                size="sm"
                disabled={true}>
                <Badge pill={true} variant="warning">.</Badge>
                <span style={style}><b>{this.state.score} points</b></span>
              </Button>

              <Button
                variant="link"
                size="sm"
                disabled={true}>
                <Badge pill={true} variant="danger">.</Badge>
                <span style={style}><b>{this.state.lives} lives</b></span>
              </Button>
            </Col>
          </Row>
          <Row>
            {this.state.lives === 0 ?
              <Col xs={12} md={12} lg={12}>
                <TextField
                  id="Search-Bar"
                  className="SearchBar"
                  placeholder="Enter your name"
                  margin="normal"
                  variant="outlined"
                  onChange={(event: any) => this.setState({ input: event.target.value })}
                  value={this.state.input}
                  InputProps={{
                    endAdornment: <InputAdornment position="start">
                      <Button
                        variant="outline-danger"
                        size="sm"
                        disabled={this.state.isLoading}
                        onClick={() => this.addPlayer(this.state.input)}
                      >
                        {this.state.isLoading ? <Spinner
                          as="span"
                          animation="grow"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        /> : '+'}

                      </Button>
                    </InputAdornment>,
                  }}
                />

              </Col>
              : null}
          </Row>
        </Container>
        {/* <div className="col-26"> */}
        <Container>
          {/* Stack the columns on mobile by making one full-width and the other half-width */}
          <Row>
            <Col xs={12} md={12} lg={12}>
              {/* <div className="container" > */}
              <CaptionArea iLives={this.updateLives} iScore={this.updateScore} currentVideo={this.state.playingURL} play={this.updateURL} />
              {/* <div className="row"> */}
            </Col>
          </Row>
          <Row>
            <Col xs={12} md={5} lg={7}>

              <ReactPlayer
                className="player"
                ref={this.setRef}
                controls={true}
                // a state to know what video is currently playing
                url={this.state.playingURL}
                width="100%"
                height="390px"
                playing={true}
                config={{
                  youtube: {
                    playerVars: { showinfo: 1 },
                    preload: true
                  }
                }
                }
              />
            </Col>

            <Col xs={12} md={7} lg={5}>

              {/* render the video list */}
              <VideoList addVideo={this.addVideo} play={this.updateURL} mount={this.listMounted} hubConnection={this.state.hubConnection} />

            </Col>
          </Row>
          {/*     
        </Col> */}
          {this.state.lives === 0 ?
            <Row>
              <Col xs={12} md={12} lg={12}>
                <table className="table">
                  < tr className="lyric-heading">
                    <th>Player Name</th>
                    <th>Score</th>

                  </tr>
                  <tbody className="captionTable">
                    {this.state.body}
                  </tbody>
                </table>

              </Col>
            </Row>
            :
            null
          }

        </Container>

        {window.scrollBy(0, window.innerHeight + 800)}
      </div>
    )
  }
}

export default App;