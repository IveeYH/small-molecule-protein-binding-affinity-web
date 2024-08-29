import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Fade,
  Container,
  CircularProgress,
  Button,
  TextField,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  Grow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CasinoIcon from '@mui/icons-material/Casino'; // Dice icon
import { parse } from 'papaparse';

const styles = {
  fullHeight: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem 1rem', // Added padding to ensure space around the container
  },
  container: {
    background: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
    borderRadius: '15px',
    padding: '2rem',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '600px', // Ensure the container does not exceed a reasonable width
    margin: 'auto', // Center the container in the middle of the screen
    overflowY: 'auto', // Allow scrolling if content overflows
  },
  title: {
    fontFamily: "'Roboto', sans-serif",
    fontWeight: 700,
    letterSpacing: '2px',
    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
    textTransform: 'lowercase',
    color: '#880e4f',
    marginBottom: '2rem',
  },
  footer: {
    marginTop: '4rem',
    textAlign: 'center',
    color: '#880e4f',
  },
};

const resultStyles = {
  resultBox: (isBinded) => ({
    marginBottom: '16px',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: isBinded ? '0 0 20px #d81b60' : '0 4px 10px rgba(216, 27, 96, 0.2)',
    backgroundColor: isBinded ? '#fce4ec' : '#f0f0f0',
    transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
    opacity: isBinded ? 1 : 0.6,
    border: isBinded ? '2px solid #d81b60' : '1px solid #ccc',
    position: 'relative',
    maxWidth: '100%',
    wordWrap: 'break-word',
    overflow: 'hidden',  // Prevents content from overflowing the container
  }),
  smilesText: {
    fontWeight: 500,
    color: '#d81b60',
    marginBottom: '8px',
    whiteSpace: 'normal',  // Allows text to wrap
    wordBreak: 'break-all', // Breaks long SMILES strings to prevent overflow
  },
  badge: (isBinded) => ({
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    backgroundColor: isBinded ? '#d81b60' : '#cccccc',
    color: isBinded ? '#fff' : '#666',
    fontSize: '12px',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
  }),
  affinityText: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#d81b60',
    marginTop: '8px',
  },
  percentageBarContainer: {
    backgroundColor: '#f8bbd0',
    borderRadius: '4px',
    height: '10px',
    marginTop: '8px',
    overflow: 'hidden',
  },
  percentageBar: (isBinded) => ({
    backgroundColor: isBinded ? '#d81b60' : '#b0b0b0',
    height: '100%',
    borderRadius: '4px',
  }),
  checkmark: {
    position: 'absolute',
    top: '8px', // Position inside the container
    right: '8px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#d81b60',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    animation: 'bounceIn 0.5s ease-out',
    '@keyframes bounceIn': {
      '0%': { transform: 'scale(0)' },
      '50%': { transform: 'scale(1.2)' },
      '100%': { transform: 'scale(1)' },
    },
  },
  cross: {
    position: 'absolute',
    top: '8px', // Position inside the container
    right: '8px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#b0b0b0',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    animation: 'fadeIn 0.5s ease-out',
    '@keyframes fadeIn': {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
  },
};

const PredictionForm = () => {
  const [proteinCode, setProteinCode] = useState('');
  const [molecules, setMolecules] = useState([{ id: Date.now(), smiles: '' }]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);  // Separate state for error tracking
  const [smilesList, setSmilesList] = useState([]);

  // Load SMILES data from the CSV file on mount
  useEffect(() => {
    fetch('/test_smiles_list.csv')
      .then((response) => response.text())
      .then((csvText) => {
        const parsedData = parse(csvText, { header: true, skipEmptyLines: true });
        const smilesArray = parsedData.data.map((row) => row['molecule_smiles']);
        setSmilesList(smilesArray.filter((smiles) => smiles)); // Filter out any empty or undefined entries
      });
  }, []);

  const handleMoleculeChange = (index, value) => {
    const updatedMolecules = [...molecules];
    updatedMolecules[index].smiles = value;
    setMolecules(updatedMolecules);
  };

  const handleAddMolecule = () => {
    const availableSmiles = smilesList.filter((smiles) => !molecules.some((molecule) => molecule.smiles === smiles));
    if (availableSmiles.length > 0) {
      const randomSmiles = availableSmiles[Math.floor(Math.random() * availableSmiles.length)];
      setMolecules([...molecules, { id: Date.now(), smiles: randomSmiles }]);
    }
  };

  const handleRemoveMolecule = (index) => {
    const updatedMolecules = molecules.filter((_, i) => i !== index);
    setMolecules(updatedMolecules);
  };

  const handleRandomSmiles = (index) => {
    const availableSmiles = smilesList.filter((smiles) => !molecules.some((molecule) => molecule.smiles === smiles));
    if (availableSmiles.length > 0) {
      const randomSmiles = availableSmiles[Math.floor(Math.random() * availableSmiles.length)];
      handleMoleculeChange(index, randomSmiles);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);  // Reset error before a new submission
  
    const requestBody = molecules.map((molecule, index) => ({
      id: index + 1,
      smiles: molecule.smiles,
    }));

    const baseUrl = process.env.REACT_APP_API_BASE_URL;
  
    const apiUrl = `${baseUrl}/predict/${proteinCode}`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      
      const data = await response.json();
      setResult(data);
      
    } catch (error) {
      console.error('Error:', error);
      setError('Something went wrong');  // Set the error message
      setResult(null);  // Ensure result is cleared if there's an error
    } finally {
      setLoading(false);
    }
  };
  
  const renderResult = () => {
    if (error) {
      return <Typography color="error">Error: {error}</Typography>;
    }
  
    if (!result) {
      return null;  // Return null if there's no result or error to display
    }
  
    const sortedResults = result.sort((a, b) => a.id - b.id);
  
    return sortedResults.map((molecule, index) => (
      <Box key={index} style={resultStyles.resultBox(molecule.is_binded)}>
        <Typography variant="h6" style={resultStyles.smilesText}>
          Molecule SMILES {index + 1}:
        </Typography>
        <Typography variant="body1" style={resultStyles.smilesText}>
          {molecule.smiles}
        </Typography>
        <span style={resultStyles.badge(molecule.is_binded)}>
          {molecule.is_binded ? 'Binds' : 'Does Not Bind'}
        </span>
        {molecule.is_binded ? (
          <div style={resultStyles.checkmark}>✔</div>
        ) : (
          <div style={resultStyles.cross}>✖</div>
        )}
        <Typography variant="body2" style={resultStyles.affinityText}>
          Binding Affinity: {(molecule.binding_affinity * 100).toFixed(2)}%
        </Typography>
        <Box style={resultStyles.percentageBarContainer}>
          <Box
            style={{
              ...resultStyles.percentageBar(molecule.is_binded),
              width: `${molecule.binding_affinity * 100}%`,
            }}
          />
        </Box>
      </Box>
    ));
  };
  
  return (
    <Fade in={true} timeout={1000}>
      <Box style={styles.fullHeight}>
        <Container maxWidth="sm" style={styles.container}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="h4" gutterBottom align="center" style={styles.title}>
              drugscope.
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <FormControl variant="outlined" fullWidth margin="normal">
                <InputLabel id="protein-select-label">Select Protein</InputLabel>
                <Select
                  labelId="protein-select-label"
                  value={proteinCode}
                  onChange={(e) => setProteinCode(e.target.value)}
                  label="Select Protein"
                  required
                  style={styles.inputField}
                >
                  <MenuItem value="sEH">sEH</MenuItem>
                  <MenuItem value="BRD4">BRD4</MenuItem>
                  <MenuItem value="HSA">HSA</MenuItem>
                </Select>
              </FormControl>
  
              {molecules.map((molecule, index) => (
                <Grow in={true} key={molecule.id} timeout={500}>
                  <Box display="flex" alignItems="center" width="100%" mt={2}>
                    <Tooltip title="Generate random SMILES">
                      <IconButton
                        aria-label="random smiles"
                        onClick={() => handleRandomSmiles(index)}
                        color="primary"
                        style={styles.diceButton}
                      >
                        <CasinoIcon />
                      </IconButton>
                    </Tooltip>
                    <TextField
                      label={`Molecule SMILES ${index + 1}`}
                      variant="outlined"
                      fullWidth
                      value={molecule.smiles}
                      onChange={(e) => handleMoleculeChange(index, e.target.value)}
                      required
                      style={styles.inputField}
                    />
                    <IconButton
                      aria-label="remove molecule"
                      onClick={() => handleRemoveMolecule(index)}
                      disabled={molecules.length === 1}
                      color="secondary"
                      style={{ marginLeft: '8px' }}
                    >
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                </Grow>
              ))}
  
              <Box display="flex" justifyContent="center" my={2} width="100%">
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleAddMolecule}
                  fullWidth
                  style={styles.button}
                >
                  Add Another SMILES
                </Button>
              </Box>
  
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                style={styles.button}
              >
                Predict
              </Button>
            </form>
  
            {loading && (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress color="primary" />
              </Box>
            )}
            <Box mt={4}>{renderResult()}</Box>
          </Box>
          <Box style={styles.footer}>
            <Typography variant="caption">
              drugscope. © 2024 | <a href="https://yourwebsite.com" style={{ color: '#880e4f' }}>Your Website</a> |{' '}
              <a href="https://yourwebsite.com/contact" style={{ color: '#880e4f' }}>
                Contact Us
              </a>
            </Typography>
          </Box>
        </Container>
      </Box>
    </Fade>
  );
};

export default PredictionForm;