const fs = require('fs');

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

exports.checkId = (req, res, next, val) => {
  console.log(`Tour id is ${val}`);
  if (req.params.id * 1 > tours.length) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};
////////////////// ROUTE HANDLERS /////////////////////////////////////
/////////////////  get all tours  /////////////////////////////////////
exports.getAllTours = (req, res) => {
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
exports.getTour = (req, res) => {
  // console.log(req.params);
  const id = req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

/////////////////////////////// create a tour /////////////////////////////
exports.createTour = (req, res) => {
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

//////////////////  update details of a tour for a given id  /////////////////////////////
////no actual update done here as data is only in a file and that is not the case in reality
exports.updateTour = (req, res) => {
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
exports.deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null,
  });
};
