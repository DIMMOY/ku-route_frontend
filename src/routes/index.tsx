import React from 'react'
import { BrowserRouter as Router, Switch } from 'react-router-dom'
import { Route, withRouter } from 'react-router'
import NotFound from 'pages/NotFound'
import HomePage from 'pages/Home'
import SignPage from 'pages/Sign'
import PostPage from 'pages/Post'
import AllPostPage from 'pages/AllPost'
import EditProfilePage from 'pages/EditProfile'
import VersatilePostPage from 'pages/VersatilePost'
import PublicRoute from './PublicRoute'
import PrivateRoute from './PrivateRoute'
import NavBar from 'components/Navbar'
import FavouriteMenu from 'pages/FavouriteMenu'

const NAVBAR = withRouter(NavBar)

const Routes: React.FC = (): JSX.Element => {
  return (
    <Router>
      <NAVBAR />
      <Switch>
        <PublicRoute
          restricted={false}
          exact
          path={['/', '/home']}
          component={HomePage}
        />
        <PublicRoute exact path="/post" component={PostPage} />
        <PublicRoute restricted={true} path="/signin" component={SignPage} />
        <PublicRoute restricted={false} path="/signup" component={SignPage} />
        <PrivateRoute path="/all-post" component={AllPostPage} />
        <PrivateRoute
          restricted={false}
          path="/edit-profile"
          component={EditProfilePage}
        />
        <PrivateRoute
          restricted={false}
          path="/create-post"
          component={VersatilePostPage}
        />
        <PrivateRoute
          restricted={false}
          path="/edit-post"
          component={VersatilePostPage}
        />
        <PrivateRoute
          restricted={false}
          path="/favourite-post"
          component={FavouriteMenu}
        />
        <PublicRoute restricted={false} component={NotFound} />
      </Switch>
    </Router>
  )
}

export default Routes
