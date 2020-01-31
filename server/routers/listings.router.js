const router = require('express').Router();
const pool = require('../modules/pool');

// GET route to get DB
router.get('/', (req,res) =>{
  let queryString = `SELECT * FROM listings;`
  pool.query(queryString).then(result=>{
    res.send(result.rows);
  }).catch(error=>{
    console.log('Router GET error:', error);
    res.sendStatus(400);
  })
});

// POST route to get input values
router.post('/', (req,res) =>{
  const newListing = req.body;
  let queryString = `INSERT INTO "listings" ("cost", "sqft", "type", "city", "image_path") VALUES ($1, $2, $3, $4, $5);`;
  pool.query(queryString, [newListing.cost, newListing.sqft, newListing.type, newListing.city, newListing.image_path] ).then(result=>{
    res.sendStatus(200);
  }).catch(error=>{
    console.log('Router POST error:', error);
    res.sendStatus(400);
  })
});

// DELETE route targets id
router.delete('/:id', (req, res) =>{
  const id = req.params.id;
  let queryString = `DELETE FROM listings WHERE id = $1;`;
  pool.query(queryString,[id]).then(result=>{
    res.sendStatus(200);
  }).catch(error=>{
    console.log('Router DELETE error:', error);
    res.sendStatus(400);
  })
});

module.exports = router;
