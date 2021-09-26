import './App.css';
import React from 'react';
import HomePage from './pages/homepage/homepage.component';
import {Switch ,Route} from 'react-router-dom';
import Header from './components/header/header.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import ChatPage from './pages/chatpage/chatpage.component';

class App extends React.Component{
  constructor(){
    super();
    this.state = {
      currentUser : null
    }
  }

  unSubscribeFromAuth = null
  userRef = null

  componentDidMount(){
    this.unSubscribeFromAuth = auth.onAuthStateChanged( async userAuth => {
      if(userAuth){
        const userRef = await createUserProfileDocument(userAuth);
        this.userRef = userRef;
        await userRef.update({status : 'online'})
        userRef.onSnapshot(snapshot => {
          this.setState({currentUser : {
              id : snapshot.id,
              ...snapshot.data()
            }
          });
        });
      }
      this.setState({currentUser : userAuth});
    });
  }

  componentWillUnmount(){
    this.unSubscribeFromAuth();
  }

  render(){
    return (
      <div >
        <Header userRef={this.userRef} currentUser={this.state.currentUser} />
        
        {
                this.state.currentUser ?
              <Switch>
                <Route exact path="/" render={(props) => <HomePage currentUser={this.state.currentUser} {...props} />} />
                <Route path='/chat' render={(props) => <ChatPage currentUser={this.state.currentUser} {...props} />} />
              </Switch>
                :
                <Route exact path='/' component={SignInAndSignUpPage} />
                
              }
        
      </div>
    );
  }

}

export default App;
