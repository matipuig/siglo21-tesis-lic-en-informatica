import Searcher from './Searcher';
import User from './User';
import UserSearcher from './UserSearcher';

Searcher.belongsToMany(User, { through: UserSearcher });
User.belongsToMany(Searcher, { through: UserSearcher });

export default { Searcher, User, UserSearcher };
