import * as React from 'react';
import './Message.css';

interface Props {
    children: JSX.Element | string;
}

// tslint:disable-next-line:variable-name
const Message: React.SFC<Props> = props => (
    <div className="message">{props.children}</div>
);

export default Message;
