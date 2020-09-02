import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Fade from '@material-ui/core/Fade';
import { TransitionGroup } from 'react-transition-group';
import AuthenticatedAppHeader from './components/AuthenticatedAppHeader';
import Individual from './pages/individual/Individual';
import PictureBook from './pages/individual/PictureBook';
import Sighting from './pages/sighting/Sighting';
import Org from './pages/org/Org';
import Orgs from './pages/org/Orgs';
import User from './pages/user/User';
import Users from './pages/user/Users';
import ReportSightings from './pages/report/ReportSightings';
import FourOhFour from './pages/fourohfour/FourOhFour';
import { selectSiteSettings } from './modules/site/selectors';
import SearchIndividuals from './pages/individual/SearchIndividuals';
import SearchSightings from './pages/sighting/SearchSightings';
import Administration from './pages/administration/Administration';
import SiteSetup from './pages/administration/SiteSetup';
import MatchReview from './pages/match/MatchReview';
import Welcome from './pages/auth/Welcome';
import Home from './pages/home/Home';
import Footer from './components/Footer';
import { defaultCrossfadeDuration } from './constants/defaults';

export default function App() {
  const siteSettings = useSelector(selectSiteSettings);

  return (
    <main>
      <AuthenticatedAppHeader />
      <Route
        render={({ location }) => (
          <TransitionGroup appear>
            <Fade
              key={location.key}
              timeout={defaultCrossfadeDuration}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                  width: '100%',
                }}
              >
                <div
                  style={{
                    minHeight: 'calc(100vh - 64px)',
                    boxSizing: 'border-box',
                  }}
                >
                  {siteSettings.needsSetup ? (
                    <SiteSetup />
                  ) : (
                    <Switch location={location}>
                      <Route path="/individuals/picturebook">
                        <PictureBook />
                      </Route>
                      <Route path="/individuals/:id">
                        <Individual />
                      </Route>
                      <Route path="/individuals">
                        <SearchIndividuals />
                      </Route>
                      <Route path="/match/:id">
                        <MatchReview />
                      </Route>
                      <Route path="/sightings/:id">
                        <Sighting />
                      </Route>
                      <Route path="/sightings">
                        <SearchSightings />
                      </Route>
                      <Route path="/users/:id">
                        <User />
                      </Route>
                      <Route path="/users">
                        <Users />
                      </Route>
                      <Route path="/orgs/:id">
                        <Org />
                      </Route>
                      <Route path="/orgs">
                        <Orgs />
                      </Route>
                      <Route path="/report">
                        <ReportSightings />
                      </Route>
                      <Route path="/administration">
                        <Administration />
                      </Route>
                      <Route path="/welcome">
                        <Welcome />
                      </Route>
                      <Route path="/" exact>
                        <Home />
                      </Route>
                      <Route>
                        <FourOhFour />
                      </Route>
                    </Switch>
                  )}
                </div>
                <Footer authenticated />
              </div>
            </Fade>
          </TransitionGroup>
        )}
      />
    </main>
  );
}
