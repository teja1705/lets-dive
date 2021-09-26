import React from 'react';

import './custom-button.styles.scss';

const CustomButton = ({children , isGoogleSignIn, isChatButton, ...otherProps}) =>(
    <button className={`${isChatButton ? 'chat-button' : ''} ${isGoogleSignIn ? 'google-sign-in' : ''} custom-button`} {...otherProps}>
        {children}
    </button>
);

export default CustomButton;