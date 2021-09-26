import React from 'react';
import './user-card.styles.scss';
import { withRouter } from 'react-router-dom';


const UserCard = ({photoURL , displayName , history , match , uid , status}) => (
  <div className="friend" onClick={() => history.push(`${match.url}chat` ,{uid : uid , displayName : displayName} )}>
    <img src={photoURL} alt="Profile Pic" />
      <p>
        <strong>{displayName}</strong>
      </p>
      <div className={`status ${status}`}></div>
  </div>
);

export default withRouter(UserCard);
