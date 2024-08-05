'use client';

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Stack, TextField, Typography, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, setDoc, getDoc, where } from 'firebase/firestore';

export default function Home() {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    updateInventory();
  }, []);

  const updateInventory = async () => {
    const categories = ['canned', 'drinks', 'snacks', 'spices'];
    const inventoryData = await Promise.all(
      categories.map(async (category) => {
        const snapshot = query(collection(firestore, 'inventory'), where('category', '==', category));
        const docs = await getDocs(snapshot);
        return docs.docs.map(doc => ({ name: doc.id, ...doc.data(), category }));
      })
    );
    setInventory(inventoryData.flat());
  };

  const addItem = async () => {
    const docRef = doc(collection(firestore, 'inventory'), itemName);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const { count } = snapshot.data();
      await setDoc(docRef, { count: count + 1, category: categoryName }, { merge: true });
    } else {
      await setDoc(docRef, { count: 1, category: categoryName });
    }

    await updateInventory();
    setItemName('');
    setCategoryName('');
    handleClose();
  };

  const removeItem = async (itemName) => {
    const docRef = doc(collection(firestore, 'inventory'), itemName);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const { count } = snapshot.data();
      if (count === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { count: count - 1 }, { merge: true });
      }
    }

    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      width='100vw'
      height='100vh'
      display='flex'
      justifyContent='center'
      alignItems='center'
      gap={2}
      flexDirection='column'
      padding={2}
    >
      <Button variant="contained" onClick={handleOpen}>
        Add Item
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          bgcolor='white'
          width={400}
          border='2px solid black'
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack spacing={2}>
            <TextField
              label="Item Name"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                label="Category"
              >
                <MenuItem value='canned'>Canned</MenuItem>
                <MenuItem value='drinks'>Drinks</MenuItem>
                <MenuItem value='snacks'>Snacks</MenuItem>
                <MenuItem value='spices'>Spices</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              onClick={addItem}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box border="1px solid #333" width="800px" padding={2}>
        <Typography variant='h2' color="#333" align="center">Inventory Items</Typography>
        <Stack spacing={2} overflow="auto" maxHeight="500px">
          {['canned', 'drinks', 'snacks', 'spices'].map(category => (
            <Box key={category}>
              <Typography variant='h4' color="#333">{category.charAt(0).toUpperCase() + category.slice(1)}</Typography>
              {inventory.filter(item => item.category === category).map(({ name, count }) => (
                <Box
                  key={name}
                  width="100%"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  bgcolor="#f0f0f0"
                  padding={2}
                  borderRadius={1}
                >
                  <Typography variant="h6" color="#333">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h6" color="#333">{count}</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => removeItem(name)}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
