import React from 'react';
import { Folder, OpenInBrowser, ProductionQuantityLimits, Upload } from '@mui/icons-material';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useStock } from '../../providers/StockProvider';
import { useInterface } from '@/app/providers/InterfaceProvider';

const Commit = () => {
  const { commit, setItem } = useStock();
  const { setBackdrop } = useInterface();

  const onCommit = async () => {
    setBackdrop(true);
    await commit()
    setItem([]);
    setBackdrop(false);
  }

  return (
    <div>
      <Button
        onClick={onCommit}
        variant='text'
        startIcon={<Upload />}
      >
        Commit
      </Button>
    </div>
  );
}

export default Commit