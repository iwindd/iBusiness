import { Box, Button } from '@mui/material';
import { GridToolbarContainer, GridToolbarQuickFilter } from '@mui/x-data-grid';
import React, { useEffect } from 'react'
import AddDialog from './components/add';
import { useInterface } from '../providers/InterfaceProvider';
import { Add } from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAllCategories } from '../categories/action';
import { Category } from '@prisma/client';


const CustomToolbar = () => {
  const { setDialog } = useInterface();
  const queryClient = useQueryClient();
  const [categories, setCategories] = React.useState<Category[]>([]);

  const addDialog = setDialog(AddDialog, {
    categories: categories,
    refetch: async () => {
      await queryClient.refetchQueries({ queryKey: ['products'], type: 'active' })
    }
  }, "lg")

  const { data, isLoading } = useQuery({
    queryKey: ["categories2"],
    queryFn: async () => {
      return await getAllCategories();
    }
  })

  useEffect(() => {
    if (data?.categories) {
      if (data.categories) setCategories(data.categories as Category[]);
    }
  }, [data])

  return (
    <GridToolbarContainer className='flex justify-between px-2'>
      <Box className='flex gap-2'>
        <Button
          startIcon={<Add />}
          onClick={addDialog.onOpen}
          variant='text'
          disabled={isLoading}
        >
          เพิ่มรายการ
        </Button>
      </Box>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  )
}

export default CustomToolbar