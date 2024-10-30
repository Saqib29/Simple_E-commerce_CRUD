export class Pagination {
    static paginate = (page = 1, limit = 10) => {
      if (page > 0 && limit > 0 && limit < 51) {
        const skip = page * limit - limit;
  
        return { page, limit: +limit, skip };
      }
  
      if (+page < 1) throw new Error('Page Not Found');
  
      if (+limit > 50) throw new Error('Limit must be less than 50');
  
      if (+limit <= 0) throw new Error('Limit has limition');
    };
  }
