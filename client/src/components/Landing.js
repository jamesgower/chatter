import React from "react";
import {
    InputGroup,
    InputGroupButtonDropdown,
    Input,
    Label,
    Button,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Tooltip,
} from "reactstrap";
import Chat from "./Chat";
import { isRealString } from "../server/utils/validation";

class Landing extends React.Component {
    constructor() {
        super();

        this.state = {
            name: "",
            room: "",
            nameError: false,
            roomError: false,
            dropdownOpen: false,
            submitted: false,
        };
        this.toggleDropDown = this.toggleDropDown.bind(this);
    }

    /*
        Open dropdown for room change on firing
    */
    toggleDropDown() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen,
        });
    }

    onSubmit(e) {
        e.preventDefault();
        /*
            Check if name & room are valid strings. If they are, then set relevant state 
            to match the strings, and set submitted state to true.
        */
        if (isRealString(this.state.name) && isRealString(this.state.room)) {
            this.setState({ submitted: true });
        } else {
            /*
                If either of the strings are not valid, then set the relevant error state
                to true, and show the relevant error.
            */
            if (!isRealString(this.state.name)) {
                this.setState({ nameError: true });
                setTimeout(() => {
                    this.setState({ nameError: false });
                }, 2500);
            }
            if (!isRealString(this.state.room)) {
                this.setState({ roomError: true });
                setTimeout(() => {
                    this.setState({ roomError: false });
                }, 2500);
            }
        }
    }

    /*
        Change the room state to the value which has been typed/clicked on in the dropdown menu
        or room text field.
    */
    onRoomChange(e) {
        this.setState({ room: e.target.value });
    }

    /*
        Change the name state to the value which has been typed in the name text field.
    */
    onNameChange(e) {
        this.setState({ name: e.target.value });
    }

    render() {
        document.title = "Join | Chatter";
        /*
            If the user has not tried to connect to a room, the landing page will be shown t
            allow the user to choose a room.
        */
        if (!this.state.submitted) {
            return (
                <div className="centered-form">
                    <form className="centered-form__form" onSubmit={e => this.onSubmit(e)}>
                        <div className="form-field">
                            <h3>Join a Chat</h3>
                        </div>
                        <div className="form-field">
                            <Label>Display name</Label>
                            <Input
                                type="text"
                                id="nameInput"
                                autoFocus
                                onChange={e => this.onNameChange(e)}
                            />
                        </div>
                        <div className="form-field">
                            <Label>Room name</Label>
                            <InputGroup id="roomInput">
                                {/* 
                                    When the input is changed, it will update the room state with
                                    the value which the user has input via the onRoomChange function.
                                */}
                                <Input
                                    type="text"
                                    value={this.state.room}
                                    onChange={e => this.onRoomChange(e)}
                                />
                                <InputGroupButtonDropdown
                                    addonType="append"
                                    isOpen={this.state.dropdownOpen}
                                    toggle={this.toggleDropDown}
                                >
                                    <DropdownToggle caret>Select</DropdownToggle>
                                    <DropdownMenu>
                                        {/* 
                                            onRoomChange() sets the current room state to be the same as 
                                            the chosen dropdown option
                                        */}
                                        <DropdownItem header>Rooms</DropdownItem>
                                        <DropdownItem
                                            value="React & Redux"
                                            onClick={e => this.onRoomChange(e)}
                                        >
                                            React & Redux
                                        </DropdownItem>
                                        <DropdownItem
                                            value="ES6+ JavaScript"
                                            onClick={e => this.onRoomChange(e)}
                                        >
                                            ES6+ JavaScript
                                        </DropdownItem>
                                        <DropdownItem
                                            value="New Frameworks"
                                            onClick={e => this.onRoomChange(e)}
                                        >
                                            New Frameworks
                                        </DropdownItem>
                                        <DropdownItem
                                            value="Discuss"
                                            onClick={e => this.onRoomChange(e)}
                                        >
                                            Discuss
                                        </DropdownItem>
                                        <DropdownItem
                                            value="Design Ideas"
                                            onClick={e => this.onRoomChange(e)}
                                        >
                                            Design Ideas
                                        </DropdownItem>
                                        <DropdownItem divider />
                                        <DropdownItem
                                            value="Chill Zone"
                                            onClick={e => this.onRoomChange(e)}
                                        >
                                            Chill Zone
                                        </DropdownItem>
                                    </DropdownMenu>
                                </InputGroupButtonDropdown>
                            </InputGroup>
                        </div>
                        <div className="form-field">
                            <Button color="success">Join {this.state.room}</Button>
                        </div>
                    </form>
                    {/* Below are the error tooltips which fire when there is an error in the form input */}
                    <Tooltip placement="top" isOpen={this.state.nameError} target="nameInput">
                        Please insert a valid display name.
                    </Tooltip>
                    <Tooltip placement="bottom" isOpen={this.state.roomError} target="roomInput">
                        Please insert a valid room name
                    </Tooltip>
                </div>
            );
        } else {
            /*
                If the user has submitted a room to enter and a username, then the Chat component
                will be rendered, with the name and room as props passed to it.
            */
            return (
                <div>
                    <Chat
                        params={{
                            name: this.state.name,
                            room: this.state.room,
                        }}
                    />
                </div>
            );
        }
    }
}

export default Landing;
