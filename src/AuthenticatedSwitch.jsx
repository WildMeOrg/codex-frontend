import React from 'react';
import { get } from 'lodash-es';
import { Switch, Route } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import { TransitionGroup } from 'react-transition-group';
import AuthenticatedAppHeader from './components/AuthenticatedAppHeader';
import Individual from './pages/individual/Individual';
import PictureBook from './pages/individual/PictureBook';
import Sighting from './pages/sighting/Sighting';
import Org from './pages/org/Org';
import Orgs from './pages/org/Orgs';
// import Project from './pages/projects/Project';
// import Projects from './pages/projects/Projects';
import User from './pages/user/User';
import Users from './pages/user/Users';
import ReportSightings from './pages/report/ReportSightings';
import FourOhFour from './pages/fourohfour/FourOhFour';
import useSiteSettings from './models/site/useSiteSettings';
import SearchIndividuals from './pages/individual/SearchIndividuals';
import SearchSightings from './pages/sighting/SearchSightings';
import SiteSetup from './pages/setup/SiteSetup';
import AdminActions from './pages/administration/Actions';
import ServerStatus from './pages/administration/ServerStatus';
import EditSiteSettings from './pages/administration/EditSiteSettings';
import MatchReview from './pages/match/MatchReview';
import FlagsOnly from './pages/match/iceland/FlagsOnly';
import Iceland from './pages/match/iceland/Iceland';
import Welcome from './pages/auth/Welcome';
import Home from './pages/home/Home';
import Footer from './components/Footer';
import { defaultCrossfadeDuration } from './constants/defaults';

export default function AuthenticatedSwitch() {
  const { data: siteSettings } = useSiteSettings();
  const siteNeedsSetup = get(siteSettings, [
    'site.needsSetup',
    'value',
  ]);

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
                  {siteNeedsSetup ? (
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
                      {/* <Route path="/projects/:id">
                        <Project />
                      </Route>
                      <Route path="/projects">
                        <Projects />
                      </Route> */}
                      <Route path="/report">
                        <ReportSightings authenticated />
                      </Route>
                      <Route path="/admin/actions">
                        <AdminActions />
                      </Route>
                      <Route path="/admin/server">
                        <ServerStatus />
                      </Route>
                      <Route path="/admin/settings">
                        <EditSiteSettings />
                      </Route>
                      <Route path="/iceland/flags">
                        <FlagsOnly />
                      </Route>
                      <Route path="/iceland">
                        <Iceland />
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
