import { Card } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React from 'react';

import PropTypes from 'prop-types';

const BlankCard = ({ children, className, sx }) => {
  // Disable card shadow for clean appearance
  const isCardShadow = false;

  const theme = useTheme();
  const borderColor = "#e7e7e7";

  return (
    <Card
      sx={{ p: 0, border: !isCardShadow ? `1px solid ${borderColor}` : 'none', position: 'relative', ...sx }}
      className={className}
      elevation={isCardShadow ? 9 : 0}
      variant={!isCardShadow ? 'outlined' : undefined}
    >
      {children}
    </Card>
  );
};

BlankCard.propTypes = {
  children: PropTypes.node,
};

export default BlankCard;
