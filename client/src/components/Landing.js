import React from 'react';
import {
    InputGroup,
    InputGroupButtonDropdown,
    Input,
    Label,
    Button,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Tooltip
} from 'reactstrap';
import Chat from './Chat';
import io from 'socket.io';
import {isRealString} from '../server/utils/validation';

class Landing extends React.Component {
    constructor() {
        super();

        this.state = {
            name: '',
            room: '',
            nameError: false,
            roomError: false,
            dropdownOpen: false,
            submitted: false
        };
        this.toggleDropDown = this
            .toggleDropDown
            .bind(this);
    }

    componentWillMount() {
        document.title = 'Join | Chatter'
    }

    toggleDropDown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    };

    onSubmit(e) {
        e.preventDefault();
        if (isRealString(this.state.name) && isRealString(this.state.room)) {
            this.setState({submitted: true});
        } else {
            if (!isRealString(this.state.name)) {
                this.setState({nameError: true});
                setTimeout(() => {
                    this.setState({nameError: false});
                }, 2500);
            }
            if (!isRealString(this.state.room)) {
                this.setState({roomError: true});
                setTimeout(() => {
                    this.setState({roomError: false});
                }, 2500);
            }
        }
    }

    onRoomChange(e) {
        this.setState({room: e.target.value});
    }

    onNameChange(e) {
        this.setState({name: e.target.value});
    }

    render() {
        if (!this.state.submitted) {
            return (
                <div className="centered-form">
                    <form className="centered-form__form" onSubmit={e => this.onSubmit(e)}>
                        <div className="form-field">
                            <h3>Join a Chat</h3>
                        </div>
                        <div className="form-field">
                            <Label>Display name</Label>
                            <Input type="text" id="nameInput" autoFocus onChange={e => this.onNameChange(e)}/>
                        </div>
                        <div className="form-field">
                            <Label>Room name</Label>
                            <InputGroup id="roomInput">
                                <Input
                                    type="text"
                                    value={this.state.room}
                                    onChange={(e) => this.onRoomChange(e)}/>
                                <InputGroupButtonDropdown
                                    addonType="append"
                                    isOpen={this.state.dropdownOpen}
                                    toggle={this.toggleDropDown}>
                                    <DropdownToggle caret>
                                        Select
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        <DropdownItem header>Rooms</DropdownItem>
                                        <DropdownItem value="React & Redux" onClick={(e) => this.onRoomChange(e)}>React & Redux</DropdownItem>
                                        <DropdownItem value="JavaScript" onClick={(e) => this.onRoomChange(e)}>JavaScript</DropdownItem>
                                        <DropdownItem value="New Frameworks" onClick={(e) => this.onRoomChange(e)}>New Frameworks</DropdownItem>
                                        <DropdownItem value="Discuss" onClick={(e) => this.onRoomChange(e)}>Discuss</DropdownItem>
                                        <DropdownItem value="Design Ideas" onClick={(e) => this.onRoomChange(e)}>Design Ideas</DropdownItem>
                                        <DropdownItem divider/>
                                        <DropdownItem>Chill Zone</DropdownItem>
                                    </DropdownMenu>
                                </InputGroupButtonDropdown>
                            </InputGroup>
                        </div>
                        <div className="form-field">
                            <Button color="success">Join {this.state.room}</Button>
                        </div>
                    </form>
                    <Tooltip
                        placement="top"
                        isOpen={this.state.nameError}
                        target="nameInput"
                    >
                        Please insert a valid display name.
                    </Tooltip>
                    <Tooltip
                        placement="bottom"
                        isOpen={this.state.roomError}
                        target="roomInput"
                    >
                        Please insert a valid room name
                    </Tooltip>
                </div>
            )
        } else {
            return (
                <div>
                    <Chat
                        params={{
                        name: this.state.name,
                        room: this.state.room
                    }}/>
                </div>
            );
        }
    }
}

export default Landing;