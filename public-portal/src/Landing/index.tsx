// eslint-disable-next-line no-use-before-define
import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import { Navbar, Container, Nav } from 'react-bootstrap'
import '../App.css'
import logoDark from '../assets/images/logo.png'
import Login from '../App/components/Login'
import { AuthContext } from '../App/context/AuthContext'
import PublishedProgramCohorts from '../App/PublishedProgramCohorts'

const LandingPage = () => {
  const [isAuthenticated, setAuthState] = useState(false)
  // const user = JSON.parse(sessionStorage.getItem('User') as string)

  return (
        <>
            <Navbar bg="primary" expand="lg">
                <Container>
                    <Navbar.Brand href="/home">
                        <img src={logoDark} alt="miog logo"></img>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav " />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto ">
                            <AuthContext.Provider
                                value={{
                                  isAuthenticated,
                                  setAuthState
                                }}
                            >
                                <Nav.Link href="home">Home</Nav.Link>
                                <Nav.Link href="courses">Courses</Nav.Link>
                                <Nav.Link href="apply">Apply</Nav.Link>
                                <Nav.Link>
                                    <Login></Login>
                                </Nav.Link>
                            </AuthContext.Provider>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <div className="row">
                <div className="text-center"></div>
            </div>

            <div className="auth-wrapper">
                <div className="auth-content container">
                    <div className="row">
                        <div className="col-md-12">
                            <h2 className="font-weight-bolder text-primary">Our Courses</h2><br/>
                            <PublishedProgramCohorts/>
                        </div>
                    </div>
                </div>

                <svg width="100%" height="250px" version="1.1" xmlns="http://www.w3.org/2000/svg" className="wave bg-wave">
                    <title>Wave</title>
                    <defs />
                    <path
                        id="feel-the-wave-three"
                        d="M 0 57.04587196740989 C 239.99999971109986 79.41474345984528 239.99999971109986 79.41474345984528 479.9999994221997 68.23030771362758 C 719.9999991332996 57.04587196740989 719.9999991332996 57.04587196740989 959.9999988443994 96.030304568373 C 1199.9999985554996 135.01473716933612 1199.9999985554996 135.01473716933612 1439.9999982665993 72.21343378643654 C 1679.9999979776992 9.41213040353695 1679.9999979776992 9.41213040353695 1919.9999976887989 96.030304568373 L 1919.9999976887989 687.999993066398 L 0 687.999993066398 Z"
                        fill="rgba(72, 134, 255, .2)"
                    />
                </svg>
            </div>
        </>
  )
}

export default LandingPage
