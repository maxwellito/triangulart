/**
 * Storage syntax
 *
 * canvas_index = [{id: 1, name: 'Love', date: 1254483840, {id: 2, name: 'Love', date: 1254483840, ...]
 * canvas_lastid = 5
 * canvas_1 = {...}
 * 
 */

const INDEX_KEY = 'workspace_index';
const INDEX_NEXT_ID = 'workspace_nextid';
const INDEX_BASE_KEY = 'workspace_';

var storage = {

  indexes: null,

  loadIndexes: function () {
    if (!this.indexes) {
      try {
        this.indexes = JSON.parse(localStorage.getItem(INDEX_KEY)) || []
      }
      catch (e) {
        throw new Error('Triangulart | storage::loadIndexes | Error while retrieving the indexes from the local storage')
      }
    }
    return this.indexes
  },

  saveIndexes: function () {
    if (this.indexes) {
      try {
        localStorage.setItem(INDEX_KEY, JSON.stringify(this.indexes))
      }
      catch (e) {
        throw new Error('Triangulart | storage::saveIndexes | Error while saving the indexes on the local storage')
      }
    }
    return this.indexes
  },

  getIndex: function (id) {
    var item = this.loadIndexes().find(x => x.id === id)
    if (!item) {
      throw new Error('Triangulart | storage::getIndex | Error while retrieving an item from its index')
    }
    return item
  },

  getItem: function (id) {
    var item = JSON.parse(localStorage.getItem(INDEX_BASE_KEY + id))
    if (!item) {
      throw new Error('Triangulart | storage::getItem | Trying to retrieve unexisting data')
    }
    return item
  },

  renameItem: function (id, name) {
    var item = this.getIndex(id)
    item.name = name
    this.saveIndexes()
  },

  updateItem: function (id, data) {
    var item = this.getIndex(id)
    item.date = +(new Date())
    localStorage.setItem(INDEX_BASE_KEY + id, data)
  },

  createItem: function (name) {
    let id = +(localStorage.getItem(INDEX_NEXT_ID)) || 0
    localStorage.setItem(INDEX_NEXT_ID, id + 1)

    var item = {
      id,
      name,
      date: +(new Date())
    }
    this.loadIndexes().push(item)
    this.saveIndexes()
    return item
  },

  deleteItem: function (id) {
    var itemIndex = this.loadIndexes().findIndex(x => x.id === id)
    if (!~itemIndex) {
      throw new Error('Triangulart | storage::deleteItem | Couldn\'t find the item to delete')
    }
    this.indexes.splice(itemIndex, 1)
    this.saveIndexes()
  }
}