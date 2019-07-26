import * as React from 'react';
import ReactPlayer from 'react-player';
import CaptionArea from 'src/Components/CaptionArea';
import Header from 'src/Components/Header';
import VideoList from 'src/Components/VideoList';
import 'src/App.css'

interface IState {
  updateVideoList: any,
  player: any,
  playingURL: string
  videoList: object
}

class App extends React.Component<{}, IState>{
  public constructor(props: any) {
    super(props);
    this.state = {
      player: null,
      playingURL: "",
      updateVideoList: null,
      videoList: [],
    }
  }

  public setRef = (playerRef: any) => {
    this.setState({
      player: playerRef
    })
  }

    // a function to add the video, which accepts a string called url
  public addVideo = (url: string) => {
    const body = {"url": url}
    fetch("https://scriberapi.azurewebsites.net/api/Videos", {
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
      this.state.updateVideoList();
    })
  }

  // update the URL to change the video we are playing
  public updateURL = (url: string) => {
    // check if it is currently playing the passed in url
    if(this.state.playingURL === url){
      // react video player quirk -> if we give it the same url, it won't update to go back to where we wanted to
      // set playing url into an empty string
      // set state can have a callback function so we pass in another set state that set it to our passed in url
      this.setState({playingURL : ""},() => this.setState({playingURL: url}))
    }else{
      // else set the playing url to url
      this.setState({playingURL:url})
    }
  }

  // make a reference that allows App.tsx to access updateList from video.tsx
  public listMounted = (callbacks: any) => {
    this.setState({ updateVideoList: callbacks })
  }

  public render() {
    return (<div>
      {/* call the addVideo function */}
      <Header addVideo={this.addVideo} />
      <div className="container">
        <div className="row">
          <div className="col-7">
            <ReactPlayer
              className="player"
              ref={this.setRef}
              controls={true}
              // a state to know what video is currently playing
              url={this.state.playingURL}
              width="100%"
              height="400px"
              playing={true}
              config={{
                youtube: {
                  playerVars: { showinfo: 1 },
                  preload: true
                }
              }
              }
            />
          </div>
          <div className="col-5">
            <VideoList play={this.updateURL} mount={this.listMounted} />
          </div>
        </div>
        <CaptionArea currentVideo={this.state.playingURL} play={this.updateURL} />
      </div>
    </div>)
  }
}

export default App;