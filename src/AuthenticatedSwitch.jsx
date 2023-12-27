import React from 'react';
import { get } from 'lodash-es';
import { Switch, Route } from 'react-router-dom';
import Fade from '@material-ui/core/Fade';
import { TransitionGroup } from 'react-transition-group';
import AuthenticatedAppHeader from './components/AuthenticatedAppHeader';
import SaveCustomField from './pages/fieldManagement/settings/saveField/SaveField';
import GeneralSettings from './pages/generalSettings/GeneralSettings';
import SiteStatus from './pages/siteStatus/SiteStatus';
import FieldManagement from './pages/fieldManagement/FieldManagement';
import UserManagement from './pages/userManagement/UserManagement';
import AdminActions from './pages/adminActions/AdminActions';
import ControlPanel from './pages/controlPanel/ControlPanel';
import AssignEncounters from './pages/assignEncounters/AssignEncounters';
import CreateIndividual from './pages/createIndividual/CreateIndividual';
import Individual from './pages/individual/Individual';
import IndividualGallery from './pages/individualGallery/IndividualGallery';
// import PictureBook from './pages/individual/PictureBook';
import Sighting from './pages/sighting/Sighting';
import AssetGroupSighting from './pages/sighting/AssetGroupSighting';
import Splash from './pages/splash/Splash';
import SocialGroups from './pages/socialGroups/SocialGroups';
import SocialGroup from './pages/socialGroups/SocialGroup';
import AssetGroup from './pages/assetGroup/AssetGroup';
import PendingCitizenScienceSightings from './pages/pendingCitizenScienceSightings/PendingCitizenScienceSightings';
import User from './pages/user/User';
import Users from './pages/user/Users';
import MergeIndividuals from './pages/merge/MergeIndividuals';
import IndividualsMergePending from './pages/merge/IndividualsMergePending';
import BulkImport from './pages/bulkImport/BulkImport';
import BulkImportSuccess from './pages/bulkImport/Success';
import ReportSighting from './pages/reportSighting/ReportSighting';
import Notifications from './pages/notifications/Notifications';
import FourOhFour from './pages/fourohfour/FourOhFour';
import useSiteSettings from './models/site/useSiteSettings';
import SearchIndividuals from './pages/individual/SearchIndividuals';
import SearchSightings from './pages/sighting/SearchSightings';
import SearchAnimals from './pages/sighting/encounters/SearchAnimals';
import SiteSetup from './pages/setup/SiteSetup';
import MatchSighting from './pages/match/MatchSighting';
import AuditLog from './pages/devTools/AuditLog';
import Welcome from './pages/auth/Welcome';
import EmailVerified from './pages/auth/EmailVerified';
import Home from './pages/home/Home';
import ResendVerificationEmail from './pages/auth/ResendVerificationEmail';
import Footer from './components/Footer';
import { defaultCrossfadeDuration } from './constants/defaults';
import Requests from './pages/setup/Requests';
import SpeciesManagement from './pages/fieldManagement/SpeciesManagement';
import RegionManagement from './pages/fieldManagement/RegionManagement';
import ChangeLog from './pages/changeLog/ChangeLog';
import DataPage from './pages/dataPage/DataPage';

export default function AuthenticatedSwitch({
  emailNeedsVerification,
}) {
  const { data: siteSettings } = useSiteSettings();
  const siteNeedsSetup = get(siteSettings, [
    'site.needsSetup',
    'value',
  ]);

  if (emailNeedsVerification) {
    return (
      <main>
        <AuthenticatedAppHeader />
        <ResendVerificationEmail />
      </main>
    );
  }

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
                      <Route path="/settings/front-page/preview">
                        <Splash />
                      </Route>
                      <Route path="/settings/status">
                        <SiteStatus />
                      </Route>
                      <Route path="/settings/users">
                        <UserManagement />
                      </Route>
                      <Route path="/settings/actions">
                        <AdminActions />
                      </Route>
                      <Route path="/settings/fields/species">
                        <SpeciesManagement />
                      </Route>
                      <Route path="/settings/fields/regions">
                        <RegionManagement />
                      </Route>
                      <Route path="/settings/fields/save-custom-field/:type?/:id?">
                        <SaveCustomField />
                      </Route>
                      <Route path="/settings/fields">
                        <FieldManagement />
                      </Route>
                      <Route path="/settings/general">
                        <GeneralSettings />
                      </Route>
                      <Route path="/settings/social-groups">
                        <SocialGroups />
                      </Route>
                      <Route path="/settings/changelog">
                        <ChangeLog />
                      </Route>
                      <Route path="/settings">
                        <ControlPanel />
                      </Route>
                      <Route path="/email_verified">
                        <EmailVerified />
                      </Route>
                      <Route path="/create-individual">
                        <CreateIndividual />
                      </Route>
                      <Route path="/assign-annotations">
                        <AssignEncounters />
                      </Route>
                      {/* <Route path="/individuals/picturebook">
                        <PictureBook />
                      </Route> */}
                      <Route path="/individuals/:guid/gallery">
                        <IndividualGallery />
                      </Route>
                      <Route path="/individuals/:id">
                        <Individual />
                      </Route>
                      <Route path="/individuals">
                        <SearchIndividuals />
                      </Route>
                      <Route path="/pending-merges/:guid">
                        <IndividualsMergePending />
                      </Route>
                      <Route path="/merge">
                        <MergeIndividuals />
                      </Route>
                      <Route path="/data-page">
                        <DataPage />
                      </Route>
                      <Route path="/bulk-imports/:id">
                        <AssetGroup />
                      </Route>
                      <Route path="/notifications">
                        <Notifications />
                      </Route>
                      <Route path="/pending-citizen-science-sightings">
                        <PendingCitizenScienceSightings />
                      </Route>
                      <Route path="/pending-sightings/:id">
                        <AssetGroupSighting />
                      </Route>
                      <Route path="/sightings/:id">
                        <Sighting />
                      </Route>
                      <Route path="/sightings">
                        <SearchSightings />
                      </Route>
                      <Route path="/animals">
                        <SearchAnimals />
                      </Route>
                      <Route path="/match-results/:sightingGuid">
                        <MatchSighting />
                      </Route>
                      <Route path="/users/:id">
                        <User />
                      </Route>
                      <Route path="/users">
                        <Users />
                      </Route>
                      <Route path="/requests">
                        <Requests />
                      </Route>
                      <Route path="/social-groups/:guid">
                        <SocialGroup />
                      </Route>
                      <Route path="/bulk-import/success/:id">
                        <BulkImportSuccess />
                      </Route>
                      <Route path="/bulk-import">
                        <BulkImport />
                      </Route>
                      <Route path="/report">
                        <ReportSighting authenticated />
                      </Route>
                      <Route path="/auditlog">
                        <AuditLog />
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
