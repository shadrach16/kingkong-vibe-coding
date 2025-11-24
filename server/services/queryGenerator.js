import User from '../models/User.js';

const VALID_ACTIONS = ['find'];
const VALID_COLLECTIONS = ['users'];
const VALID_SORT_VALUES = [-1, 1];

const executeQueryPlan = async (queryPlan) => {
  const { collection, action, filter, sort, limit } = queryPlan;

  // 1. Basic Validation
  if (!VALID_COLLECTIONS.includes(collection)) {
    throw new Error('Invalid collection specified in query plan.');
  }
  if (!VALID_ACTIONS.includes(action)) {
    throw new Error('Invalid action specified in query plan.');
  }

  // 2. Dynamic Query Construction
  let query = User.find(filter);

  if (Object.keys(sort).length > 0) {
    // 3. Validate sort values for security
    for (const key in sort) {
      if (!VALID_SORT_VALUES.includes(sort[key])) {
        throw new Error(`Invalid sort value for key '${key}'. Must be 1 or -1.`);
      }
    }
    query = query.sort(sort);
  }

  if (limit) {
    query = query.limit(limit);
  }

  // 4. Execute the Query
  const result = await query.exec();
  return result;
};

export { executeQueryPlan };