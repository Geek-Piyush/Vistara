class APIFewatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced Filtering - URL : 127.0.0.1:8000/api/v1/tours?duration[gte]=5&price[lte]=1500
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    //  2) Sorting - URL : 127.0.0.1:8000/api/v1/tours?sort=price,ratingsAverage

    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      console.log(sortBy);
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); //default sorting by created time
    }
    return this;
  }

  limitFeilds() {
    // 3) Limiting Fields - URL: 127.0.0.1:8000/api/v1/tours?fields=price,name,difficulty,duration (only to show selected fields)
    // For excluding selected field - URL: 127.0.0.1:8000/api/v1/tours?fields=-price,-name

    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); //default sorting by created time
    }
    return this;
  }

  paginate() {
    // 4) Pagination - URL: 127.0.0.1:8000/api/v1/tours?page=2&limit=3

    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFewatures;
