import React from 'react';
import './message.styles.scss';
import {ReactComponent as SingleTick} from '../../assets/singleTick.svg';
import {ReactComponent as DoubleTick} from '../../assets/doubleTick.svg';
import {ReactComponent as BlueTick} from '../../assets/blueTick.svg';



class Message extends React.Component{
    constructor(){
        super();
        this.state = {}
    }

    render(){
        const {sentBy , uid , message , time, status} = this.props;
        return(
            <div className="message-box-holder">
                    <div className={`${sentBy === uid ? "message-box" : "message-box message-partner"}`} >
                        {message}
                        <div className="time">
                            <small >{time}
                                {/* {creaedAt.toDate().toString()} */}
                                {
                                    sentBy === uid ?
                                    status==="sent" ?
                                    <SingleTick className="message-status"/>
                                    : status==="received" ? 
                                    <DoubleTick className="message-status"/>
                                    :
                                    <BlueTick className="message-status"/>
                                    :
                                    <></>
                                }
                            </small>
                        </div>
                    </div>
                    
                </div>
        )
    }
}

export default Message;