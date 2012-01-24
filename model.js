// モック的なモデル
module.exports = {
  user: {
    getCurrentUser: function() {
      return { id: 10000 };
    }
  },
  item: {
    items: [
      {
        id: 1,
        name: 'item1',
        description: 'item1 description',
        currencyCode: 'USD',
        price: '0.10'
      },
      {
        id: 2,
        name: 'item2',
        description: 'item2 description',
        currencyCode: 'USD',
        price: '0.20'
      },
      {
        id: 3,
        name: 'item3',
        description: 'item3 description',
        currencyCode: 'USD',
        price: '0.30'
      }
    ],
    getItems: function() {
      return this.items;
    },
    get: function(id) {
      return this.items[--id];
    }
  },
  payment: {
    save: function(obj, fn) {
      console.log('save:');
      console.log(obj);
      fn();
    }
  }
};
