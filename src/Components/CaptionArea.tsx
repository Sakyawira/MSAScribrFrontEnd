import Button from 'react-bootstrap/Button'
// import Alert from 'react-bootstrap/Alert'
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
    isCorrect: any,
    isFirst: any,
    isLoading: any,
    isNewQuest: any,
    lives: number,
    result: any,
    score: number,
    scrollY: any,
    body: any,
    question: any,
    wrongResult: any,


}

interface IProps {
    currentVideo: any,
    iScore: any,
    iLives: any,
    play: any,

}

export default class CaptionArea extends React.Component<IProps, IState>{
    public constructor(props: any) {
        super(props);
        this.state = {
            body: [],
            input: "",
            isCorrect: "",
            isFirst: true,
            isLoading: false,
            isNewQuest: true,
            lives: 3,
            question: [],
            result: [],
            score: 0,
            scrollY: 0,
            wrongResult: [],
        }
    }

    public reset = () => {
        this.setState({ score: 0 });
        this.setState({ lives: 3 });
        this.props.iScore(0);
        this.props.iLives(3);
        this.setState({ isCorrect: "" });
        // this.search();
    }

    // make a reference that allows App.tsx to access updateList from video.tsx
    public listMounted = (callbacks: any) => {
        //   this.setState({ updateVideoList: callbacks })
    }
    // Handle search of caption/transcription
    public search = () => {
        //  this.setState(state =>  ({score : state.score + 100}));
        this.props.iScore(this.state.score);
        this.props.iLives(this.state.lives);

        console.log(this.state.score);
        let inumber: number = 0;
        let runnumber: number = 2;

        if (this.state.isFirst === false) {
            runnumber = 1;
        }

        while (inumber < runnumber) {
            this.setState({ isNewQuest: true });
            this.setState({ isLoading: true });
            // window.scrollTo(0,0);



            fetch("https://sakyaapi.azurewebsites.net/api/Videos/GetRandomVideo", {
                headers: {
                    Accept: "text/plain"
                },
                method: "GET"

                // convert the response to json
            }).then(response => {

                return response.json()

                // convert the result to a table
            }).then(answer => {
                this.setState({ wrongResult: answer })
            })

            // Get Random transcription and change its like value
            fetch("https://sakyaapi.azurewebsites.net/api/Transcriptions/GetRandomTranscription", {
                headers: {
                    Accept: "text/plain"
                },
                method: "GET"

                // convert the response to json
            }).then(response => {

                return response.json()

                // convert the result to a table
            }).then(answer => {
                this.setState({ result: answer }, () => this.makeTableBody())

            })
            inumber += 1;
        }
        this.setState({
            isCorrect: ""
        });
        this.setState({ scrollY: 0 });
    }

    public makeLike = (video: any) => {
        // Create the object to send
        const toSend = [{
            "from": "",
            "op": "replace",
            "path": "/isFavourite",
            "value": true,
        }]
        fetch("https://sakyaapi.azurewebsites.net/api/Videos/update/" + video.videoId, {
            body: JSON.stringify(toSend),
            headers: {
                // Tell the fetch so it knows what to accept 
                Accept: "text/plain",
                // Tell the fetch to know the type of the content
                "Content-Type": "application/json-patch+json"
            },
            method: "PATCH"
        })
    }

    public handleTableClick = (video: any, timedURL: string) => {
        // scroll the window to the top

        // play video at the specific time
        if (this.state.isNewQuest === true && this.state.lives !== 0) {
            this.props.play(video.webUrl + "&t=" + timedURL + "s")
            // window.scrollTo(0,0);

            this.setState({
                isCorrect:
                    <Button variant={'outline-success'} size="sm" disabled={true}>
                        "Correct!"
            </Button>
            });

            // this.setState((state) => ({score : state.score + 100}));



            const n: number = this.state.score;
            this.setState({ score: n + 100 });
            this.props.iScore(n + 100);

            //  this.forceUpdate();
            // this.search();
            console.log(this.state.score);

            //   this.props.iScore(this.state.score);

            this.setState({ scrollY: 650 });

            this.setState({ isNewQuest: false });

            // this.search();
        }
        else if (this.state.lives === 0) {
            this.setState({
                isCorrect:
                    <Button variant={'outline-danger'} size="sm" disabled={true}>
                        ""You have run out of lives! Reload to play again!""
                    </Button>
            });
        }
        else {
            this.setState({
                isCorrect:
                    <Button variant={'outline-secondary'} size="sm" disabled={true}>
                        Click here =>
            </Button>
            });
            this.setState({ scrollY: 0 });
        }
        //  window.scrollTo(0,1080);
    }

    public handleTableClickWrong = () => {
        // scroll the window to the top
        //  window.scrollTo(0,0);
        if (this.state.isNewQuest === true && this.state.lives !== 0) {
            this.setState({ isNewQuest: false });

            // this.setState({lives : this.state.lives - 1});
            this.setState({ scrollY: 0 });
            this.setState({ isCorrect: <Button variant={'outline-danger'} size="sm" disabled={true}> "Wrong!"</Button> });

            const n: number = this.state.lives;
            console.log(n);
            this.setState({ lives: n - 1 });

            console.log(n);


            this.props.iLives(n - 1);

        }

        else if (this.state.lives === 0) {
            this.setState({
                isCorrect:
                    <Button variant={'outline-danger'} size="sm" disabled={true}>
                        ""You have run out of lives! Reload to play again!""
                    </Button>
            });
        }

        else {
            this.setState({
                isCorrect:
                    <Button variant={'outline-secondary'} size="sm" disabled={true}>
                        Click here =>
           </Button>
            });
            this.setState({ scrollY: 0 });
        }
    }

    // Make a table
    public makeTableBody = () => {
        let questionId: any = 0;
        const toRet: any[] = [];
        const toRet2: any[] = [];

        this.state.result.forEach((video: any) => {
            let pushedID: any;
            // for each video's transcription
            video.transcription.forEach((caption: any) => {
                // make a table row for each transcription (caption)

                // if pushedID (the id of the video that has just been pushed) is not equal to the current video's id
                // the video is null
                if (pushedID !== video.videoId && video != null) {
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

        this.state.result.forEach((video: any) => {
            let pushedID: any;
            // for each video's transcription
            video.transcription.forEach((caption: any) => {

                // make a table row for each transcription (caption)
                // if pushedID (the id of the video that has just been pushed) is not equal to the current video's id
                if (pushedID !== video.videoId && video != null) {
                    toRet.push
                        (
                            <table className="table">
                                <tr>
                                    <td >

                                        <td className="align-left" onClick={() => this.handleTableClick(video, caption.startTime)}><img src={video.thumbnailUrl} width="130px" alt="Thumbnail" /></td>
                                        <td className="align-right" onClick={() => this.handleTableClick(video, caption.startTime)}><b>{video.videoTitle}</b></td>
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
        let currentId: any = 0; // questionId;

        console.log(toRet);
        // runs up to here

        this.state.wrongResult.forEach((video: any) => {
            currentId = video.videoId;
            if (currentId !== questionId) {

                let pushedID: any;

                // for each video's transcription
                video.transcription.forEach((caption: any) => {
                    // make a table row for each transcription (caption)

                    if (pushedID !== video.videoId && video != null) {
                        toRet.push(
                            <table className="table">
                                <tr>
                                    <td >
                                        <td className="align-left" onClick={() => this.handleTableClickWrong()}><img src={video.thumbnailUrl} width="130px" alt="Thumbnail" /></td>
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
        if (toRet.length === 1) {
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
        else {
            // let rng = Math.floor(Math.random() * 2) + 1;  
            // make body into the table row
            // if (rn)
            // Used like so
            // var arr = [2, 11, 37, 42];
            this.shuffleInPlace(toRet);
            console.log(toRet);
            // console.log(arr);
            this.setState({ body: toRet2 })
            this.setState({ question: toRet })

            //  this.setState({question: ourQ});
        }
        if (this.state.isFirst === false) {
            this.setState({ isLoading: false });
        }
        this.setState({ isFirst: false });
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

            <div className="caption-area">
                {window.scrollTo(0, 0)}
                <Container>


                    {/* <div className="row"> */}
                    {/* <div className="col-26 "> */}
                    <Row>
                        <Col xs={12} md={7} lg={8}>
                            <h1 ><span className="lyric-heading">Which song contains these</span> {this.state.body}</h1>
                            {/* <h1 ><span className="lyric-heading"></span></h1> */}

                        </Col>

                        <Col xs={12} md={7} lg={2}>
                            {this.state.isCorrect}
                            {/* <h1 ><span className="lyric-heading"></span></h1> */}
                        </Col>
                        <Col xs={12} md={5} lg={2}>
                            {this.state.lives === 0 ?
                                <Button
                                    variant="warning"
                                    size="sm"
                                    disabled={this.state.isLoading}
                                    onClick={() => this.reset()}
                                >
                                    {this.state.isLoading ? 'Loading…' : 'Replay'}
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
                                :
                                <Button
                                    variant="danger"
                                    size="sm"
                                    disabled={this.state.isLoading}
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
                            }
                        </Col>

                        {/* question */}

                        {/* <Alert variant={"secondary"} > */}

                        {/* </Alert> */}


                        {/* <tbody className="lyric-heading"> */}

                        {/* </tbody> */}
                    </Row>

                    <Row>
                        {/* make a table */}
                        {/* <table className="table"> */}

                        {/* videos*/}
                        <Col xs={12} md={7} lg={4}>
                            <th>  {this.state.question[0]}</th>
                        </Col>

                        <Col xs={12} md={7} lg={4}>
                            <th>  {this.state.question[1]}</th>
                        </Col>

                        <Col xs={12} md={7} lg={4}>
                            <th>  {this.state.question[2]}</th>
                        </Col>
                    </Row>
                    {/* make a table content */}
                    <Row>
                        <Col xs={12} md={7} lg={7}>
                            {/* feedback */}

                        </Col>
                        {window.scrollBy(0, this.state.scrollY)}
                    </Row>


                </Container>

            </div>

        )
    }
}