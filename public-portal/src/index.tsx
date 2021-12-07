// eslint-disable-next-line no-use-before-define
import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import LandingPage from './Landing'
import { BrowserRouter } from 'react-router-dom'
import { Route, Switch } from 'react-router'
import SelectPortal from './App/components/SelectPortal/select'
import ApplicationForm from './App/ApplicationForm'

const app = (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/select" component={SelectPortal} />
      <Route exact path="/apply" component={ApplicationForm} />
    </Switch>
  </BrowserRouter>
)
ReactDOM.render(app, document.getElementById('root'))
