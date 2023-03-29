import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import Popup from "reactjs-popup";
import "../assets/styles.scss";
import {
    Button,
    TextField,
    Typography,
    Paper,
    Box,
    Container,
} from "@mui/material";
import Cookies from "js-cookie";
function Game() {
    const [score, setScore] = useState(0);
    const [getLyrics, setGetLyrics] = useState("");
    const [inputVal, setInputVal] = useState("");
    const [songInput, setSongInput] = useState("");
    const [artistInput, setArtistInput] = useState("");
    const [idInput, setIdInput] = useState("");
    const [dataName, setDataName] = useState("");
    const [lyrics, setLyrics] = useState("");
    const [equal, setEqual] = useState(false);
    const [winner, setWinner] = useState("");
    const [timeLeft, setTimeLeft] = useState(5);
    const [timerRunning, setTimerRunning] = useState(false);
    const [userId, setUserId] = useState("");
    const [highScore, setHighScore] = useState("");
    const fetchCookie = async () => {
        const userIdd = Cookies.get("user_id");
        setUserId(userIdd);
    };

    useEffect(() => {
        fetchCookie();
        console.log(userId);
        if (dataName === inputVal) {
            setWinner(true);
        } else {
            setWinner(false);
        }
    });

    useEffect(() => {
        if (userId) {
            console.log(userId);
            axios
                .get(`/users/getscore/${userId}`)
                .then((response) => setHighScore(response.data.highscore))
                .catch((e) => console.log(e));
        }
    }, [userId]);

    async function randomizeTrack() {
        console.log("in randomize track");
        const newTrackId = Math.floor(Math.random() * 15);
        console.log(newTrackId);
        try {
            const response = await axios.get(`/api/${newTrackId}`, {
                trackId: newTrackId,
            });
            console.log("this is response data", response.data);
            //console.log(response.data.lyrics)
            setLyrics(response.data.lyrics);
            setDataName(response.data.name);
        } catch (err) {
            console.error("error", err);
        }
    }
    //create key for input song name
    function compareAnswer(event) {
        event.preventDefault();
        setEqual(false);
        if (dataName === inputVal) {
            alert("Correct!");
            setScore(score + 1);
            setInputVal("");
            return randomizeTrack();
        } else alert("Incorrect!");
        setInputVal("");
    }

    // create a 30s timer for the game
    useEffect(() => {
        if (timerRunning) {
            if (timeLeft > 0) {
                setTimeout(() => {
                    setTimeLeft(timeLeft - 1);
                }, 1000);
            } else {
                console.log("Fire");
                if (score > highScore) {
                    axios.post("/users/updatescore/", {
                        id: userId,
                        newScore: score,
                    });
                }

                setTimerRunning(false);
                setTimeLeft(30);
                setScore(0);
                setLyrics("");
                setDataName("");
                alert(`Game over! Your score is ${score}`);
                window.location.reload();
            }
        }
    }, [timeLeft, timerRunning, score]);

    function handleStartGame() {
        setTimerRunning(true);
        randomizeTrack();
    }
    return (
        <div
            style={{
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
            }}
        >
            <Container maxWidth="lg">
                <Box className="contentBox" sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="h3" component="h2" gutterBottom>
                        JUKEBOX JUMBLE
                    </Typography>
                    <Typography variant="h6" component="p">
                        Score: {score}{" "}
                    </Typography>
                    <Typography variant="h6" component="p">
                        High Score: {highScore ? highScore : "0"}{" "}
                    </Typography>
                    <Typography variant="h6" component="p">
                        {" "}
                        {timerRunning ? `Time left: ${timeLeft}` : ""}
                    </Typography>
                    <Box
                        className="gameContent"
                        sx={{
                            mt: 4,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Paper
                            className="lyrics"
                            sx={{
                                p: 4,
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                backgroundColor: "inherit",
                                boxShadow: "none",
                            }}
                        >
                            {!timerRunning ? (
                                <button
                                    className="start-game"
                                    onClick={handleStartGame}
                                >
                                    <span className="text">Start Game</span>
                                </button>
                            ) : (
                                ""
                            )}

                            <Box
                                className="lyric-box"
                                sx={{
                                    mt: 4,
                                    overflowY: "scroll",
                                    height: "400px",
                                    fontSize: "24px",
                                    color: "black",
                                    width: "800px",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    scrollbarWidth: "none" /* For Firefox */,
                                    "::-webkit-scrollbar": {
                                        width: 0 /* For Chrome, Safari, and Opera */,
                                    },
                                    lineHeight: "0.8",
                                }}
                            >
                                {lyrics.length > 0
                                    ? lyrics.split("\n").map((line, index) => (
                                          <React.Fragment key={index}>
                                              <span>{line}</span>
                                              <br />
                                          </React.Fragment>
                                      ))
                                    : "Lyrics go here"}
                            </Box>
                        </Paper>
                        <Box sx={{ mt: 4 }}>
                            <form
                                onSubmit={compareAnswer}
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <TextField
                                    className="input-guess"
                                    type="text"
                                    name="guess"
                                    value={inputVal}
                                    onChange={(e) => {
                                        setInputVal(e.target.value);
                                    }}
                                    label="Your guess"
                                    sx={{ flexGrow: 1 }}
                                />
                                <Button
                                    className="guess-button"
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    sx={{ ml: 2 }}
                                >
                                    Guess
                                </Button>
                            </form>
                        </Box>
                    </Box>
                </Box>
            </Container>
            {/* <style>
                {`
                    @media only screen and (max-width: 768px) {
                        .lyrics {
                            width: 90%;
                        }
    
                        .lyric-box {
                            width: 90%;
                        }
                    }
    
                    @media only screen and (max-width: 480px) {
                        .lyrics {
                            width: 100%;
                        }
    
                        .lyric-box {
                            width: 100%;
                        }
    
                        .contentBox {
                            padding: 0;
                        }
                    }
                `}
            </style> */}
        </div>
    );
}

export default Game;
