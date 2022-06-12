// Wrapper for mocking Supabase queries
export const mockWrapSBQuery = (data) => {
  return {
    data,
    select: function (colString) {
      const cols = colString.split(", ");
      const data = this.data.map((obj) => {
        return cols.reduce((res, key) => {
          if (obj[key]) res[key] = obj[key];
          return res;
        }, {});
      });
      return mockWrapSBQuery(data);
    },
    eq: function (prop, val) {
      return mockWrapSBQuery(this.data.filter((obj) => obj[prop] === val));
    },
    single: function () {
      if (this.data.length > 1)
        throw new Error(
          "single method called on data of length greater than 1"
        );
      return mockWrapSBQuery(...this.data);
    },
  };
};
