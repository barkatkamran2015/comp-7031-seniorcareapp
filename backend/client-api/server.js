const express = require('express');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');
const app = express();
const port = 3000;

app.use(express.json());

// Serve static files from the "photos" directory
app.use('/photos', express.static(path.join(__dirname, 'photos')));

// Load clients from YAML file
function loadClients() {
  try {
    const fileContents = fs.readFileSync(
      path.join(__dirname, 'clients.yaml'),
      'utf8',
    );
    return yaml.load(fileContents);
  } catch (error) {
    console.error('Error loading clients.yaml:', error);
    return [];
  }
}

const clients = loadClients();

// 1. Get a list of all clients (first set of fields only)
app.get('/clients', (req, res) => {
  const clientList = clients.map(
    ({
      id,
      firstName,
      lastName,
      unitNumber,
      buildingName,
      photoUrl,
      status,
    }) => ({
      id,
      firstName,
      lastName,
      unitNumber,
      buildingName,
      photoUrl,
      status,
    }),
  );
  res.json(clientList);
});

// 2. Get full details of a single client by ID
app.get('/clients/:id', (req, res) => {
  const clientId = req.params.id;
  const client = clients.find(client => client.id === clientId);

  if (!client) {
    return res.status(404).json({message: 'Client not found'});
  }

  res.json(client);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
