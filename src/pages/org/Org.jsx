import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { get, toLower } from 'lodash-es';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import WebIcon from '@material-ui/icons/Web';
import DescriptionIcon from '@material-ui/icons/Description';
import EntityHeader from '../../components/EntityHeader';
import MainColumn from '../../components/MainColumn';
import NotFoundPage from '../../components/NotFoundPage';
import EditEntityModal from '../../components/EditEntityModal';
import EncounterGallery from '../../components/EncounterGallery';
import Link from '../../components/Link';
import { selectOrgs } from '../../modules/orgs/selectors';
import orgSchema, {
  orgSchemaCategories,
} from '../../constants/orgSchema';
import useDocumentTitle from '../../hooks/useDocumentTitle';

const items = [
  {
    key: 'description',
    icon: DescriptionIcon,
    render: description => description,
  },
  {
    key: 'website',
    icon: WebIcon,
    render: website => (
      <>
        <FormattedMessage id="PROFILE_LABEL_WEBSITE" />
        <Link external href={website}>
          {website}
        </Link>
      </>
    ),
  },
];

export default function Org() {
  const { id } = useParams();
  useDocumentTitle(id);

  // fetch data for Id...
  const orgs = useSelector(selectOrgs);
  const [editingProfile, setEditingProfile] = useState(false);

  const org = orgs[toLower(id)];
  if (!org)
    return (
      <NotFoundPage
        subtitle={
          <FormattedMessage
            id="ORG_NOT_FOUND"
            defaultMessage="Org not found"
          />
        }
      />
    );

  return (
    <MainColumn>
      <EditEntityModal
        open={editingProfile}
        onClose={() => setEditingProfile(false)}
        fieldValues={org.fields}
        fieldSchema={orgSchema}
        categories={orgSchemaCategories}
      />
      <EntityHeader
        square
        name={org.name}
        imgSrc={org.profile}
        editable={org.editable}
        onSettingsClick={() => setEditingProfile(true)}
      >
        <Grid container direction="column" spacing={1}>
          {items.map(item => {
            const matchingData = org.fields.find(
              field => field.name === item.key,
            );
            const matchingSchemaObject = orgSchema.find(
              schemaObject => schemaObject.name === item.key,
            );
            const fieldValue = get(matchingData, 'value', null);
            if (!matchingData || !matchingSchemaObject) return null;
            if (matchingSchemaObject.defaultValue === fieldValue)
              return null;

            const Icon = item.icon;

            return (
              <Grid key={item.key} item style={{ display: 'flex' }}>
                <Icon color="action" style={{ marginRight: 8 }} />
                <Typography>
                  {item.render(matchingData.value)}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </EntityHeader>
      <EncounterGallery
        title={<FormattedMessage id="SIGHTINGS" />}
        encounters={org.encounters}
      />
    </MainColumn>
  );
}
