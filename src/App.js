import React, { Component } from 'react'
import Login from './components/Login'
import ReposList from './components/ReposList'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './App.css'

class App extends Component {
  render() {
    let key = window.sessionStorage.getItem('key')
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Github Issues</h1>
        </header>
        <MuiThemeProvider>
          <div className="Body">
          { !key && <Login></Login> }
          { key && <ReposList></ReposList> }
          </div>
        </MuiThemeProvider>

      </div>
    )
  }
}

export default App
