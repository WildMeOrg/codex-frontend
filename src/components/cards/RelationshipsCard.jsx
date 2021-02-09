import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import ViewChart from '@material-ui/icons/BubbleChart';
import ViewList from '@material-ui/icons/ViewList';
import Button from '../Button';
import Card from './Card';
import Text from '../Text';
import SvgText from '../SvgText';
import FemaleIcon from '../svg/FemaleIcon';
import MaleIcon from '../svg/MaleIcon';
import SexUnsureIcon from '../svg/SexUnsureIcon';

const linkLength = 35;

const colorMap = {
  Brother: '#66c2a5',
  Mother: '#fc8d62',
  Friend: '#8da0cb',
};

const sexIconMap = {
  Male: MaleIcon,
  Female: FemaleIcon,
  Unsure: SexUnsureIcon,
};

function Node({
  x,
  y,
  fill,
  title,
  subtitle,
  linkColor,
  Icon,
  size = 8,
}) {
  const theme = useTheme();
  const linkStroke = linkColor || theme.palette.grey['900'];

  console.log(Icon);
  return (
    <g>
      <line
        x1={x}
        y1={y}
        x2={50}
        y2={50}
        stroke={linkStroke}
        strokeWidth={0.5}
      />
      <circle
        cx={x}
        cy={y}
        r={size}
        fill={fill}
        stroke={linkStroke}
        strokeWidth={0.5}
      />
      {Icon && (
        <Icon
          style={{ transform: `translate(${x}px, ${y - 5.5}px)` }}
        />
      )}
      <SvgText x={x} y={subtitle ? y + 2.5 : y + 1} fontSize="2.75">
        {title}
      </SvgText>
      {subtitle && (
        <SvgText x={x} y={y + 5.5} fontSize="2">
          {subtitle}
        </SvgText>
      )}
    </g>
  );
}

export default function RelationshipsCard({
  title,
  titleId = 'SIGHTINGS',
  relationships = [],
}) {
  const theme = useTheme();
  const backgroundColor = theme.palette.grey['200'];
  return (
    <Card
      title={title}
      titleId={titleId}
      renderActions={
        <div>
          <IconButton
            style={{ color: theme.palette.primary.main }}
            aria-label="View chart"
          >
            <ViewChart />
          </IconButton>
          <IconButton aria-label="View list">
            <ViewList />
          </IconButton>
        </div>
      }
    >
      {relationships.length === 0 ? (
        <Text style={{ marginTop: 8, marginBottom: 12 }}>
          This individual has no relationships.
        </Text>
      ) : (
        <div>
          <svg viewBox="0 0 100 100">
            <rect
              x={0}
              width={100}
              y={0}
              height={100}
              fill={backgroundColor}
            />
            {relationships.map((relationship, i) => {
              const currentAngle =
                (i * 2 * Math.PI) / relationships.length -
                0.5 * Math.PI;
              const x = Math.sin(currentAngle) * linkLength + 50;
              const y = Math.cos(currentAngle) * linkLength + 50;

              const Icon = sexIconMap[relationship.sex];
              return (
                <Node
                  title={relationship.individual}
                  subtitle={relationship.type}
                  x={x}
                  y={y}
                  fill={colorMap[relationship.type]}
                  Icon={Icon}
                />
              );
            })}
            <Node
              title="Teddy"
              x={50}
              y={50}
              size={10}
              fill={theme.palette.grey['100']}
            />
          </svg>
        </div>
      )}
      <Button display="basic" startIcon={<AddIcon />} size="small">
        Add relationship
      </Button>
    </Card>
  );
}
