import React from 'react';
import CustomButton from '../../components/custom-button/custom-button.component';
import FormInput from '../../components/form-input/form-input.component';
import Message from '../../components/message/message.component';
import { firestore } from '../../firebase/firebase.utils';
import './chatpage.styles.scss';

class ChatPage extends React.Component{
    currentUser = null;
    docId = null
    constructor(){
        super();
        this.state = {
            message : "",
            messages : []
        }
        
    }

    componentDidMount(){
        const {currentUser} = this.props;
        this.currentUser = currentUser;
        const {uid} = this.props.location.state;
        this.docId = uid > currentUser.uid ? uid + "-" + currentUser.uid : currentUser.uid + "-" + uid ;
        this.updateMessages();
        const messagesRef =  firestore.collection('chats').doc(this.docId).collection('messages').orderBy("createdAt" , "asc");
        messagesRef.onSnapshot((allMessages) => {
            const messages = allMessages.docs.map(message => {
                const msg = message.data();
                const time = msg.createdAt.seconds % 86400 + 19800;
                const hours = Math.floor(time/3600);
                msg.time = (hours ===0 ? "12:" : hours > 12 ? hours-12 + ":" : hours + ":")
                    + (Math.floor(time/60)%60 === 0 ? "00" : Math.floor(time/60)%60 < 10 ? "0" + Math.floor(time/60)%60 : Math.floor(time/60)%60) + 
                    (hours ===0 ? " am" : hours >= 12 ? " pm" : " am");
                return msg;
            })
            this.setState({messages : messages} , () => {
                
            })
        } )
        
    }

    componentDidUpdate(){
        this.updateMessages();
        var div = document.getElementsByClassName("chat")[0];
        div.scrollTop = div.scrollHeight - div.clientHeight;
    }

    updateMessages = async () => {
        const allMessages = await firestore.collection('chats').doc(this.docId).collection('messages').orderBy("createdAt" , "asc").get();
        allMessages.docs.map(async message => {
            if(message.data().sentBy !== this.currentUser.uid && message.data().status !== "seen"){
                await firestore.collection('chats').doc(this.docId).collection('messages').doc(message.id).update({status : "seen"});
            }
            return null
        }
        )

    }


    // createChatDocument = async () => {
    //     const chatRef = firestore.collection('chats').doc(this.docId);
    //     const snapShot = await chatRef.get();
    //     console.log(snapShot);
    //     if(!snapShot.exists){
    //         const startDate = new Date();
    //         try {
    //             chatRef.set({
    //                 startDate
    //             })
    //         } catch (error) {
    //             console.log('Error creating Chat' , error.message);
    //         }
    //         chatRef.collection('messages').add({
    //             message : 'Now you can say Hi',
    //             sentBy : 'System',
    //             createdAt : new Date()
    //         })
    //     }
    // }

    handleSubmit = async event => {
        event.preventDefault();
        const {message } = this.state;
        try {
            await firestore.collection('chats').doc(this.docId).collection('messages').add({
                message : message,
                sentBy : this.currentUser.uid,
                createdAt : new Date(),
                status : 'sent'
            })
            this.setState({message : ""});
        } catch (error) {
            console.error(error);
        }
        
    };

    handleChange = event => {
        const {value , name} = event.target;
        this.setState({[name] : value})
    };

    render(){
        const { displayName} = this.props.location.state;
        return(
            <>
            <div className="chat">
                <h2 className="name">{`Chating with ${displayName}`}</h2>
                <div className="chat-messages">
                    {
                        this.state.messages.map(({createdAt , ...allMessageProps}) => (
                           <Message key={createdAt} {...allMessageProps} createdAt={createdAt} uid={this.currentUser.uid} />
                        ))
                    }
                </div>
            </div>
            <div className="send-msg">
            <form onSubmit={this.handleSubmit}>
                <FormInput
                    name = "message"
                    type = "text"
                    handleChange = {this.handleChange}
                    value = {this.state.message}
                    label = "Message"
                    required
                />
                    <CustomButton isChatButton  type="submit" >Send</CustomButton>
            </form>
        </div>
        </>
        )
    }
}


export default ChatPage;