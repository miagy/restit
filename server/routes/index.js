module.exports = (app) => {

  // todoList Routes
  app.route('/get-with-timeout')
    .get((req, res) => {
        setTimeout(()=>{
          res.send({code: 'SUCA'})
        }, 40000)
    })
};

