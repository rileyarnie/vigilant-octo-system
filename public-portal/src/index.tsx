// eslint-disable-next-line no-use-before-define
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import LandingPage from './Landing'
import { BrowserRouter } from 'react-router-dom'
import { Route, Switch } from 'react-router'
import SelectPortal from './App/components/SelectPortal/select'

const app = (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/select" component={SelectPortal} />
    </Switch>
  </BrowserRouter>
)
ReactDOM.render(app, document.getElementById('root'))
