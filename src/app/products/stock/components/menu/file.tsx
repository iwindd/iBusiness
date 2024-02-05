import React from 'react';
import { Folder, ImportExport, OpenInBrowser } from '@mui/icons-material';
import { Button, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { useStock } from '../../providers/StockProvider';
import { useSnackbar } from 'notistack';
import { useInterface } from '@/app/providers/InterfaceProvider';
import fileSaver from 'file-saver';

const getFileContent = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      reject(new Error('Invalid file type. Expected a Blob.'));
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      if (event.target) {
        const content = event.target.result as string;
        resolve(content);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };

    reader.readAsText(file);
  });
};

const File = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { items, setItem, render } = useStock();
  const { enqueueSnackbar } = useSnackbar();
  const { setBackdrop } = useInterface();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const Open = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
      handleClose()
    }
  }

  const Export = () => {
    setBackdrop(true);
    handleClose();
    const content = items.reduce((cur, pv) => cur += `${pv.serial} ${pv.payload}\n`, "")

    const blob = new Blob([content], { type: 'text/plain' });
    try {
      fileSaver.saveAs(blob, "stock.txt")
      enqueueSnackbar("Export stock สำเร็จ!", { variant: "success" })
    } catch (error) {
      enqueueSnackbar("ไม่สามารถ export stock ได้", { variant: "error" })
    }

    setBackdrop(false);
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem([]);

    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (
        (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt'))
        &&
        (selectedFile instanceof Blob)
      ) {
        e.target.value = '';
        e.target.files = null;
        const content = await getFileContent(selectedFile);

        try {
          setBackdrop(true);
          await render(content)
          setBackdrop(false);
        } catch (error) {
          enqueueSnackbar("ไม่สามารถอ่านไฟล์ได้", { variant: "error" })
          setBackdrop(false);
          return;
        }
      } else {
        e.target.value = '';
        e.target.files = null;
        enqueueSnackbar("ไฟล์ไม่ถูกต้อง!", { variant: "error" })
      }
    }

  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        hidden
        accept=".txt"
      />
      <Button
        onClick={handleClick}
        variant='text'
        startIcon={<Folder />}
      >
        ไฟล์
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={Open}>
          <ListItemIcon>
            <OpenInBrowser fontSize="small" />
          </ListItemIcon>
          <ListItemText>นำเข้า</ListItemText>

        </MenuItem>
        <MenuItem onClick={Export}>
          <ListItemIcon>
            <ImportExport fontSize="small" />
          </ListItemIcon>
          <ListItemText>บันทึก</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
}

export default File