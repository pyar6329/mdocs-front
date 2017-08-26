import React from 'react'
import ReactDOM from 'react-dom'
import { StyleSheet, css } from 'aphrodite'
import keycode from 'keycode'
import * as phoenix from 'phoenix'

if (typeof window !== 'undefined') {
  StyleSheet.rehydrate(window.__NEXT_DATA__.ids)
}

export default class extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      input_chat: '',
      messages: []
    }
    this.turnTextView = this.turnTextView.bind(this)
    this.set_messages = this.set_messages.bind(this)
  }

  componentDidMount () {
    this.socket = new phoenix.Socket('ws://api.example.net/socket')
    this.socket.connect()
    this.channel = this.socket.channel('room:lobby', {})
    this.channel.join()
      .receive('ok', resp => {
        console.log('access ok', resp)
      })
      .receive('error', resp =>{
        console.log('access error', resp)
      })
    this.catch_message(this.set_messages)
  }

  push_message (callback) {
    let message = ReactDOM.findDOMNode(this.refs.input_chat).value
    this.channel.push('new_msg', { body: message })
    console.log(`push message: ${message}`)
  }

  catch_message (callback) {
    this.channel.on('new_msg', payload => {
      console.log(`catch message: ${payload.body}`)
      callback(payload.body)
    })
  }

  set_messages (message) {
    this.setState({
      messages: this.state.messages.concat(message)
    }, () =>{
      this.render_messages()
      this.clear_input_chat()
    }) 
  }

  clear_input_chat () {
    ReactDOM.findDOMNode(this.refs.input_chat).value = ''
  }


  turnTextView (e) {
    const key = keycode(e)
    if (key === 'enter') {
      this.push_message(this.set_messages)
    }
  }

  _onClickChatButton = () => {
    this.push_message(this.set_messages)
  }

  render_messages () {
    return this.state.messages.map((message, index) =>
      <div key={index}>{message}</div>
    )
  }

  render() {
    return (
      <div className={css(styles.root)}>
        <div>Hello</div>
        <div>
          <div>Hello</div>
          <div>{this.props.userAgent}</div>
          <div className={css(styles.messages)} ref='messages'>
            {this.render_messages()}
          </div>
          <input className={css(styles.input)} ref='input_chat' onKeyDown={this.turnTextView}></input>     
          <button type='button' onClick={this._onClickChatButton}>submit</button>
        </div>
      </div>
    )
  }
}

const styles = StyleSheet.create({
  root: {
    width: 80,
    height: 60,
    background: 'white'
  },
  title: {
    marginLeft: 5,
    color: 'black',
    fontSize: 22,
    ':hover': {
      color: 'white'
    }
  },
  messages: {
    height: '300px',
    width: '500px',
    overflow: 'scroll'
  },
  input: {
    width: '500px' 
  }
})
