/* eslint-disable */

/**
 * 1. create custom user
 * 2. create collection (Before MongoDB can save your new database, a collection name must also be specified at the time of creation.)
 */
db.createUser({
  user: 'tree_node',
  pwd: 'tree_node',
  roles: [
    {
      role: 'readWrite',
      db: 'tree_node'
    }
  ]
});

db.tree_node.insert({
  tree_node: 'tree-node'
});
