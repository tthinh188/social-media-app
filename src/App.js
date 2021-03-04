import React, { useState, useEffect } from "react";
import './App.css';
import Post from "./Post";
import { auth, db } from "./firebase"
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Input } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
import FlipMove from "react-flip-move";

function getModalStyle() {
  const top = 50 
  const left = 50

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    width: `380px`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = useState(false);

  const [posts, setPosts] = useState([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [signUpSuccess, setSignUpSuccess] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);
      } else {
        // user has logged out...
        setUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [user, username]);

  useEffect( () => {
    db.collection('posts')
    .orderBy('timestamp','desc')
    .onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data(),
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    if(password !== confirmPassword){
      setError("Fail to confirm password");
      setSignUpSuccess("");
    }
    else {
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((authUser) => {
          setError("")
          setSignUpSuccess("Successfully sign up")
          return authUser.user.updateProfile({
            displayName: username,
          });
        })
        .catch((error) => alert(error.message));
    }
  };

  const signIn = (e) => {
    e.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      setOpenSignIn(false);
      window.location.reload();
    }) 
      .catch((error) => alert(error.message));
  }

  const signOut = () => {
    auth.signOut();
    setEmail("");
    setPassword("");
    setConfirmPassword("")
    setUsername("");
    window.location.reload();
  }
  return (
    <div className="app">
      <div className="app_header">
        <span className="app_headerLogo">{user? user.displayName: "Guest"}</span>

        {user ? <Button onClick={signOut}>Logout</Button>: 
          <div>
            <Button onClick={() => setOpen(true)}>Sign up</Button>
            <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
          </div>
        }
      </div>
      
      {user?.displayName? <ImageUpload username={user.displayName}/> : ""}

      <div className="app_posts">
        <FlipMove>
          {posts.map( ({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageURL={post.imageURL}
              likes={post.likes}
            />
          ))}
        </FlipMove>

      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
            <span className="app_modalLogo">Sign Up</span>

            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <Input
              placeholder="confirm password"
              type="password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
            <p className="app_error">{error}</p>
            <p className="app_signUpSuccess">{signUpSuccess}</p>

            <div className="choice_button">
              <Button type="submit" onClick={signUp}>Sign up</Button>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </div>
            

          </form>
          
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app_signup">
            <center>
            <span className="app_modalLogo">Sign In</span>

            </center>

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />

            <p className="app_error">{error}</p>
            <Button onClick={signIn}>Login</Button>

          </form>
          
        </div>
      </Modal>
    </div>
  );
}

export default App;
