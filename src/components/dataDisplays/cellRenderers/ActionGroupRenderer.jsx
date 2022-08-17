import React, { useMemo } from 'react';
import ActionIcon from '../../ActionIcon';

function convertClickHandler(clickProp, value, datum) {
  if (clickProp && typeof clickProp === 'function') {
    return () => clickProp(value, datum);
  }
  return clickProp;
}

function convertHref(hrefProp, value, datum) {
  return typeof hrefProp === 'function'
    ? hrefProp(value, datum)
    : hrefProp;
}

export default function ActionGroupRenderer({
  value,
  datum,
  onView,
  viewHref,
  onEdit,
  editHref,
  onDelete,
  deleteHref,
}) {
  const showView = viewHref || onView;
  const showEdit = editHref || onEdit;
  const showDelete = deleteHref || onDelete;

  const {
    handleView,
    handleEdit,
    handleDelete,
    finalViewHref,
    finalEditHref,
    finalDeleteHref,
  } = useMemo(
    () => ({
      handleView: convertClickHandler(onView, value, datum),
      handleEdit: convertClickHandler(onEdit, value, datum),
      handleDelete: convertClickHandler(onDelete, value, datum),
      finalViewHref: convertHref(viewHref, value, datum),
      finalEditHref: convertHref(editHref, value, datum),
      finalDeleteHref: convertHref(deleteHref, value, datum),
    }),
    [value, datum],
  );

  return (
    <div>
      {showView && (
        <ActionIcon
          variant="view"
          labelId="VIEW"
          href={finalViewHref}
          onClick={handleView}
        />
      )}
      {showEdit && (
        <ActionIcon
          variant="edit"
          labelId="EDIT"
          href={finalEditHref}
          onClick={handleEdit}
        />
      )}
      {showDelete && (
        <ActionIcon
          variant="delete"
          labelId="DELETE"
          href={finalDeleteHref}
          onClick={handleDelete}
        />
      )}
    </div>
  );
}
