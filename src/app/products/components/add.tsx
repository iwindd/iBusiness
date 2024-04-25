"use client";
import { DialogProps, useInterface } from '@/app/providers/InterfaceProvider'
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, CircularProgress, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputSearch, Inputs, Schema, SchemaSearch } from './schema';
import { Rotate90DegreesCcw } from '@mui/icons-material';
import { generateRandomEAN13 } from '@/libs/utils';
import { findProduct, upsertProduct } from '../action';
import { useSnackbar } from 'notistack';
import { Category, Product } from '@prisma/client';

const AddDialog = (props: DialogProps<{
  categories: Category[],
  refetch: () => void
}>) => {

}

export default AddDialog