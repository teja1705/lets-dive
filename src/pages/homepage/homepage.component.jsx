import React from 'react';
import UserCard from '../../components/user-card/user-card.component';
import { firestore } from '../../firebase/firebase.utils';
import './homepage.styles.scss';

class HomePage extends React.Component{
  constructor(){
    super();

    this.state = {
      activeUsers : [],
      inactiveUsers : [],
      messages : 0
    }
  }

  appUsers = async (currentUser) => {
    const querySnap =  await firestore.collection('users').get();
    const activeUsers =await querySnap.docs.filter(user => {
      if(user.data().status === "online" && user.data().uid !== currentUser.uid){
        return true;
      }
    else{
      return false;
    }}).map(user => {
      const docId = user.data().uid > currentUser.uid ? user.data().uid + "-" + currentUser.uid : currentUser.uid + "-" + user.data().uid ;
      this.updateMessage(docId , currentUser);
    return user.data()
    });


    const inactiveUsers = await querySnap.docs.filter(user => user.data().status === "offline").map(user =>{
      const docId = user.data().uid > currentUser.uid ? user.data().uid + "-" + currentUser.uid : currentUser.uid + "-" + user.data().uid ;
      this.updateMessage(docId , currentUser);
    return user.data()
    });
    this.setState({activeUsers : activeUsers , inactiveUsers : inactiveUsers} );
    }

    updateUsers = async (allUsers , currentUser) => {
      const activeUsers =await allUsers.docs.filter(user => {
        if(user.data().status === "online" && user.data().uid !== currentUser.uid){
          return true;
        }
      else{
        return false;
      }}).map(user => {
        const docId = user.data().uid > currentUser.uid ? user.data().uid + "-" + currentUser.uid : currentUser.uid + "-" + user.data().uid ;
        this.updateMessage(docId , currentUser);
        // this.getRemaining(docId , currentUser);
      return user.data()
      });
  
  
      const inactiveUsers = await allUsers.docs.filter(user => user.data().status === "offline").map(user =>{
        const docId = user.data().uid > currentUser.uid ? user.data().uid + "-" + currentUser.uid : currentUser.uid + "-" + user.data().uid ;
        this.updateMessage(docId , currentUser);
        // this.getRemaining(docId , currentUser);
      return user.data()
      });
      this.setState({activeUsers : activeUsers , inactiveUsers : inactiveUsers} );
    }

  componentDidMount(){
    const {currentUser } = this.props;
    this.appUsers(currentUser);
    const userCollectionnRef = firestore.collection('users');
    userCollectionnRef.onSnapshot((allUsers) => {
      this.updateUsers(allUsers , currentUser)
    })
  }

  // getRemaining = async (docId,currentUser) => {
  //   const messages =  await firestore.collection('chats').doc(docId).collection('messages').where("status","==" , "received").get();
  //   messages.docs.filter(message => message.data().sentBy !== currentUser.uid).map(message => console.log(message.data()))
  // }

  

  updateMessage = async (docId , currentUser) => {
    const allMessages = await firestore.collection('chats').doc(docId).collection('messages').orderBy("createdAt" , "asc").get();
      allMessages.docs.map(async message => {
          if(message.data().sentBy !== currentUser.uid && message.data().status === "sent"){
              await firestore.collection('chats').doc(docId).collection('messages').doc(message.id).update({status : "received"});
          }
          return message.data()
      })
  }

  render(){
    return(
        <div className="homepage">
          <div className="activeUsers">
            <h1 className="active">Active Users</h1>
            {
              this.state.activeUsers.map(({uid , ...allParams}) => (
                <UserCard key={uid} uid={uid} {...allParams} />
              ))
            }
          </div>
          <div className="inactiveUsers">
            <h1 className="inactive">Inactive Users</h1>
            {
              this.state.inactiveUsers.map(({ uid, ...allParams }) => (
                <UserCard key={uid} uid={uid} {...allParams} />
              ))
            }
          </div>
        </div>
    )
}
}
// const HomePage = () => (
//     <div className="homepage">
//       Home Page
//     </div>
// );

export default HomePage;