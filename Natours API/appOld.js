const fs = require('fs');

const express = require('express');
const morgan = require('morgan');

const app = express();

// 1) MIDDLEWARES
app.use(morgan('dev'));
//express.json() is the MiddleWare
app.use(express.json());

/////// Building our own MiddleWare
app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

///////////////////////////////////////////////////////////////////////
/////sample

// app.get('/', (req, res) => {
//   res.status(200).send('Hello from the server side');
// });

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'natours' });
// });

// app.post('/', (reg, res) => {
//   res.send('You can post to this endpoint...');
// });
//                                                     sample end /////////

///////////////////////////////////////////////////////////////////////
/////////////////////  API  ///////////////////////////////////////////
////// data in file tours-simple.json

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

////////////////// ROUTE HANDLERS /////////////////////////////////////
/////////////////  get all tours  /////////////////////////////////////
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: tours.length, //send this only when u specify array(not mandatory)
    data: {
      tours,
    },
  });
};

//////////////////  get tour for a given id  /////////////////////////////
// (:id is the variable in the url)
//to make :id optional add ? eg-- :id/:x? Now x is optional
const getTour = (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  // if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

/////////////////////////////// create a tour /////////////////////////////
const createTour = (req, res) => {
  // console.log(req.body);   //express requires middleware to access details of req.body
  const newId = tours[tours.length - 1].id + 1;
  console.log(newId);
  const newTour = Object.assign({ id: newId }, req.body);
  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        // status 201 means created
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

//////////////////  patch details of a tour for a given id  /////////////////////////////
////no actual update done here as data is only in a file and that is not the case in reality
const updateTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<updated tour here...>',
    },
  });
};

//////////////////  delete tour for a given id  /////////////////////////////
////no actual update done here as data is only in a file and that is not the case in reality
////status(204) means no content(as no data is sent back)
const deleteTour = (req, res) => {
  const id = req.params.id * 1;

  if (id > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
};

//////////////////////////Resource--Users//////////////////////
//status(500) means internal server error
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
////////////////////////// Routes ////////////////////////////
// app.get('/api/v1/tours', getAllTours);
// app.post('/api/v1/tours', createTour);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour);

app.route('/api/v1/tours').get(getAllTours).post(createTour);
app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app.route('/api/v1/users').get(getAllUsers).post(createUser);
app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

//////////////////////// START SERVER /////////////////////////////
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
