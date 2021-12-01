// eslint-disable-next-line no-use-before-define
import React from 'react'
import './select.css'
import Config from '../../../config'
const SelectPortal = () => {
  return (
    <>
    <div className= "parent">
      <nav className = "main">
        <ul>
          <li>
            <a className="social google" href={Config.STAFF_URL}>
              Continue as Staff
            </a>
          </li>
          <li>
            <a className="social tumblr" href={Config.STUDENT_URL}>
            Continue as Student
            </a>
          </li>

        </ul>
      </nav>
      </div>
    </>
  )
}

export default SelectPortal
