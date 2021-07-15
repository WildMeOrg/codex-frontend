import React, { useState } from 'react';
import { get } from 'lodash-es';
import Grid from '@material-ui/core/Grid';
import FilterBar from './FilterBar';
import Text from './Text';
import EntityCard from './EntityCard';

export default function AvatarGallery({
  entities,
  renderDetails,
  getHref,
  canDelete,
  onDelete = Function.prototype,
  linkAll = true,
  avatarSize = 150,
  idKey = 'guid',
  titleKey = 'name',
  filterKey = 'name',
  getAnnotations = entity => get(entity, 'annotations', undefined),
  justify = 'center',
  square = false,
}) {
  const [filter, setFilter] = useState('');

  const filteredEntities = entities.filter(entity =>
    entity[filterKey].toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <>
      {entities.length > 6 && (
        <FilterBar value={filter} onChange={setFilter} />
      )}
      {filteredEntities.length === 0 && (
        <Text
          style={{ marginLeft: 16 }}
          id="FILTER_NO_MATCHES"
          values={{ filter }}
        />
      )}
      <Grid container spacing={6} justify={justify}>
        {filteredEntities.map(entity => (
          <EntityCard
            key={entity[idKey]}
            name={entity[titleKey]}
            imgSrc={entity.profile}
            titleKey={titleKey}
            href={getHref(entity)}
            onDelete={() => onDelete(entity)}
            square={square}
            annotations={getAnnotations(entity)}
            admin={Boolean(entity.admin)}
            entity={entity}
            renderDetails={renderDetails}
            canDelete={canDelete}
            linkAll={linkAll}
            avatarSize={avatarSize}
          />
        ))}
      </Grid>
    </>
  );
}
