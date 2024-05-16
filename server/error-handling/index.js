module.exports = (app) => {
  app.use((req, res, next) => {
    // this middleware runs whenever requested page is not available
    res.status(404).json({ message: "This route does not exist" });
  });

  app.use((err, req, res, next) => {
    // whenever you call next(err), this middleware will handle the error
    // always logs the error
    console.error("ERROR", req.method, req.path, err);

    // only render if the error ocurred before sending the response
    if (!res.headersSent) {
      res.status(500).json({
        message: "Internal server error. Check the server console",
      });
    }
  });
};

// OR
// function errorHandler(err, req, res, next) {
//   // This middleware has 4 arguments. It will run whenever `next(err)` is called.

//   // Log the error first
//   console.error("ERROR", req.method, req.path, err);

//   // Check if the response was already sent, as sending a response twice for the same request will cause an error.
//   if (!res.headersSent) {
//     // If not, send a response with status code 500 and a generic error message
//     res
//       .status(500)
//       .json({ message: "Internal server error. Check the server console" });
//   }
// }

// function notFoundHandler(req, res, next) {
//   // This middleware will run whenever the requested route is not found
//   res.status(404).json({ message: "This route does not exist" });
// }

// module.exports = {
//   errorHandler,
//   notFoundHandler,
// };

// _____if so, you have to import in app.js that way:___________
// // Import the custom error handling middleware in app.js:
// const { errorHandler, notFoundHandler } = require('./middleware/error-handling');

// // Set up custom error handling middleware:
// app.use(notFoundHandler);
// app.use(errorHandler);
