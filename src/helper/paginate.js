const paginate = (model) => {
  return (req, res, next) => {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);

    const startindex = (page - 1) * limit;
    const lastIndex = page * limit;

    const response = {};
    response.result = model.slice(startindex, lastIndex);
    result.previous = {
      page: page - 1,
      limit,
    };
    result.next = {
      page: page + 1,
      limit,
    };
  };
};
